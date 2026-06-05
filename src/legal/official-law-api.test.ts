import { describe, expect, it, vi } from "vitest";
import {
  extractLawArticleLocators,
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
} from "./official-law-api";

describe("official law API verification", () => {
  it("extracts law and article locators from regulation evidence", () => {
    const locators = extractLawArticleLocators("피난 검토", [
      {
        id: "reg-1",
        kind: "regulation",
        priority: 2,
        title: "「건축법」 제49조 피난시설",
        excerpt: "법제처 공식 출처 확인 대상",
      },
    ]);

    expect(locators).toEqual([
      expect.objectContaining({
        lawName: "건축법",
        articleLabel: "제49조",
        articleNumber: "004900",
        evidenceId: "reg-1",
      }),
    ]);
  });

  it("combines regulation law names with the article locator from the task question", () => {
    const locators = extractLawArticleLocators("건축법 제49조 기준으로 피난 검토해줘", [
      {
        id: "reg-seed",
        kind: "regulation",
        priority: 2,
        title: "건축법 피난ㆍ방화 기준 확인 seed",
        excerpt: "조문 전문은 공식 원문에서 재확인한다.",
      },
    ]);

    expect(locators).toEqual([
      expect.objectContaining({
        lawName: "건축법",
        articleLabel: "제49조",
        articleNumber: "004900",
        evidenceId: "reg-seed",
      }),
    ]);
  });

  it("prioritizes known architecture law names over noisy seed prose", () => {
    const locators = extractLawArticleLocators("건축법 제49조 기준으로 피난 검토해줘", [
      {
        id: "reg-seed",
        kind: "regulation",
        priority: 2,
        title: "건축법 피난ㆍ방화 기준 확인 seed",
        excerpt:
          "방화 관련 검토가 나오면 국가법령정보센터의 건축법 원문과 시행령을 확인한다. 공식 법 검색 결과를 근거로 삼는다.",
        sourceUrl: "https://www.law.go.kr/법령/건축법",
      },
    ]);

    expect(locators.map((locator) => locator.lawName)).toEqual(["건축법"]);
    expect(locators[0]).toEqual(
      expect.objectContaining({
        lawName: "건축법",
        articleLabel: "제49조",
        articleNumber: "004900",
      }),
    );
    expect(locators.map((locator) => locator.lawName)).not.toContain("방화 관련 검토가 나오면 국가법");
  });

  it("extracts housing construction standard rules from unquoted task prose", () => {
    const locators = extractLawArticleLocators(
      "공동주택 단지내 도로 경사도 검토를 주택건설기준 등에 관한 규칙 제6조의2 기준으로 진행해줘",
      [],
    );

    expect(locators).toEqual([
      expect.objectContaining({
        lawName: "주택건설기준 등에 관한 규칙",
        articleLabel: "제6조의2",
        articleNumber: "000602",
      }),
    ]);
  });

  it("verifies a regulation article through the official law API and redacts OC from recorded URLs", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("lawSearch.do")) {
        return jsonResponse({
          LawSearch: {
            law: [
              {
                법령명한글: "건축법",
                법령ID: "001234",
                법령일련번호: "123456",
                시행일자: "20260528",
                소관부처명: "국토교통부",
                법령상세링크: "/법령/건축법",
              },
            ],
          },
        });
      }

      return jsonResponse({
        법령: {
          조문: {
            조문단위: [
              {
                조문번호: "49",
                조문가지번호: "0",
                조문제목: "피난시설 등의 설치",
                조문내용: "제49조(피난시설 등의 설치) 건축물에는 피난시설을 설치하여야 한다.",
                항: [{ 항내용: "① 주요구조부와 피난시설은 대통령령으로 정하는 기준에 따른다." }],
              },
            ],
          },
        },
      });
    }) as unknown as typeof fetch;

    const report = await verifyOfficialLawEvidence({
      question: "건축법 제49조 기준으로 검토해줘",
      evidence: [
        {
          id: "reg-1",
          kind: "regulation",
          priority: 2,
          title: "「건축법」 제49조",
          excerpt: "피난시설 설치 기준",
        },
      ],
      fetchImpl,
      oc: "official-test",
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(report.status).toBe("verified");
    expect(report.sources[0]).toEqual(
      expect.objectContaining({
        status: "verified",
        lawName: "건축법",
        articleLabel: "제49조",
        effectiveDate: "20260528",
      }),
    );
    expect(report.sources[0].apiUrl).not.toContain("OC=");

    const evidence = officialLawSourceToEvidence(report.sources[0]);
    expect(evidence).toEqual(
      expect.objectContaining({
        kind: "regulation",
        priority: 0,
        officialSourceName: "국가법령정보센터",
        lawName: "건축법",
        articleLabel: "제49조",
        verificationStatus: "verified",
      }),
    );
    expect(evidence?.excerpt).toContain("피난시설");
  });

  it("binds official API fetch calls for worker-safe invocation", async () => {
    const fetchImpl = vi.fn(function (this: unknown, input: RequestInfo | URL) {
      if (this !== globalThis) {
        throw new TypeError("Illegal invocation");
      }

      const url = String(input);
      if (url.includes("lawSearch.do")) {
        return Promise.resolve(
          jsonResponse({
            LawSearch: {
              law: [{ 법령명한글: "건축법", 법령ID: "001234", 시행일자: "20260528" }],
            },
          }),
        );
      }

      return Promise.resolve(
        jsonResponse({
          법령: {
            조문: {
              조문단위: [{ 조문번호: "49", 조문내용: "제49조 피난시설 원문" }],
            },
          },
        }),
      );
    }) as unknown as typeof fetch;

    const report = await verifyOfficialLawEvidence({
      question: "건축법 제49조 기준으로 검토해줘",
      evidence: [],
      fetchImpl,
      oc: "official-test",
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(report.status).toBe("verified");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("reports official API authentication failures as API errors", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        result: "사용자 정보 검증에 실패하였습니다.",
        msg: "OPEN API 호출 시 사용자 검증을 위하여 정확한 서버장비의 IP주소 및 도메인주소를 등록해 주세요.",
      }),
    ) as unknown as typeof fetch;

    const report = await verifyOfficialLawEvidence({
      question: "건축법 제49조 기준으로 검토해줘",
      evidence: [
        {
          id: "reg-1",
          kind: "regulation",
          priority: 2,
          title: "「건축법」 제49조",
          excerpt: "피난시설 설치 기준",
        },
      ],
      fetchImpl,
      oc: "invalid-oc",
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(report.status).toBe("failed");
    expect(report.sources[0]).toEqual(
      expect.objectContaining({
        status: "api_error",
        lawName: "건축법",
      }),
    );
    expect(report.sources[0].apiUrl).toContain("lawSearch.do");
    expect(report.sources[0].apiUrl).not.toContain("OC=");
    expect(report.failures[0]).toContain("사용자 정보 검증");
    expect(report.retry).toContain("법제처 Open API 인증값(OC)과 네트워크 접근 권한을 확인한 뒤 다시 조회하세요.");
  });

  it("returns a clear failure when a legal task has no law locator", async () => {
    const report = await verifyOfficialLawEvidence({
      question: "법규 기준으로 적합한지 확인해줘",
      evidence: [],
      oc: "official-test",
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(report.status).toBe("failed");
    expect(report.sources[0].status).toBe("missing_query");
    expect(report.retry.length).toBeGreaterThan(0);
  });
});

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
