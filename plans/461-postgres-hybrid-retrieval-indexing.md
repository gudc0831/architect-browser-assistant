# 461. Postgres Hybrid Retrieval Indexing

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `03-file-and-image-analysis.md`, `456-approved-wiki-retrieval.md`, `458-project-document-retrieval-ranking.md`, `460-regulation-knowledge-foundation.md`
현재 상태: `implemented_verified`

## Goal

460번 법규 평가 fixture를 검색 품질 baseline으로 삼아, assistant retrieval의 `central_knowledge`와 `project_document` 경로에 Postgres FTS + deterministic lexical rerank 기반의 첫 text-hybrid 구현을 연결한다.

## 선택한 Slice와 이유

이번 slice는 `Postgres text-hybrid retrieval first implementation`이다.

선택 이유:

1. 460번에서 법규 seed와 6개 고정 평가 질문이 생겨 검색 품질 회귀 기준을 바로 재사용할 수 있다.
2. OCR provider나 Chrome signing보다 먼저 retrieval ranking을 고도화하면 법규/기준 문서 seed, approved WIKI, project document가 같은 근거 품질 축으로 연결된다.
3. 아직 dedicated chunk table, pgvector, embedding provider가 없으므로 vector는 운영 결정 전까지 제외하고, Postgres FTS와 field-weighted lexical rerank를 먼저 닫는 것이 안전하다.
4. extension/local runtime은 DB 내부에 의존하지 않고 기존 SaaS API/repository contract만 호출한다.

## Product Gap Reassessment

| PLAN.md 기준 축 | 이전 상태 | 이번 slice 후 판단 |
| --- | --- | --- |
| 법규 DB/공식 출처 실체화 | foundation 완료 | 460 seed/eval을 검색 품질 baseline으로 재사용 |
| OCR/이미지 분석 | 미완료 | 이번 slice 범위 밖, 다음 큰 축 |
| Postgres text/vector/hybrid 검색 | 미완료 | Postgres FTS + lexical rerank 첫 구현 완료, vector는 deferred |
| Knowledge admin 권한 모델 | 부분완료 | 457 guard 유지, 이번 slice와 무관 |
| 공개 배포 readiness | 부분완료 | 455/459 유지, signing은 후속 |

전체 기획서 기준 제품 완성도는 460 완료 기준 약 74%에서 약 82%로 재평가한다. 검색 품질 축의 첫 Postgres 구현은 닫혔지만, OCR provider, production legal-source import governance, vector/chunk table, Chrome/native-host signing이 남아 있어 90% 이상으로 보기는 아직 이르다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| file analysis ranking shared domain | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run retrieval:hybrid:validate` 통과 |
| `FileRepository.searchFileAnalyses()` contract | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| local/firestore/memory lexical fallback | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| Postgres project-document FTS + lexical rerank | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| Postgres approved WIKI FTS + lexical rerank | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| assistant retrieval service 연결 | 구현 완료 | `architect-saas` | 코드 경로 확인 |
| regulation fixture 기반 hybrid validation | 구현 완료 | `architect-saas` | `npm run retrieval:hybrid:validate` 6/6 통과 |
| slice 문서와 cross-repo worklog | 구현 완료 | 양 repo | 문서 갱신 |

## Implementation Decision

이번 구현의 검색 방향은 `text-hybrid first, vector deferred`다.

- Postgres cloud mode는 JSON metadata 안의 approved WIKI와 file analysis 본문을 `to_tsvector('simple', ...)` / `plainto_tsquery('simple', ...)`로 FTS rank를 계산한다.
- 최종 순위는 FTS rank만 믿지 않고 파일명, title, summary, tags, extracted text, verification state를 deterministic lexical score로 rerank한다.
- local/firestore/memory는 Postgres FTS를 사용할 수 없으므로 같은 lexical domain ranking을 사용한다.
- vector search는 dedicated chunk table, embedding lifecycle, pgvector migration, provider 비용/보안 정책이 정해진 뒤 별도 slice로 진행한다.

## Route / Service / Repository 확인

- Route: `architect-saas/src/app/api/assistant/retrieve/route.ts`는 기존대로 `retrieveAssistantEvidence()`를 호출한다.
- Service: `architect-saas/src/use-cases/assistant-service.ts`는 `fileRepository.searchFileAnalyses()`를 호출하고 결과를 `project_document` evidence로 변환한다.
- Repository contract: `architect-saas/src/repositories/contracts.ts`에 `SearchFileAnalysesInput`과 `FileRepository.searchFileAnalyses()`가 추가됐다.
- Postgres file repository: `architect-saas/src/repositories/postgres/store.ts`가 latest active file version의 `metadata.analysis` JSON을 FTS + lexical rerank로 검색한다.
- Postgres assistant repository: `architect-saas/src/repositories/assistant/postgres-store.ts`가 `metadata.approvedKnowledgeItem` JSON을 FTS + lexical rerank로 검색한다.
- Fallback repositories: `memory`와 `firestore`는 `rankFileAnalyses()` lexical fallback을 사용한다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | hybrid retrieval fixture | `npm run retrieval:hybrid:validate` 통과. regulation 6/6, projectDocuments 6/6 |
| 2026-05-14 | regulation seed baseline | `npm run regulation:seed:validate` 통과 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` 통과. 6 test files / 14 tests 통과, native-host self-test ok |

## Residual Risks

- Postgres FTS는 `simple` dictionary 기반이라 한국어/CJK 형태소 품질은 제한적이다.
- approved WIKI와 file analysis 본문은 아직 JSON metadata에 저장된다. 대량 문서 운영에는 dedicated searchable chunk table과 expression index가 필요하다.
- vector retrieval은 아직 구현하지 않았다. embedding provider, pgvector migration, chunk refresh 정책을 먼저 결정해야 한다.
- raw SQL 경로는 실패 시 lexical fallback으로 동작하지만, 실제 cloud DB에서 explain/analyze 기반 성능 검증은 아직 필요하다.
- OCR provider가 없어 스캔 PDF/이미지 문서는 검색 corpus로 들어오지 못한다.

## 다음 후보 Slice

1. OCR provider + PNG/JPG/스캔 PDF/선택 영역 이미지 분석
2. Dedicated searchable chunk table + pgvector/vector rerank
3. Chrome Web Store/native-host signing readiness gate
4. Production legal-source import governance and admin approval history
