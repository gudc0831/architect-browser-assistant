import { afterEach, describe, expect, it, vi } from "vitest";
import {
  extractLawArticleLocators,
  officialLawSourceToEvidence,
  verifyOfficialLawEvidence,
} from "./official-law-api";

describe("official law API verification", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("uses SaaS-returned verified legal evidence without calling law.go.kr or OC", async () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal("fetch", fetchImpl);

    const report = await verifyOfficialLawEvidence({
      question: "건축법 제49조 기준으로 검토해줘",
      evidence: [
        {
          id: "reg-1",
          kind: "regulation",
          priority: 2,
          title: "「건축법」 제49조",
          excerpt: "제49조(피난시설 등의 설치) 건축물에는 피난시설을 설치하여야 한다.",
          officialSourceName: "국가법령정보센터",
          lawName: "건축법",
          articleLabel: "제49조",
          articleNumber: "004900",
          effectiveDate: "20260528",
          checkedAt: "2026-05-28T00:00:00.000Z",
          apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?OC=secret&target=eflaw&ID=001234",
          verificationStatus: "verified",
        },
      ],
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(fetchImpl).not.toHaveBeenCalled();
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

  it("fails closed when legal verification would require direct Browser Assistant API access", async () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal("fetch", fetchImpl);

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
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(report.status).toBe("failed");
    expect(report.sources[0]).toEqual(
      expect.objectContaining({
        status: "api_error",
        lawName: "건축법",
      }),
    );
    expect(report.sources[0].apiUrl).toBe("https://open.law.go.kr/LSO/openApi/guideList.do");
    expect(report.failures[0]).toContain("Browser Assistant는 국가법령정보센터 Open API를 직접 호출하지 않습니다");
    expect(report.retry[0]).toContain("verificationStatus=verified");
  });

  it("fails closed when any requested law locator lacks matching verified evidence", async () => {
    const report = await verifyOfficialLawEvidence({
      question: "건축법 제49조 기준으로 검토해줘",
      evidence: [
        {
          id: "building-unverified",
          kind: "regulation",
          priority: 2,
          title: "건축법 제49조",
          excerpt: "피난 및 방화 기준 seed",
        },
        {
          id: "parking-verified",
          kind: "regulation",
          priority: 2,
          title: "주차장법 제6조",
          excerpt: "주차장 설치 기준",
          lawName: "주차장법",
          articleLabel: "제6조",
          articleNumber: "000600",
          officialSourceName: "국가법령정보센터",
          checkedAt: "2026-07-10T00:00:00.000Z",
          apiSourceUrl: "https://www.law.go.kr/DRF/lawService.do?target=law&type=JSON&ID=000000",
          verificationStatus: "verified",
        },
      ],
      now: () => new Date("2026-07-10T00:00:00.000Z"),
    });

    expect(report.status).toBe("failed");
    expect(report.locators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lawName: "건축법", articleLabel: "제49조" }),
        expect.objectContaining({ lawName: "주차장법", articleLabel: "제6조" }),
      ]),
    );
    expect(report.failures.length).toBeGreaterThan(0);
  });

  it("returns a clear failure when a legal task has no law locator", async () => {
    const report = await verifyOfficialLawEvidence({
      question: "법규 기준으로 적합한지 확인해줘",
      evidence: [],
      now: () => new Date("2026-05-28T00:00:00.000Z"),
    });

    expect(report.status).toBe("failed");
    expect(report.sources[0].status).toBe("missing_query");
    expect(report.retry.length).toBeGreaterThan(0);
  });
});
