# 25. Assistant Audit Cleanup History Reporting PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup history reporting and export.
Worklog: [../docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md](../docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md)

## Problem Statement

Slice 24 introduced guarded assistant audit cleanup execution and writes cleanup runs as append-only audit events. Admins need to review those cleanup runs separately from the live audit timeline and retention preview counts so cleanup accountability remains easy to filter, export, and inspect after eligible action/governance events have been deleted.

## Solution

Add cleanup history reporting:

1. Normalize `assistant.audit_retention_cleanup.executed` audit events into cleanup history records.
2. Provide an admin-only cleanup history API filtered by month, actor id, cutoff, and archive preview token.
3. Provide a CSV export for cleanup history with deleted/skipped ids and count metadata.
4. Surface the report in `/admin/assistant` near the retention preview without adding cleanup events to retention action/governance counts.
5. Link cleanup history rows back to the retention policy context through cutoff, preview retention days, and preview token.

## Acceptance Criteria

1. Admin users can filter cleanup audit events by month, actor, cutoff, and preview token.
2. Admin users can export cleanup history with deleted/skipped ids and count metadata.
3. Cleanup history links back to the retention preview policy context without mixing cleanup events into action-audit retention counts.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 25 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md) | PRD and roadmap updated |
| Cleanup history API | implemented | `architect-saas` `f893dab` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md) | API returned cleanup run and token filter matched 1 row |
| Cleanup history CSV export | implemented | `architect-saas` `f893dab` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md) | CSV export returned headers for cleanup audit id, token, deleted ids, skipped ids |
| Admin UI cleanup history report | implemented | `architect-saas` `f893dab` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1117-assistant-audit-cleanup-history.md) | Browser verified cleanup history section and mobile layout |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit cleanup history reporting and export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/audit-cleanups?month=2026-05&limit=500` returned cleanup audit `a9c28b2b-81f0-4879-9952-f6b8f1be18f5`; token-filtered query returned 1 row; CSV export returned `200` with cleanup/token/deleted/skipped headers. |
| 2026-05-12 | Retention separation | `GET /api/admin/assistant/audit-retention?retentionDays=365&limit=500` still returned 6 relevant action/governance events, 0 eligible, and 6 protected after cleanup audit history existed. |
| 2026-05-12 | Browser verification | `agent-browser` verified `/admin/assistant` cleanup history report, export link, filters, cleanup card text, desktop screenshot, and 390px mobile screenshot. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Restoring deleted audit events.
- Re-running cleanup from a history row.
- Cleanup history for non-assistant audit domains.
- Background cleanup scheduling.

## Next Slice Candidate

Add assistant audit cleanup dry-run comparison that shows what changed between a previous cleanup token and the current retention preview.
