# 460. Regulation Knowledge Foundation

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `03-file-and-image-analysis.md`, `456-approved-wiki-retrieval.md`, `458-project-document-retrieval-ranking.md`
현재 상태: `implemented_verified`

## Goal

법규 DB 전체를 완성하지 않고, 공식 출처 기반 법규 문서를 seed/import/search/evaluation 관점에서 검증 가능한 첫 foundation으로 실체화한다.

## 선택한 안전 Slice

이번 slice는 `local regulation seed package + dry-run validation + assistant retrieval 연결 + 고정 평가 질문`이다.

이 slice가 다음으로 안전한 이유:

1. 기존 `central_knowledge`, `project_document` retrieval 축은 이미 구현되어 있고, `regulation`만 항상 unavailable에 남는 큰 구멍이다.
2. DB migration, 외부 크롤링, 정기 업데이트, 유료 OCR/provider, 대규모 vector index 없이 로컬 seed와 fixture만으로 검증할 수 있다.
3. 공식 출처 URL과 조문 locator를 먼저 구조화하되, 실제 법률 전문/시행일 확정은 관리자 검토 전제의 import contract로 제한한다.
4. 검색 품질 평가는 5~10개 고정 질문으로 시작해 후속 hybrid search slice의 baseline으로 재사용할 수 있다.

## 구현 전 상태표

| 축 | 상태 | 근거 | 이번 slice 결정 |
| --- | --- | --- | --- |
| 상위 PLAN 검색 우선순위 | 완료 | 중앙 지식, 법규 DB, 프로젝트 문서 순서를 요구 | `PLAN.md`는 변경하지 않음 |
| approved WIKI retrieval | 완료 | 456에서 `central_knowledge` evidence 연결 | 유지 |
| project document retrieval ranking | 완료 | 458에서 project-wide `project_document` evidence 연결 | 유지 |
| regulation evidence kind | 부분완료 | 타입과 policy에는 있으나 retrieval에서 unavailable 고정 | 로컬 seed 검색 결과가 있을 때 unavailable에서 제거 |
| 공식 출처 seed 구조 | 미완료 | 초기 법규 문서 seed 없음 | JSON seed package와 Markdown body contract 추가 |
| import dry-run/validation | 미완료 | 관리자 import 전 검증 스크립트 없음 | `npm run regulation:seed:validate` 추가 |
| 검색 품질 평가 fixture | 미완료 | 고정 평가 질문 없음 | 6개 질문과 expected evidence kind/doc ids 추가 |
| external crawling/update | 미완료 | MVP 범위 밖 | 제외 |
| production vector/hybrid index | 미완료 | 대량 검색용 인덱스 없음 | 후속 slice로 분리 |

## Product Gap

전체 기획서는 법규 DB와 공식 출처를 중앙 지식 다음 검색 우선순위로 둔다. 하지만 현재 retrieval은 `regulation` evidence를 항상 unavailable로 표시한다. 따라서 파일 자동 추출과 approved WIKI 검색이 있어도, 법규 확인 질문에서는 제품 핵심 가치가 아직 foundation 수준으로도 닫히지 않는다.

## Scope

1. 공식 출처/법규 문서 seed를 표현하는 최소 JSON 계약을 만든다.
2. 각 문서는 공식 출처 URL, source kind, 조문/별표 locator, 버전/시행일/수집일 필드, tags, aliases, Markdown body를 가진다.
3. 관리자 import 전 dry-run validation script를 만든다.
4. `/api/assistant/retrieve` 경로에서 질문어와 local seed가 match되면 `regulation` evidence를 반환한다.
5. 6개 고정 평가 질문과 expected `regulation` evidence/doc id fixture를 만든다.
6. 모든 seed evidence는 "관리자 검토 전 foundation seed"라는 한계를 excerpt에 포함한다.

## Out Of Scope

