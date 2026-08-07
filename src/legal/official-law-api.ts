import type { AssistantEvidence } from "../saas/contracts";

export const OFFICIAL_LAW_PROVIDER_NAME = "국가법령정보센터";
export const OFFICIAL_LAW_API_DOCS_URL = "https://open.law.go.kr/LSO/openApi/guideList.do";

const MAX_LOCATORS = 5;

const KNOWN_ARCHITECTURE_LAWS = [
  "건축법 시행규칙",
  "건축법 시행령",
  "건축법",
  "건축물의 피난ㆍ방화구조 등의 기준에 관한 규칙",
  "건축물의 설비기준 등에 관한 규칙",
  "주택건설기준 등에 관한 규칙",
  "주택건설기준 등에 관한 규정",
  "국토의 계획 및 이용에 관한 법률 시행령",
  "국토의 계획 및 이용에 관한 법률",
  "주차장법 시행규칙",
  "주차장법 시행령",
  "주차장법",
  "소방시설 설치 및 관리에 관한 법률 시행령",
  "소방시설 설치 및 관리에 관한 법률",
  "장애인ㆍ노인ㆍ임산부 등의 편의증진 보장에 관한 법률 시행령",
  "장애인ㆍ노인ㆍ임산부 등의 편의증진 보장에 관한 법률",
  "녹색건축물 조성 지원법 시행령",
  "녹색건축물 조성 지원법",
];

export type OfficialLawApiStatus = "verified" | "not_found" | "api_error" | "missing_query";

export type LawArticleLocator = {
  lawName: string;
  articleLabel?: string;
  articleNumber?: string;
  evidenceId?: string;
  sourceUrl?: string;
};

export type OfficialLawApiSource = {
  status: OfficialLawApiStatus;
  lawName: string;
  articleLabel?: string;
  articleNumber?: string;
  lawId?: string;
  lawSequenceNumber?: string;
  effectiveDate?: string;
  promulgationDate?: string;
  ministry?: string;
  sourceUrl?: string;
  apiUrl: string;
  searchApiUrl?: string;
  checkedAt: string;
  articleText?: string;
  reason: string;
  evidenceId?: string;
};

export type OfficialLawVerificationReport = {
  status: "not_required" | "verified" | "failed";
  checkedAt: string;
  provider: {
    name: typeof OFFICIAL_LAW_PROVIDER_NAME;
    docsUrl: typeof OFFICIAL_LAW_API_DOCS_URL;
  };
  locators: LawArticleLocator[];
  sources: OfficialLawApiSource[];
  failures: string[];
  retry: string[];
};

export type VerifyOfficialLawEvidenceInput = {
  question: string;
  evidence: AssistantEvidence[];
  now?: () => Date;
};

export function requiresOfficialLawVerification(question: string, evidence: AssistantEvidence[]) {
  if (evidence.some((item) => item.kind === "regulation")) {
    return true;
  }

  return /법규|법령|건축법|시행령|시행규칙|조례|고시|인허가|허가|적법|조항|피난|방화|용적률|건폐율|주차장법/.test(
    question,
  ) || /주택건설기준|공동주택|단지\s*(?:내|안)|도로\s*경사/.test(question);
}

export function extractLawArticleLocators(question: string, evidence: AssistantEvidence[]) {
  const locators: LawArticleLocator[] = [];
  const regulationEvidence = evidence.filter((item) => item.kind === "regulation");
  const inputs = regulationEvidence.length > 0 ? regulationEvidence : [];
  const questionArticle = extractArticleLocator(question);
  const questionLawNames = new Set(extractLawNames(question).map(normalizeLawName));

  for (const item of inputs) {
    const text = [item.title, item.excerpt, item.sourceUrl].filter(Boolean).join("\n");
    const fromUrl = item.sourceUrl ? extractLocatorFromLawUrl(item.sourceUrl) : null;
    const explicitArticle = extractArticleLocator(text) ?? fromUrl;
    const sourceLawNames = item.sourceUrl ? extractLawNamesFromLawUrl(item.sourceUrl) : [];
    const lawNames = sourceLawNames.length > 0 ? sourceLawNames : extractLawNames(text);

    for (const lawName of lawNames) {
      const article =
        explicitArticle ?? (questionArticle && questionLawNames.has(normalizeLawName(lawName)) ? questionArticle : null);
      if (questionArticle && !explicitArticle && !questionLawNames.has(normalizeLawName(lawName))) {
        continue;
      }
      locators.push({
        lawName,
        articleLabel: article?.articleLabel,
        articleNumber: article?.articleNumber,
        evidenceId: item.id,
        sourceUrl: item.sourceUrl,
      });
    }
  }

  if (locators.length === 0 && requiresOfficialLawVerification(question, evidence)) {
    const article = questionArticle;
    for (const lawName of extractLawNames(question)) {
      locators.push({
        lawName,
        articleLabel: article?.articleLabel,
        articleNumber: article?.articleNumber,
      });
    }
  }

  return dedupeLocators(locators).slice(0, MAX_LOCATORS);
}

