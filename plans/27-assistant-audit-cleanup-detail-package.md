# 27. Assistant Audit Cleanup Detail Package PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup detail drill-down and evidence package export.
Worklog: [../docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md](../docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md)

## Problem Statement

Cleanup history lists run-level counts and ids, but admins need a per-cleanup drill-down that preserves the raw cleanup audit event and exports a durable evidence package. This must work even after the source action/governance audit events have been deleted.

## Solution

Add cleanup detail and package export:

1. Add an admin-only cleanup detail API for one cleanup audit id.
2. Return the normalized cleanup history item, raw audit event metadata, retention context, deleted ids, skipped ids, and counts.
3. Add a Markdown package export for one cleanup run.
4. Surface `Review cleanup` and `Export package` actions in `/admin/assistant` cleanup history cards.
5. Keep the detail read-only and independent of deleted source event availability.

## Acceptance Criteria

1. Admin users can open one cleanup run and inspect its raw audit event, retention context, deleted/skipped ids, and counts.
2. Admin users can export a read-only Markdown evidence package for one cleanup run.
3. The drill-down does not depend on deleted source action/governance events still existing.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 27 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md) | PRD and roadmap updated |
| Cleanup detail API | implemented | architect-saas `f2ed4e4` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md) | API returned cleanup id, token, retention context, and counts |
| Cleanup package export | implemented | architect-saas `f2ed4e4` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md) | Markdown export returned title, retention context, and raw metadata |
| Admin UI cleanup detail | implemented | architect-saas `f2ed4e4` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1146-assistant-audit-cleanup-detail-package.md) | Browser verified review/export actions and detail panel |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup detail drill-down and evidence package export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/audit-cleanups/a9c28b2b-81f0-4879-9952-f6b8f1be18f5?month=2026-05` returned cleanup token `b0ad7bf1bf61cf86308c2afe`, 0 deleted, 0 skipped, and retention context. |
| 2026-05-12 | Package verification | `GET /api/admin/assistant/audit-cleanups/a9c28b2b-81f0-4879-9952-f6b8f1be18f5/package?month=2026-05` returned `200`, Markdown attachment, evidence package title, archive preview token, and raw cleanup metadata. |
| 2026-05-12 | Browser verification | `agent-browser` verified cleanup history `Review cleanup`, `Export package`, read-only cleanup detail, raw metadata, desktop screenshot, and 390px mobile screenshot. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Restoring deleted events.
- Editing cleanup audit metadata.
- Re-running cleanup from detail view.
- Fetching deleted source events.

## Next Slice Candidate

Add assistant audit cleanup review notes so admins can append post-cleanup governance notes to a cleanup run.
