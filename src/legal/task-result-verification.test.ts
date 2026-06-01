import { describe, expect, it } from "vitest";
import type { OfficialLawVerificationReport } from "./official-law-api";
import { appendVerificationRecordToAnswer, buildTaskResultVerification } from "./task-result-verification";

describe("task result verification", () => {
  it("records law, article, API source, checked time, and basis for grounded answers", () => {
    const verification = buildTaskResultVerification({
      question: "건축법 제49조 기준 검토",
      answer: "건축법 제49조 기준으로는 추가 프로젝트 조건 확인이 필요합니다.",
      evidence: [],
      officialLawReport: officialReport(),
      now: () => new Date("2026-05-28T01:00:00.000Z"),
    });

    expect(verification.status).toBe("verified");
    expect(verification.laws[0]).toEqual(
      expect.objectContaining({
        lawName: "건축법",
        articleLabel: "제49조",
        apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=eflaw&ID=001234&JO=004900&type=JSON",
        checkedAt: "2026-05-28T00:00:00.000Z",
      }),
    );
    expect(verification.basis[0]).toContain("피난시설");

    const answerWithRecord = appendVerificationRecordToAnswer("검토 답변", verification);
    expect(answerWithRecord).toContain("출처 검증 기록");
    expect(answerWithRecord).toContain("법규: 건축법 제49조");
    expect(answerWithRecord).toContain("API 출처");
  });

  it("marks answers with final legal claims as needing review", () => {
    const verification = buildTaskResultVerification({
      question: "건축법 제49조 기준 검토",
      answer: "건축법 제49조 기준으로 무조건 적법합니다.",
      evidence: [],
      officialLawReport: officialReport(),
      now: () => new Date("2026-05-28T01:00:00.000Z"),
    });

    expect(verification.status).toBe("needs_review");
    expect(verification.failures[0]).toContain("금지된 확정 표현");
  });
});

function officialReport(): OfficialLawVerificationReport {
  return {
    status: "verified",
    checkedAt: "2026-05-28T00:00:00.000Z",
    provider: {
      name: "국가법령정보센터",
      docsUrl: "https://open.law.go.kr/LSO/openApi/guideList.do",
    },
    locators: [
      {
        lawName: "건축법",
        articleLabel: "제49조",
        articleNumber: "004900",
      },
    ],
    sources: [
      {
        status: "verified",
        lawName: "건축법",
        articleLabel: "제49조",
        articleNumber: "004900",
        lawId: "001234",
        effectiveDate: "20260528",
        apiUrl: "https://www.law.go.kr/DRF/lawService.do?target=eflaw&ID=001234&JO=004900&type=JSON",
        checkedAt: "2026-05-28T00:00:00.000Z",
        articleText: "제49조(피난시설 등의 설치) 건축물에는 피난시설을 설치하여야 한다.",
        reason: "국가법령정보센터 Open API에서 원문을 확인했습니다.",
      },
    ],
    failures: [],
    retry: [],
  };
}
