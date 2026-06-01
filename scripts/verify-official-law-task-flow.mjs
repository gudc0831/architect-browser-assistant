/* global fetch */
import {
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
} from "../src/legal/official-law-api.ts";
import {
  appendVerificationRecordToAnswer,
  buildTaskResultVerification,
} from "../src/legal/task-result-verification.ts";

const DEFAULT_QUESTION =
  "건축법 제49조 기준으로 이 task의 피난시설 검토를 진행하고, 공식 법규 원문과 API 조회 시점을 근거로 WIKI 등록 가능한 검토 기록을 만들어줘.";

const args = parseArgs(process.argv.slice(2));
const origin = readArg(args, "origin") ?? "http://localhost:3000";
const taskId = readArg(args, "task-id");
const question = readArg(args, "question") ?? DEFAULT_QUESTION;
const oc = readArg(args, "oc") ?? "test";

if (!taskId) {
  throw new Error("Missing required --task-id argument.");
}

const authPayload = await requestJson("/api/auth/me");
const authUser = authPayload.user ?? authPayload.data?.user ?? authPayload.data ?? authPayload;

const retrievePayload = await requestJson("/api/assistant/retrieve", {
  method: "POST",
  body: {
    taskId,
    question,
  },
});
const retrieved = retrievePayload.data ?? retrievePayload;
const taskContext = retrieved.taskContext;
const retrievedEvidence = Array.isArray(retrieved.evidence) ? retrieved.evidence : [];

const lawReport = await verifyOfficialLawEvidence({
  question,
  evidence: retrievedEvidence,
  oc,
});
const officialEvidence = lawReport.sources.map(officialLawSourceToEvidence).filter(Boolean);
const evidence = [...officialEvidence, ...retrievedEvidence];

const answerDraft = buildAnswer({
  taskContext,
  lawReport,
  unavailableEvidenceKinds: retrieved.unavailableEvidenceKinds ?? [],
});
const verification = buildTaskResultVerification({
  question,
  answer: answerDraft,
  evidence,
  officialLawReport: lawReport,
});
const answer = appendVerificationRecordToAnswer(answerDraft, verification);
const confidenceScore = verification.status === "verified" ? 92 : verification.status === "needs_review" ? 78 : 45;
const tags = [...new Set(["official-law-api", "source-verification", ...verification.laws.map((law) => law.lawName)])].slice(
  0,
  12,
);
const conclusion = buildConclusion(verification);
const followUpAction = buildFollowUpAction(verification);