- 외부 법규 사이트 자동 호출, 크롤링, 정기 업데이트
- 법규 전문 자동 OCR/import
- cloud DB table migration 또는 production import 실행
- Postgres FTS/vector/hybrid index
- 법적 적합/부적합 자동 판정
- 유료 OCR/provider 또는 live web search

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| 460 slice 문서와 안전 범위 정의 | 구현 완료 | `architect-browser-assistant` | 문서 검토 |
| regulation seed package contract | 구현 완료 | `architect-saas` | `npm run regulation:seed:validate` 통과 |
| official source seed JSON + Markdown body | 구현 완료 | `architect-saas` | validator 통과 |
| evaluation fixture 6문항 | 구현 완료 | `architect-saas` | validator가 expected doc top result 확인 |
| assistant retrieval `regulation` evidence 연결 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| SaaS deterministic mock answer regulation mention | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| external crawling/provider/index | 제외 | - | 이번 slice 범위 밖 |

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | regulation seed dry-run/evaluation | `npm run regulation:seed:validate` 통과 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | 461 hybrid retrieval baseline 재사용 | `npm run retrieval:hybrid:validate` 통과. regulation 6/6, projectDocuments 6/6 |

## Route / Service / Repository 확인

- Route: `architect-saas/src/app/api/assistant/retrieve/route.ts`는 기존대로 `retrieveAssistantEvidence()`를 호출한다.
- Service: `retrieveAssistantEvidence()`가 local regulation seed search를 실행하고 `buildEvidence()`에 regulation results를 넘긴다.
- Repository: 이번 slice는 DB 저장소를 만들지 않고 seed import contract foundation만 둔다. 기존 task/file/assistant repositories는 변경하지 않으며, 후속 production import slice에서 dedicated repository/table 또는 searchable chunk store를 결정한다.

## 제품 완성도 재평가

전체 기획서 기준 제품 완성도는 이전 `70% 내외`에서 `74% 내외`로 상승했다.

상승 근거:

- 검색 우선순위의 큰 빈칸이던 `regulation` evidence가 더 이상 구조 없이 unavailable만 반환하지 않는다.
- 법규 문서 seed/import/evaluation의 형식이 생겨 후속 대량 import와 hybrid search의 기준점이 생겼다.
- 아직 공식 법규 DB 완성이 아니라, 관리자 검토 전 local foundation이므로 상승폭은 제한적이다.

남은 큰 미완성축:

- OCR/selected-region image analysis: 도면/이미지 근거 자동화가 아직 미완성이다.
- Hybrid search/index: 461에서 Postgres FTS + lexical rerank 첫 구현은 완료됐지만, vector/chunk table은 남아 있다.
- Production signing/package governance: Chrome/native-host signing과 운영 배포 통제가 남아 있다.
- Production legal source import: 공식 법규 전문, 시행일, superseded chain, 관리자 승인 workflow는 후속이다.

## Residual Risks

- seed 내용은 공식 출처 locator와 retrieval contract 검증용이다. 법규 전문과 최신성은 관리자 import/검토 전에는 확정 근거로 취급하면 안 된다.
- 461의 text-hybrid 구현 이후에도 동의어/조문 번호/별표 질의에는 vector/chunk table 또는 synonym policy가 필요하다.
- local seed는 cloud DB audit/history와 분리되어 있으므로 production 운영에는 import repository와 승인 이력이 필요하다.
- 법규 문서가 늘어나면 chunking, FTS/vector/hybrid ranking, freshness policy가 필요하다.

## 다음 후보 Slice

1. `OCR`: 도면/이미지/스캔 PDF에서 법규 검토 단서를 추출하고 사용자 확인 상태를 연결한다.
2. `vector/chunk table`: 461 text-hybrid 위에 dedicated chunk table과 pgvector rerank를 추가한다.
3. `production signing`: Browser Assistant extension/native-host release signing과 production governance를 닫는다.

추천 순서는 `OCR`다. 461에서 text-hybrid 검색의 첫 구현이 닫혔으므로, 검색 corpus 자체를 넓히는 이미지/스캔 PDF 축이 다음 제품 완성도 병목이다.

## 2026-05-14 Follow-up Status

- Slice 467 added an offline legal-source governance manifest for the foundation seed package.
- `npm run regulation:governance:validate` checks official URL coverage, Knowledge admin promotion blocking, verification checklist coverage, and refresh due dates.
- External crawling and production legal approval remain explicit admin/operations steps.