export async function verifyOfficialLawEvidence(
  input: VerifyOfficialLawEvidenceInput,
): Promise<OfficialLawVerificationReport> {
  const checkedAt = (input.now?.() ?? new Date()).toISOString();
  const provider = {
    name: OFFICIAL_LAW_PROVIDER_NAME,
    docsUrl: OFFICIAL_LAW_API_DOCS_URL,
  } as const;

  if (!requiresOfficialLawVerification(input.question, input.evidence)) {
    return {
      status: "not_required",
      checkedAt,
      provider,
      locators: [],
      sources: [],
      failures: [],
      retry: [],
    };
  }

  const locators = extractLawArticleLocators(input.question, input.evidence);
  if (locators.length === 0) {
    return {
      status: "failed",
      checkedAt,
      provider,
      locators,
      sources: [
        {
          status: "missing_query",
          lawName: "",
          apiUrl: OFFICIAL_LAW_API_DOCS_URL,
          checkedAt,
          reason: "법령명 또는 조문 번호를 regulation evidence나 질문에서 찾지 못했습니다.",
        },
      ],
      failures: ["법령명 또는 조문 번호를 찾지 못해 공식 출처 검증을 시작할 수 없습니다."],
      retry: [
        "Architect SaaS retrieval이 verified-legal-evidence-api에서 검증된 법규 evidence를 반환하는지 확인하세요.",
        "질문이나 task evidence에 법령명과 조문(예: 건축법 제49조)을 명시하세요.",
      ],
    };
  }

  const verifiedEvidence = input.evidence.filter(isVerifiedOfficialEvidence);
  const verifiedSources = buildVerifiedSourcesFromEvidence(verifiedEvidence, locators, checkedAt);
  const allLocatorsVerified = locators.every((locator) =>
    verifiedEvidence.some((item) => locatorMatchesEvidence(locator, item)),
  );
  if (verifiedSources.length > 0 && allLocatorsVerified) {
    return {
      status: "verified",
      checkedAt,
      provider,
      locators,
      sources: verifiedSources,
      failures: [],
      retry: [],
    };
  }

  const reason =
    "Browser Assistant는 국가법령정보센터 Open API를 직접 호출하지 않습니다. 법규 원문 검증은 Architect SaaS가 verified-legal-evidence-api를 서버 간 호출해 제공한 evidence metadata만 사용합니다.";
  return {
    status: "failed",
    checkedAt,
    provider,
    locators,
    sources: locators.map((locator) => ({
      status: "api_error",
      lawName: locator.lawName,
      articleLabel: locator.articleLabel,
      articleNumber: locator.articleNumber,
      sourceUrl: locator.sourceUrl,
      apiUrl: OFFICIAL_LAW_API_DOCS_URL,
      checkedAt,
      reason,
      evidenceId: locator.evidenceId,
    })),
    failures: [reason],
    retry: [
      "Architect SaaS의 /api/assistant/task-review 응답에 verificationStatus=verified regulation evidence가 포함되는지 확인하세요.",
      "verified-legal-evidence-api 배포 환경에 LAW_OPEN_DATA_OC와 R2 read 설정이 있는지 서버 측에서 확인하세요.",
    ],
  };
}

