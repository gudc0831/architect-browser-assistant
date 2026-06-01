import type {
  AssistantEvidence,
  TaskResultVerification,
  TaskResultVerificationApiSource,
  TaskResultVerificationLaw,
} from "../saas/contracts";
import type { OfficialLawVerificationReport } from "./official-law-api";
import { OFFICIAL_LAW_PROVIDER_NAME } from "./official-law-api";

const PROHIBITED_FINAL_LEGAL_CLAIMS = [
  "무조건 적법합니다",
  "인허가 통과됩니다",
  "이대로 진행해도 문제 없습니다",
];

export function buildTaskResultVerification(input: {
  question: string;
  answer: string;
  evidence: AssistantEvidence[];
  officialLawReport: OfficialLawVerificationReport | null;
  now?: () => Date;
}): TaskResultVerification {
  const checkedAt = (input.now?.() ?? new Date()).toISOString();
  const report = input.officialLawReport;

  if (!report || report.status === "not_required") {
    return {
      status: "not_required",
      checkedAt,
      laws: [],
      apiSources: [],
      basis: ["법규 판단이 필요한 task로 감지되지 않아 공식 법령 API 검증을 생략했습니다."],
      failures: [],
      retry: [],
    };
  }

  const verifiedSources = report.sources.filter((source) => source.status === "verified");
  const laws: TaskResultVerificationLaw[] = verifiedSources.map((source) => ({
    lawName: source.lawName,
    articleLabel: source.articleLabel,
    articleNumber: source.articleNumber,
    effectiveDate: source.effectiveDate,
    sourceUrl: source.sourceUrl,
    apiSourceUrl: source.apiUrl,
    checkedAt: source.checkedAt,
    basisExcerpt: trimForRecord(source.articleText ?? "", 260),
  }));
  const apiSources: TaskResultVerificationApiSource[] = report.sources.map((source) => ({
    name: OFFICIAL_LAW_PROVIDER_NAME,
    url: source.apiUrl,
    checkedAt: source.checkedAt,
    status: source.status,
  }));

  const failures = [...report.failures];
  const prohibited = PROHIBITED_FINAL_LEGAL_CLAIMS.filter((claim) => input.answer.includes(claim));
  if (prohibited.length > 0) {
    failures.push(`금지된 확정 표현이 답변에 포함되어 있습니다: ${prohibited.join(", ")}`);
  }

  const answerGrounded = laws.some(
    (law) =>
      input.answer.includes(law.lawName) ||
      Boolean(law.articleLabel && input.answer.includes(law.articleLabel)) ||
      input.evidence.some(
        (item) =>
          item.verificationStatus === "verified" &&
          item.lawName === law.lawName &&
          (!law.articleLabel || item.articleLabel === law.articleLabel),
      ),
  );

  if (laws.length === 0) {
    failures.push("공식 법령 API에서 확인된 법규 원문이 없습니다.");
  } else if (!answerGrounded) {
    failures.push("생성 답변이 확인된 법령명 또는 조항을 직접 언급하지 않아 근거 연결 검토가 필요합니다.");
  }

  const basis =
    laws.length > 0
      ? laws.map((law) =>
          [
            `${law.lawName}${law.articleLabel ? ` ${law.articleLabel}` : ""}`,
            law.effectiveDate ? `시행일자 ${formatDateToken(law.effectiveDate)}` : "",
            `${law.checkedAt} 공식 API 조회`,
            law.basisExcerpt,
          ]
            .filter(Boolean)
            .join(" · "),
        )
      : ["공식 법령 API 원문 확인에 실패했습니다."];

  return {
    status: failures.length === 0 ? "verified" : laws.length > 0 ? "needs_review" : "failed",
    checkedAt,
    laws,
    apiSources,
    basis,
    failures,
    retry: failures.length > 0 ? report.retry : [],
  };
}

export function appendVerificationRecordToAnswer(answer: string, verification: TaskResultVerification) {
  if (verification.status === "not_required") {
    return answer;
  }

  const lawRows =
    verification.laws.length > 0
      ? verification.laws
          .map((law) =>
            [
              `- 법규: ${law.lawName}${law.articleLabel ? ` ${law.articleLabel}` : ""}`,
              law.effectiveDate ? `  시행일자: ${formatDateToken(law.effectiveDate)}` : "",
              `  API 출처: ${law.apiSourceUrl}`,
              `  조회 시점: ${law.checkedAt}`,
              `  판단 근거: ${law.basisExcerpt}`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n")
      : "- 공식 API에서 확인된 법규 원문 없음";

  const failureRows =
    verification.failures.length > 0
      ? `\n검증 제한:\n${verification.failures.map((failure) => `- ${failure}`).join("\n")}`
      : "";
  const retryRows =
    verification.retry.length > 0
      ? `\n재시도/대체 경로:\n${verification.retry.map((item) => `- ${item}`).join("\n")}`
      : "";

  return [
    answer.trim(),
    "",
    "출처 검증 기록",
    `검증 상태: ${verification.status}`,
    `검증 시점: ${verification.checkedAt}`,
    lawRows,
    failureRows,
    retryRows,
  ]
    .filter(Boolean)
    .join("\n");
}

function trimForRecord(value: string, maxLength: number) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function formatDateToken(value: string) {
  return /^\d{8}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
}
