# 456. Approved WIKI Retrieval

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `02-knowledge-admin-wiki.md`
현재 상태: `implemented_verified`

## Goal

승인된 Knowledge WIKI 항목을 assistant retrieval의 `central_knowledge` evidence로 실제 반환한다.

## Product Gap

PLAN.md 검색 우선순위는 중앙 공식 지식 DB를 1순위로 둔다. 기존 구현은 승인 WIKI readback/export UI는 갖췄지만 `/api/assistant/retrieve`에서 `central_knowledge`를 항상 unavailable로 표시했다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| approvedKnowledgeItem metadata 검색 repository method | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| assistant retrieval `central_knowledge` evidence 연결 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| regulation unavailable 유지 | 구현 완료 | `architect-saas` | 코드 검토, `npm run typecheck` 통과 |
| worklog 기록 | 구현 완료 | `architect-saas` | 문서 갱신 |

## Scope

- 현재 foundation 저장 구조인 `assistantTaskRecord.metadata.approvedKnowledgeItem`을 검색한다.
- query term 기반 lexical match를 적용한다.
- matched WIKI는 `priority: 1`, `kind: central_knowledge`로 반환한다.
- 전용 knowledge table, Postgres FTS, vector index는 후속 slice로 남긴다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | 구현 | 완료 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |

## Residual Risks

- metadata JSON 검색은 소규모 MVP foundation이다. 대량 문서/법규 검색에는 Postgres text/vector/hybrid index가 필요하다.
- organization/project scope 필터는 foundation 수준이며 별도 publication scope enforcement slice가 필요하다.