export function officialLawSourceToEvidence(source: OfficialLawApiSource): AssistantEvidence | null {
  if (source.status !== "verified" || !source.articleText) {
    return null;
  }

  const article = source.articleLabel ? ` ${source.articleLabel}` : "";
  const effectiveDate = source.effectiveDate ? ` 시행일자 ${formatDateToken(source.effectiveDate)}.` : "";
  return {
    id: `official-law:${source.lawId || source.lawSequenceNumber || normalizeText(source.lawName)}:${
      source.articleNumber || "all"
    }`,
    kind: "regulation",
    priority: 0,
    title: `${source.lawName}${article} 원문 확인`,
    excerpt: [
      `${OFFICIAL_LAW_PROVIDER_NAME} 검증 metadata로 ${source.checkedAt}에 확인했습니다.${effectiveDate}`,
      trimText(source.articleText, 900),
    ].join("\n"),
    sourceUrl: source.sourceUrl || source.apiUrl,
    recordId: source.evidenceId,
    confidenceWeight: 0.95,
    officialSourceName: OFFICIAL_LAW_PROVIDER_NAME,
    lawName: source.lawName,
    articleLabel: source.articleLabel,
    articleNumber: source.articleNumber,
    effectiveDate: source.effectiveDate,
    checkedAt: source.checkedAt,
    apiSourceUrl: source.apiUrl,
    verificationStatus: "verified",
  };
}

function buildVerifiedSourcesFromEvidence(
  evidence: AssistantEvidence[],
  locators: LawArticleLocator[],
  checkedAt: string,
) {
  const matchedEvidence = evidence.filter((item) =>
    locators.some((locator) => locatorMatchesEvidence(locator, item)),
  );
  const seen = new Set<string>();
  const sources: OfficialLawApiSource[] = [];

  for (const item of matchedEvidence) {
    const article = extractArticleLocator([item.title, item.excerpt, item.sourceUrl].filter(Boolean).join("\n"));
    const lawName = item.lawName || extractLawNames([item.title, item.excerpt].join("\n"))[0] || item.title;
    const articleNumber = item.articleNumber || article?.articleNumber;
    const articleLabel = item.articleLabel || article?.articleLabel;
    const key = `${normalizeLawName(lawName)}:${articleNumber || ""}:${item.id}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    sources.push({
      status: "verified",
      lawName,
      articleLabel,
      articleNumber,
      effectiveDate: item.effectiveDate,
      sourceUrl: item.sourceUrl,
      apiUrl: sanitizeApiSourceUrl(item.apiSourceUrl || item.sourceUrl),
      searchApiUrl: item.apiSourceUrl ? sanitizeApiSourceUrl(item.apiSourceUrl) : undefined,
      checkedAt: item.checkedAt || checkedAt,
      articleText: item.excerpt,
      reason:
        "Architect SaaS retrieval이 verified-legal-evidence-api에서 검증된 법규 evidence metadata를 반환했습니다.",
      evidenceId: item.id,
    });
  }

  return sources;
}

function isVerifiedOfficialEvidence(item: AssistantEvidence) {
  return (
    item.kind === "regulation" &&
    item.verificationStatus === "verified" &&
    Boolean(item.officialSourceName || item.checkedAt || item.apiSourceUrl)
  );
}

function locatorMatchesEvidence(locator: LawArticleLocator, item: AssistantEvidence) {
  if (locator.evidenceId && locator.evidenceId === item.id) {
    return true;
  }

  const itemText = [item.lawName, item.title, item.excerpt, item.sourceUrl].filter(Boolean).join("\n");
  const hasLawName =
    Boolean(item.lawName && normalizeLawName(item.lawName) === normalizeLawName(locator.lawName)) ||
    itemText.includes(locator.lawName);
  const hasArticle =
    !locator.articleNumber ||
    item.articleNumber === locator.articleNumber ||
    item.articleLabel === locator.articleLabel ||
    itemText.includes(locator.articleLabel || "");
  return hasLawName && hasArticle;
}

function extractLawNames(text: string) {
  const names = new Set<string>();
  const orderedNames: string[] = [];
  const normalizedText = normalizeWhitespace(text);
  const addName = (value: string) => {
    const cleaned = cleanLawName(value);
    if (!isUsefulLawName(cleaned) || names.has(cleaned)) {
      return;
    }
    names.add(cleaned);
    orderedNames.push(cleaned);
  };

  for (const knownLaw of KNOWN_ARCHITECTURE_LAWS) {
    if (normalizedText.includes(knownLaw)) {
      addName(knownLaw);
    }
  }

  for (const match of normalizedText.matchAll(/「([^」]{2,80}?(?:법|시행령|시행규칙|조례|규칙|고시))」/g)) {
    addName(match[1]);
  }

  for (const match of normalizedText.matchAll(/([가-힣ㆍ·\s]{2,60}?(?:법 시행령|법 시행규칙|법|조례|규칙|고시))/g)) {
    addName(match[1]);
  }

  return orderedNames;
}

function extractArticleLocator(text: string): Pick<LawArticleLocator, "articleLabel" | "articleNumber"> | null {
  const match = normalizeWhitespace(text).match(/제\s*(\d{1,4})\s*조(?:\s*의\s*(\d{1,2}))?/);
  if (!match) {
    return null;
  }

  const main = Number(match[1]);
  const sub = match[2] ? Number(match[2]) : 0;
  if (!Number.isInteger(main) || main <= 0 || !Number.isInteger(sub) || sub < 0) {
    return null;
  }

  return {
    articleLabel: `제${main}조${sub > 0 ? `의${sub}` : ""}`,
    articleNumber: `${String(main).padStart(4, "0")}${String(sub).padStart(2, "0")}`,
  };
}

function extractLocatorFromLawUrl(sourceUrl: string): Pick<LawArticleLocator, "articleLabel" | "articleNumber"> | null {
  try {
    const url = new URL(sourceUrl);
    const jo = url.searchParams.get("JO");
    if (jo && /^\d{6}$/.test(jo)) {
      const parsed = parseArticleNumber(jo);
      return parsed
        ? {
            articleNumber: jo,
            articleLabel: `제${parsed.main}조${parsed.sub > 0 ? `의${parsed.sub}` : ""}`,
          }
        : null;
    }

    return extractArticleLocator(decodeURIComponent(url.pathname));
  } catch {
    return null;
  }
}

function extractLawNamesFromLawUrl(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    if (!/law\.go\.kr$/i.test(url.hostname)) {
      return [];
    }

    const decodedPath = decodeURIComponent(url.pathname);
    const match = decodedPath.match(/\/법령\/([^/?#]+)/);
    if (!match) {
      return [];
    }

    const rawName = cleanLawName(match[1]);
    const knownLaw = KNOWN_ARCHITECTURE_LAWS.find((lawName) => normalizeLawName(lawName) === normalizeLawName(rawName));
    const lawName = knownLaw ?? rawName;
    return isUsefulLawName(lawName) ? [lawName] : [];
  } catch {
    return [];
  }
}

function dedupeLocators(locators: LawArticleLocator[]) {
  const seen = new Set<string>();
  return locators.filter((locator) => {
    const key = `${normalizeLawName(locator.lawName)}:${locator.articleNumber || ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function parseArticleNumber(value: string) {
  if (!/^\d{6}$/.test(value)) {
    return null;
  }

  return {
    main: Number(value.slice(0, 4)),
    sub: Number(value.slice(4, 6)),
  };
}

function cleanLawName(value: string) {
  return normalizeWhitespace(value)
    .replace(/^(근거|관련|현재|공식|다음|및|또는|이|그|해당|대한)\s+/g, "")
    .replace(/[,:;.\])}]+$/g, "")
    .trim();
}

