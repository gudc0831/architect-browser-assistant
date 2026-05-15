# 457. Knowledge Admin RBAC Guard

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `02-knowledge-admin-wiki.md`
현재 상태: `implemented_verified`

## Goal

Knowledge admin 권한을 existing SaaS RBAC에 명시적으로 매핑하고, `/admin/knowledge`와 관련 API가 전용 guard를 통해 접근 제어되도록 한다.

## Product Gap

PLAN.md는 Project manager, Knowledge admin, System admin을 분리한다. 기존 구현은 모든 Knowledge Admin route가 raw `requireRole("admin")`를 직접 호출해, 권한 경계가 제품 설계로 드러나지 않았다.

## MVP Mapping

- Global `admin`: System admin + Knowledge admin.
- Project `manager`: project-scoped 관리자이며 중앙 Knowledge admin 권한은 없다.
- `member`, `editor`, `viewer`, pending/disabled profile: Knowledge admin 권한 없음.

이 매핑은 schema migration 없이 현재 동작을 보존하면서, 후속 `knowledge_admin` role/capability migration을 위한 코드 경계를 만든다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| `canManageKnowledge` helper | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| `requireKnowledgeAdmin` route guard | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| `/admin/knowledge` page guard 전환 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| `/api/admin/knowledge/**` guard 전환 | 구현 완료 | `architect-saas` | raw `requireRole` 제거 확인 |

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | 구현 | 완료 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | Knowledge API guard sweep | `/api/admin/knowledge/**`에서 raw `requireRole` 직접 사용 없음 |

## Residual Risks

- non-system Knowledge admin은 아직 없다. 별도 profile capability나 role enum 추가는 후속 schema migration이 필요하다.
- sidebar/admin navigation은 global admin 표시 정책을 유지한다.
