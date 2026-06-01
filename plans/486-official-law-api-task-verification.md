# 486 Official Law API Task Verification

Status: `implemented`

## Scope

Close the browser-side gap between retrieved `regulation` evidence and actual official legal source verification.

The browser assistant now re-checks regulation evidence against the official National Law Information Center Open API before generating and saving a legal review answer. This keeps the existing architecture boundary intact:

- SaaS still owns task retrieval, DB access, assistant record persistence, RBAC, and audit policy.
- Browser Assistant calls the official API only to verify already-retrieved regulation evidence and to record deterministic source metadata in the answer.
- The extension does not crawl law sites, bulk import documents, or promote external sources to central knowledge.

## Official Data Source

Primary source: `국가법령정보센터 / 국가법령정보 공동활용 LAW OPEN DATA`.

Used endpoints:

- `GET https://www.law.go.kr/DRF/lawSearch.do?target=eflaw&type=JSON`
  - Finds current law records by law name.
- `GET https://www.law.go.kr/DRF/lawService.do?target=eflaw&type=JSON`
  - Reads current law body/article text by law ID or law sequence.

API guide:

- `https://open.law.go.kr/LSO/openApi/guideList.do`
- `https://open.law.go.kr/LSO/openApi/guideResult.do?htmlName=lsEfYdListGuide`
- `https://open.law.go.kr/LSO/openApi/guideResult.do?htmlName=lsEfYdInfoGuide`

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Official law API client | implemented | `architect-browser-assistant` | Searches `eflaw`, fetches article body, handles timeout, HTTP, JSON, missing result, and API error paths. |
| Law/article locator extraction | implemented | `architect-browser-assistant` | Extracts law names and `제N조` locators from `regulation` evidence, question text, and law.go.kr URLs. |
| Source evidence conversion | implemented | `architect-browser-assistant` | Converts verified API responses into high-priority `regulation` evidence with law name, article, effective date, API URL, checkedAt, and source metadata. |
| Task result verification | implemented | `architect-browser-assistant` | Checks generated answers against verified law sources and appends a deterministic verification record to the saved answer. |
| Failure/retry reporting | implemented | `architect-browser-assistant` | Shows missing locator, not found, API error, timeout, and retry guidance in the side panel. |
| `/daily` bridge preflight | implemented | `architect-browser-assistant` | Page `generate` requests run official law verification in the background service worker before reaching the native runtime. |
| Runtime grounding prompt | implemented | `architect-browser-assistant` | Local Codex prompt now requires official source/API/checkedAt metadata for legal/regulation answers. |
| Manifest permission | implemented | `architect-browser-assistant` | Adds exact `https://www.law.go.kr/*` host permission without adding content-script access to the law site. |

## Verification Record Fields

Saved legal review answers now include a deterministic `출처 검증 기록` section when law verification is required:

- 검증 상태
- 검증 시점
- 법규명
- 조항
- 시행일자 when available
- API 출처
- 조회 시점
- 판단 근거 excerpt
- 검증 제한 and retry path when verification is incomplete

## Boundaries

- No automatic crawling.
- No production legal-source import.
- No DB writes outside the existing assistant record save path.
- No automatic WIKI approval. Verified assistant records become WIKI candidates only; Knowledge admin/user review is required before they become approved WIKI.
- No storage of SaaS, OpenAI, Codex, or DB secrets.
- `lawOpenDataOc` is an optional extension setting for the law.go.kr Open API `OC` value; default development behavior uses the official guide's `test` sample value.

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` | passed |
| `npm run test` | passed, including official law API parsing, task verification, and in-page bridge preflight tests |
| `npm run release:check` | passed on 2026-05-29 with 21 Vitest tests, native/package tests, build, readiness, and native-host self-test; readiness reported 4 warnings and 0 failures |
| `scripts\verify-official-law-task-flow.mjs --task-id task_4zqzmp8c` | blocked before record/WIKI writes because `OC=test` returned National Law Information Center user verification failure; WIKI admin read auth passed separately |
| `scripts\verify-official-law-task-flow.mjs --task-id task_3bogoi8b --question "공동주택 단지내 도로 경사도..."` | selected `주택건설기준 등에 관한 규칙 제6조의2`, then blocked before record/WIKI writes because `OC=test` returned National Law Information Center user verification failure |
| `npm run release:check` | passed on 2026-05-29 after the AS-003 run with 22 Vitest tests, native/package tests, build, readiness, and native-host self-test; readiness reported 4 warnings and 0 failures |
| `scripts\verify-official-law-task-flow.node-test.mjs` | added to prevent the verifier script from calling WIKI approve or summary approval APIs |

## Residual Risks

- The production SaaS `/daily` in-page popup still needs matching UI/API work if it wants the same browser-side verification display outside the diagnostic side panel.
- Production organizations should route official law API credentials through governed SaaS policy if the `OC` value is treated as sensitive.
- Generic legal questions without a returned `regulation` evidence locator are intentionally blocked from legal grounding and must be retried with a specific law/article or a successful SaaS regulation retrieval result.