function isUsefulLawName(value: string) {
  if (value.length < 3 || value.length > 80) {
    return false;
  }

  if (/[0-9]|(^|\s)조(\s|$)|제\s*\d+\s*조/.test(value)) {
    return false;
  }

  if (
    /관련|질문|검색|결과|원문|출처|공식|검토|나오면|센터의|법령정보센터|국가법/.test(value) &&
    !KNOWN_ARCHITECTURE_LAWS.includes(value)
  ) {
    return false;
  }

  return !["법규", "법령", "관련 법", "법", "시행령", "시행규칙", "조례", "규칙", "고시"].includes(
    normalizeWhitespace(value),
  );
}

function normalizeLawName(value: string) {
  return normalizeWhitespace(value).replace(/[「」\s]/g, "");
}

function normalizeText(value: string) {
  return normalizeWhitespace(value).replace(/\s/g, "-").replace(/[^가-힣a-zA-Z0-9-]/g, "");
}

function normalizeWhitespace(value: string) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function sanitizeApiSourceUrl(value?: string) {
  if (!value) {
    return OFFICIAL_LAW_API_DOCS_URL;
  }

  try {
    const url = new URL(value);
    url.searchParams.delete("OC");
    return url.toString();
  } catch {
    return OFFICIAL_LAW_API_DOCS_URL;
  }
}

function formatDateToken(value: string) {
  return /^\d{8}$/.test(value) ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` : value;
}

function trimText(value: string, maxLength: number) {
  const text = normalizeWhitespace(value);
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