if (verification.status === "failed") {
  console.log(
    JSON.stringify(
      {
        status: "blocked",
        reason: "Official law verification failed before assistant record/WIKI candidate creation.",
        origin,
        auth: {
          id: authUser.id,
          email: authUser.email,
          role: authUser.role,
          status: authUser.status,
        },
        task: {
          taskId,
          issueId: taskContext?.issueId ?? null,
          title: taskContext?.title ?? null,
        },
        retrievedEvidence: {
          count: retrievedEvidence.length,
          regulationCount: retrievedEvidence.filter((item) => item.kind === "regulation").length,
          unavailableEvidenceKinds: retrieved.unavailableEvidenceKinds ?? [],
        },
        officialLawVerification: {
          provider: lawReport.provider,
          status: lawReport.status,
          checkedAt: lawReport.checkedAt,
          locators: lawReport.locators,
          apiSources: verification.apiSources,
          failures: verification.failures,
          retry: verification.retry,
        },
        savedRecord: null,
        summaryDraft: null,
        wiki: {
          skipped: true,
          approvalAttempted: false,
          reason: "WIKI candidate creation is skipped when official law API verification has no verified source.",
        },
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const recordPayload = await requestJson("/api/assistant/records", {
  method: "POST",
  body: {
    taskId,
    question,
    answer,
    evidence,
    confidenceScore,
    confidenceReason: `공식 법령 API ${lawReport.status} 상태와 SaaS task evidence ${retrievedEvidence.length}건을 함께 사용했습니다. 검증 상태: ${verification.status}.`,
    executionMode: "saas-api",
    runtimeMode: "official-law-api-verification",
    draftSummary: {
      conclusion,
      tags,
      scope: "official-law-api task verification",
      followUpAction,
    },
  },
});
const record = recordPayload.data ?? recordPayload;

const candidateDetail = await requestJsonOrNull(`/api/admin/knowledge/candidates/${encodeURIComponent(record.id)}`);

const postCandidateRetrievePayload = await requestJson("/api/assistant/retrieve", {
  method: "POST",
  body: {
    taskId,
    question,
  },
});
const postCandidateRetrieved = postCandidateRetrievePayload.data ?? postCandidateRetrievePayload;
const centralKnowledgeEvidence = Array.isArray(postCandidateRetrieved.evidence)
  ? postCandidateRetrieved.evidence.filter((item) => item.kind === "central_knowledge")
  : [];

console.log(
  JSON.stringify(
    {
      status: "completed",
      origin,
      auth: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        status: authUser.status,
      },
      task: {
        taskId,
        issueId: taskContext?.issueId ?? null,
        title: taskContext?.title ?? null,
      },
      retrievedEvidence: {
        count: retrievedEvidence.length,
        regulationCount: retrievedEvidence.filter((item) => item.kind === "regulation").length,
        unavailableEvidenceKinds: retrieved.unavailableEvidenceKinds ?? [],
      },
      officialLawVerification: {
        provider: lawReport.provider,
        status: lawReport.status,
        checkedAt: lawReport.checkedAt,
        laws: verification.laws.map((law) => ({
          lawName: law.lawName,
          articleLabel: law.articleLabel,
          articleNumber: law.articleNumber,
          effectiveDate: law.effectiveDate,
          apiSourceUrl: law.apiSourceUrl,
          checkedAt: law.checkedAt,
          basisExcerpt: law.basisExcerpt,
        })),
        apiSources: verification.apiSources,
        failures: verification.failures,
        retry: verification.retry,
      },
      savedRecord: {
        id: record.id,
        confidenceScore: record.confidenceScore,
        candidateState: record.candidateState,
      },
      summaryDraft: {
        embeddedInRecord: Boolean(record.draftSummary),
        conclusion,
        scope: "official-law-api task verification",
      },
      wiki: {
        candidateCreated: record.candidateState === "candidate" || record.candidateState === "pending_review",
        candidateState: candidateDetail?.data?.state ?? record.candidateState ?? null,
        candidateRecordId: record.id,
        approvalAttempted: false,
        approvedKnowledgeItemId: null,
        userActionRequired: "A Knowledge admin must review and approve the candidate in the SaaS UI/API.",
      },
      postCandidateRetrieve: {
        centralKnowledgeEvidenceCount: centralKnowledgeEvidence.length,
        centralKnowledgeEvidenceIds: centralKnowledgeEvidence.map((item) => item.id),
        note: "New WIKI candidates do not appear as central_knowledge evidence until a user approves them.",
      },
    },
    null,
    2,
  ),
);

function buildAnswer({ taskContext, lawReport, unavailableEvidenceKinds }) {
  const verifiedSources = lawReport.sources.filter((source) => source.status === "verified");
  const sourceRows =
    verifiedSources.length > 0
      ? verifiedSources.map((source) =>
          [
            `- ${source.lawName}${source.articleLabel ? ` ${source.articleLabel}` : ""}`,
            source.effectiveDate ? `시행일자 ${formatDate(source.effectiveDate)}` : "",
            `조회 시점 ${source.checkedAt}`,
            `API ${source.apiUrl}`,
            source.articleText ? trim(source.articleText, 280) : "",
          ]
            .filter(Boolean)
            .join(" / "),
        )
      : ["- 공식 API에서 확인된 법규 원문 없음"];
  const unavailable =
    unavailableEvidenceKinds.length > 0
      ? `\n추가 제한: SaaS retrieval에서 ${unavailableEvidenceKinds.join(", ")} 근거는 사용할 수 없었습니다.`
      : "";

  return [
    `Task ${taskContext?.issueId ?? taskId} 검토 기록`,
    "판단: 법규 관련 검토는 공식 법령 원문과 task 맥락을 근거로 진행하되, 도면 수치와 프로젝트 조건 확인 전 최종 적법 판정은 보류합니다.",
    "",
    "공식 법규 근거",
    ...sourceRows,
    unavailable,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildConclusion(verification) {
  const lawText =
    verification.laws.length > 0
      ? verification.laws.map((law) => `${law.lawName}${law.articleLabel ? ` ${law.articleLabel}` : ""}`).join(", ")
      : "공식 법규 원문";
  return `${lawText}을 공식 API로 확인했고, task 검토 결과는 출처 검증 기록과 함께 WIKI 후보로 등록 가능한 상태입니다. 검증 상태: ${verification.status}.`;
}

function buildFollowUpAction(verification) {
  if (verification.retry.length > 0) {
    return `검증 제한사항을 재확인하세요: ${verification.retry.join(" / ")}`;
  }
  return "도면, 용도, 층수, 지자체 조례 근거를 추가 연결한 뒤 최종 인허가 판단으로 승격하세요.";
}

async function requestJson(path, options = {}) {
  const method = options.method ?? "GET";
  const headers = {
    Accept: "application/json",
  };
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }
  if (method !== "GET") {
    headers.Origin = origin;
  }

  const response = await fetch(`${origin}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${method} ${path} failed with HTTP ${response.status}: ${trim(text, 1200)}`);
  }

  return payload;
}

async function requestJsonOrNull(path, options = {}) {
  try {
    return await requestJson(path, options);
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const result = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) {
      continue;
    }
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result.set(key, true);
      continue;
    }
    result.set(key, next);
    index += 1;
  }
  return result;
}

function readArg(argsMap, key) {
  const value = argsMap.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function trim(value, maxLength) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function formatDate(value) {
  return /^\d{8}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
}
