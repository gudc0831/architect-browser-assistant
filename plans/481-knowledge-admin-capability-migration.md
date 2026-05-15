# 481 Knowledge Admin Capability Migration

Status: `implemented`

## Scope

Replace the implicit global-admin-only knowledge guard with an explicit capability schema/API while preserving existing admin access.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Capability schema | implemented | `architect-saas` | `KnowledgeAdminCapability` enumerates review/export/legal-source/sync/debug capabilities. |
| Backfill mapping | implemented | `architect-saas` | Active global admin maps to `global_admin_backfill`; project managers remain excluded. |
| Capability API | implemented | `architect-saas` | `GET /api/admin/knowledge/capabilities`. |
| Admin UI visibility | implemented | `architect-saas` | `/admin/knowledge` shows mapping and migration readiness. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` in `architect-saas` | passed |

## Blocked Operations

Persistent per-profile capability storage remains blocked until a DB migration/backfill is approved. Existing global admin access is intentionally preserved.

