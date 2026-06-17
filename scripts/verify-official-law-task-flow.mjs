/* global fetch */

const DEFAULT_QUESTION =
  "건축법 제49조 기준으로 이 task의 피난시설 검토를 진행하고, 공식 법규 원문과 API 조회 시점을 근거로 WIKI 등록 가능한 검토 기록을 만들어줘.";

const args = parseArgs(process.argv.slice(2));
const origin = readArg(args, "origin") ?? "http://localhost:3000";
const taskId = readArg(args, "task-id");
const question = readArg(args, "question") ?? DEFAULT_QUESTION;
const mode = normalizeMode(readArg(args, "mode") ?? "preview");

if (!taskId) {
  throw new Error("Missing required --task-id argument.");
}

const authPayload = await requestJson("/api/auth/me");
const authUser = authPayload.user ?? authPayload.data?.user ?? authPayload.data ?? authPayload;

const recordsBefore = mode === "preview" ? await requestJsonOrNull(`/api/assistant/records?taskId=${encodeURIComponent(taskId)}`) : null;
const recordCountBefore = countDataRows(recordsBefore);

const reviewResponse = await requestJson("/api/assistant/task-review", {
  method: "POST",
  body: {
    taskId,
    question,
    mode,
  },
  allowedStatus: [200, 201, 409],
});
const review = reviewResponse.data ?? reviewResponse;

if (!review?.wiki || review.wiki.approvalAttempted !== false || review.wiki.candidateCreated !== false) {
  throw new Error("task-review must not create or approve WIKI candidates.");
}

const recordsAfter = mode === "preview" ? await requestJsonOrNull(`/api/assistant/records?taskId=${encodeURIComponent(taskId)}`) : null;
const recordCountAfter = countDataRows(recordsAfter);
if (mode === "preview" && recordCountBefore !== null && recordCountAfter !== null && recordCountBefore !== recordCountAfter) {
  throw new Error(`preview mode changed assistant record count from ${recordCountBefore} to ${recordCountAfter}.`);
}

if (review.status === "generated" && review.savedRecord?.candidateState !== "not_candidate") {
  throw new Error(`generated task-review records must remain not_candidate, got ${review.savedRecord?.candidateState ?? "<missing>"}.`);
}

const result = {
  status: review.status === "blocked" ? "blocked" : "completed",
  origin,
  mode,
  auth: {
    id: authUser.id,
    email: authUser.email,
    role: authUser.role,
    status: authUser.status,
  },
  task: {
    taskId: review.taskContext?.taskId ?? taskId,
    issueId: review.taskContext?.issueId ?? null,
    title: review.taskContext?.title ?? null,
  },
  retrievedEvidence: review.retrievedEvidence ?? null,
  officialLawVerification: review.officialLawVerification
    ? {
        provider: review.officialLawVerification.provider,
        status: review.officialLawVerification.status,
        checkedAt: review.officialLawVerification.checkedAt,
        locators: review.officialLawVerification.locators,
        sources: review.officialLawVerification.sources,
        failures: review.officialLawVerification.failures,
        retry: review.officialLawVerification.retry,
      }
    : null,
  generation: review.generation ?? null,
  savedRecord: review.savedRecord
    ? {
        id: review.savedRecord.id,
        confidenceScore: review.savedRecord.confidenceScore,
        candidateState: review.savedRecord.candidateState,
        runtimeMode: review.savedRecord.runtimeMode,
      }
    : null,
  structuredReviewSchema: review.structuredReviewSchema
    ? {
        lawCitationCount: review.structuredReviewSchema.lawCitations?.length ?? 0,
        checklistItemCount: review.structuredReviewSchema.checklistItems?.length ?? 0,
        warningCount: review.structuredReviewSchema.warnings?.length ?? 0,
        wikiCandidateDraftAllowed: review.structuredReviewSchema.wikiCandidateDraft?.allowed ?? false,
      }
    : null,
  wiki: {
    candidateCreated: false,
    approvalAttempted: false,
    approvedKnowledgeItemId: null,
    reason: review.wiki.reason ?? "task-review keeps Knowledge WIKI approval outside the Browser Assistant verifier.",
  },
  previewWriteCheck:
    mode === "preview"
      ? {
          recordCountBefore,
          recordCountAfter,
          recordWrites: recordCountBefore !== null && recordCountAfter !== null ? recordCountAfter - recordCountBefore : null,
        }
      : null,
};

console.log(JSON.stringify(result, null, 2));

if (review.status === "blocked") {
  process.exit(1);
}

function normalizeMode(value) {
  if (value === "preview" || value === "generate") {
    return value;
  }
  throw new Error("--mode must be preview or generate.");
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
  const allowedStatus = options.allowedStatus ?? [200];

  if (!allowedStatus.includes(response.status)) {
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

function countDataRows(payload) {
  if (!payload) {
    return null;
  }
  const data = payload.data ?? payload;
  return Array.isArray(data) ? data.length : null;
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
