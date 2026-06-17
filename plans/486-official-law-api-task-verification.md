# 486 Official Law API Task Verification

Status: `implemented`

## 2026-06-17 Verified Legal Boundary Closeout

This slice is now implemented as a server-owned verified legal boundary, not as a browser-owned `law.go.kr` client.

- [x] Browser Assistant does not request `law.go.kr` host permissions.
- [x] Browser Assistant guarded storage rejects `lawOpenDataOc` and other secret-like keys.
- [x] Browser-side preflight uses SaaS/verified-legal returned `verificationStatus=verified` regulation evidence metadata only.
- [x] Unverified regulation seeds fail closed before Local Codex/native runtime generation.
- [x] Manual task-flow verification calls `/api/assistant/task-review`, not `/api/assistant/retrieve` plus direct official API calls.
- [x] `task-review` preview creates no assistant record or WIKI candidate; generated server records remain `candidateState: "not_candidate"` and WIKI approval stays admin-only.

## 2026-06-10 Centralized Legal Boundary Update

Status remains implemented for the centralized legal boundary, but this plan must no longer be read as requiring the extension to direct-reverify SaaS-supplied `regulation` items.

- [x] Legacy `official-law:` evidence is accepted only when it already carries verified source metadata returned through the SaaS/verified-legal boundary.
- [x] Centralized SaaS evidence whose id starts with `verified-legal-search:` is already supplied by `verified-legal-evidence-api` and must not be re-queried against law.go.kr by the extension before Local Codex generation.
- [x] Foundation `regulation` seeds without centralized verified legal evidence are not treated as extension-direct recheck material during generation.
- [x] 2026-06-10 patch proof: `npm run release:check` passed after content-script tests were added for centralized `verified-legal-search:` evidence and foundation regulation seed behavior.
- [x] 2026-06-10 deployed Preview proof: after rebuilding for `https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app` and reloading extension id `ianebfgjhjklildppcocmbmifedapooj`, canonical `/daily` AI review executed through Local Codex/native bridge and saved a candidate review record.
- [x] 2026-06-10 production readiness proof: with canonical Preview-origin build, observed extension id `ianebfgjhjklildppcocmbmifedapooj`, stable native-host install root, release owner `gudc0831`, Web Store publisher `gudc083111@gmail.com`, and explicit `--allow-unsigned-native-host`, `npm run release:readiness:production` returned `18 pass, 1 warn, 0 fail`.
- [x] 2026-06-10 Local Codex generate fix: installed native-host framed `generate` reproduced `codex_exec_failed`; Browser Assistant now omits the default `gpt-5-codex` model for Local Codex so the CLI uses its account-compatible default, and passes `model_reasoning_effort=medium` without Windows-breaking quotes. The same installed framed `generate` smoke now returns `ok: true`.
- [ ] Signed native-host release still needs a real code-signing subject to replace the unsigned waiver before a signed production release.
- [ ] Chrome extension reload remains a manual operator action because browser automation is not allowed to control `chrome://extensions`; after this rebuilt `dist`, reload the unpacked extension and refresh `/daily` before retesting same-task task `117` Local Codex generation/save proof.

## Scope

Close the Browser Assistant boundary gap between retrieved `regulation` evidence and actual official legal source verification.

The SaaS server and `verified-legal-evidence-api` own the legal verification boundary. The extension consumes the retrieval/task-review snapshot without direct `law.go.kr` re-query. This keeps the current architecture boundary intact:

- SaaS still owns task retrieval, DB access, assistant record persistence, RBAC, and audit policy.
- Browser Assistant never owns `LAW_OPEN_DATA_OC`, verified legal server secrets, R2 credentials, or DB credentials.
- Browser Assistant does not direct-query `law.go.kr`; it relies on SaaS-returned verified legal evidence metadata.
- The extension does not crawl law sites, bulk import documents, or promote external sources to central knowledge.

## Official Data Source

Primary source: `국가법령정보센터 / 국가법령정보 공동활용 LAW OPEN DATA`, accessed only by `verified-legal-evidence-api`.

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
| Official law API client | retired from Browser Assistant | `architect-browser-assistant` | Direct browser-side `law.go.kr` calls are removed from the active boundary. |
| Law/article locator extraction | implemented | `architect-browser-assistant` | Extracts law names and `제N조` locators from `regulation` evidence, question text, and law.go.kr URLs. |
| Source evidence conversion | implemented | `architect-browser-assistant` | Converts SaaS-returned verified source metadata into high-priority `regulation` evidence with law name, article, effective date, checkedAt, and redacted source metadata. |
| Task result verification | implemented | `architect-browser-assistant` | Checks generated answers against SaaS-returned verified law sources and appends a deterministic verification record to the saved answer. |
| Failure/retry reporting | implemented | `architect-browser-assistant` | Shows missing centralized evidence and retry guidance in the side panel/local bridge path. |
| `/daily` bridge preflight | implemented | `architect-browser-assistant` | Page `generate` requests fail closed unless verified legal evidence metadata is already present before reaching the native runtime. |
| Runtime grounding prompt | implemented | `architect-browser-assistant` | Local Codex prompt now requires official source/API/checkedAt metadata for legal/regulation answers. |
| Manifest permission | implemented | `architect-browser-assistant` | Host permissions are limited to the configured SaaS origin. |
| Centralized verified legal boundary | implemented | `architect-browser-assistant` | Local Codex generation accepts verified legal metadata from SaaS/verified-legal and blocks unverified regulation seeds. |

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
- No automatic WIKI approval. `task-review` preview creates no candidate, and generated task-review records remain `not_candidate` until a later explicit Knowledge workflow.
- No storage of SaaS, OpenAI, Codex, or DB secrets.
- No `lawOpenDataOc` extension setting. `LAW_OPEN_DATA_OC` belongs only in `verified-legal-evidence-api`.
- No extension-side direct legal API recheck for evidence already provided by the SaaS verified legal boundary.

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
| `npm run typecheck`, `npm run test`, `npm run build`, `npm run release:readiness -- --strict`, `npm run lint` | passed on 2026-06-17 after verified legal boundary hardening |

## Residual Risks

- Production organizations should route official law API credentials through `verified-legal-evidence-api` policy; the Browser Assistant must not receive them.
- Generic legal questions without a returned `regulation` evidence locator are intentionally blocked from legal grounding and must be retried with a specific law/article or a successful SaaS regulation retrieval result.
