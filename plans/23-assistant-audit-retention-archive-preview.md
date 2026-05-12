# 23. Assistant Audit Retention Archive Preview PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 23 assistant audit retention and archival preview controls.
Worklog: [../docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md](../docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md)

## Problem Statement

Assistant action audits and governance notes are now operational records with per-record packages and cross-audit note reports. Admins need to understand retention policy impact before any cleanup exists: which audit events would be considered old, how many are protected, and whether an archive export preserves source audit ids, assistant record ids, note metadata, and task labels before deletion is allowed.

## Solution

Add a read-only assistant audit retention preview:

1. Reuse the project assistant retention policy as the default retention window.
2. Provide an admin-only preview API that groups assistant action audit and governance note events by month and marks events older than the cutoff.
3. Provide an archive preview export that contains eligible records with raw metadata plus normalized action audit/governance note context.
4. Surface the preview in `/admin/assistant` with policy status, preview retention days, cutoff, monthly counts, and export link.
5. Keep destructive cleanup out of scope for this slice.

## Acceptance Criteria

1. Admin users can see audit retention policy status and old assistant audit/governance-note counts by month.
2. Admin users can run a read-only archival preview before any destructive cleanup.
3. The archive/export path preserves source audit ids, assistant record ids, note metadata, raw metadata, and task labels before deletion is allowed.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 23 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md) | PRD and roadmap updated |
| Retention preview API | implemented | `architect-saas` `9ccf46b` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md) | API preview returned monthly eligible/protected counts |
| Archive preview export API | implemented | `architect-saas` `9ccf46b` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md) | JSON export preserved raw metadata, source audit ids, assistant record ids, and note context |
| Admin UI retention preview | implemented | `architect-saas` `9ccf46b` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1050-assistant-audit-retention-preview.md) | Browser verified desktop and mobile `/admin/assistant` retention preview |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit retention and archival controls |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/audit-retention?retentionDays=0&limit=500` returned policy retention 365 days, preview retention 0 days, 6 relevant events, 6 eligible, 0 protected, and 2026-05 counts of 3 action audits and 3 governance notes. |
| 2026-05-12 | Export verification | `GET /api/admin/assistant/audit-retention/export?retentionDays=0&limit=500` returned `200`, JSON attachment headers, read-only warning, `archiveItems`, `rawMetadata`, `assistantRecordId`, and `sourceAssistantRecordId`. |
| 2026-05-12 | Browser verification | Playwright verified `/admin/assistant` default 365-day protected view, 0-day eligible preview, export URL update, and 390px mobile layout. Existing `/api/project/changes` 500 polling errors remained unrelated to this slice. |

## Out of Scope

- Deleting audit events.
- Background archival jobs.
- Changing persistence retention behavior.
- Retention controls for non-assistant audit domains.

## Next Slice Candidate

Add guarded assistant audit cleanup execution that requires an archive preview/export token before deletion.
