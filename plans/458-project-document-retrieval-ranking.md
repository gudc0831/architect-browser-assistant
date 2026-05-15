# 458. Project Document Retrieval Ranking

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `03-file-and-image-analysis.md`, `456-approved-wiki-retrieval.md`
현재 상태: `implemented_verified`

## Goal

현재 task 첨부 파일만 보던 assistant retrieval을 프로젝트 전체의 분석 완료 파일 근거까지 확장한다. 법규/기준 문서나 공통 회의록이 다른 task에 첨부되어 있어도 질문과 lexical match가 있으면 `project_document` evidence로 반환한다.

## Product Gap

PLAN.md의 검색 우선순위는 중앙 지식, 법규 DB, 프로젝트 기준 문서를 함께 요구한다. Slice 454가 파일 텍스트 자동 추출을 닫았더라도 retrieval이 현재 task 첨부 파일만 보면 업로드된 기준 문서의 실제 검색 품질은 낮다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| `listFilesByProject(projectId)` repository contract | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| local/firestore/postgres file repository 구현 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| project-wide file analysis lexical ranking | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| current task file evidence와 project document evidence dedupe | 구현 완료 | `architect-saas` | 코드 검토 |
| Postgres text-hybrid file analysis search | 구현 완료 | `architect-saas` / 461 | `npm run retrieval:hybrid:validate`, `npm run typecheck` 통과 |

## Scope

1. 선택된 프로젝트의 active latest file versions를 가져온다.
2. 현재 task에 직접 첨부된 파일은 기존 경로로 우선 유지한다.
3. 프로젝트 전체 파일 중 `analysis` metadata가 있고 질문어와 match되는 항목을 `project_document` evidence로 추가한다.
4. `user_confirmed` 분석은 ranking에 소폭 가산한다.
5. Postgres FTS/vector index는 후속으로 남기되, API와 service 경계는 project-wide retrieval에 맞춰 확장한다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | 461 hybrid retrieval 후속 검증 | `npm run retrieval:hybrid:validate` 통과. regulation 6/6, projectDocuments 6/6. `npm run typecheck` 통과 |

## Residual Risks

- 461에서 Postgres FTS + lexical rerank 첫 구현은 완료됐지만, 한국어 형태소 품질과 대량 corpus 성능은 실제 cloud DB explain/analyze로 더 검증해야 한다.
- 파일 분석 본문은 metadata JSON에 저장된다. 장기적으로는 전용 searchable document chunk table과 index가 필요하다.
- vector rerank, OCR corpus 생성, production legal-source import는 아직 후속이다.

## 2026-05-14 Follow-up Status

- Slice 466 added `file_analysis_chunks` with FTS and pgvector-ready `embedding vector(1536)`.
- Postgres `searchFileAnalyses()` now prefers chunk search when the table exists and falls back to metadata JSON hybrid search otherwise.
- Embedding provider/backfill remains a follow-up slice; the vector column is ready but not populated automatically.
