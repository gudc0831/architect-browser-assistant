# 18. Admin Assistant Action Audit Export PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 18 admin assistant action audit CSV export for operational review.
Worklog: [../docs/worklogs/2026-05-12-0905-admin-action-audit-export.md](../docs/worklogs/2026-05-12-0905-admin-action-audit-export.md)

## Problem Statement

Slice 17 gave admins a filtered review surface for structured assistant action audit records. Operational review still needs a portable evidence package that preserves the same filters and identifiers without granting edit capability.

## Solution

Add a read-only CSV export for the existing admin assistant action audit review records:

1. Reuse the Slice 17 action audit filters: month, action, task, assistant record id, and actor id.
2. Add an admin-only export API that returns CSV with task links, assistant record ids, actor ids, summary metadata, status transitions, and source/target/created task references.
3. Add an `Export CSV` control to `/admin/assistant` beside the action audit review list.
4. Keep export behavior read-only and scoped to the current project authorization boundary.

## Acceptance Criteria

1. Admin users can export the currently filtered assistant action audit review records as CSV.
2. The CSV preserves action, created time, actor id, source task, target task, created task, assistant record id, daily task URL, status transition, conclusion, scope, follow-up action, tags, and decision marker.
3. The export endpoint applies the same authorization and filtering rules as the review API.
4. The admin UI exposes export without changing audit records.
5. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 18 PRD and roadmap entry | done | browser this commit | browser worklog | Document created and roadmap updated |
| Admin action-audit CSV export API | done | SaaS `04e04c2` | SaaS worklog | API header/body and filtered row checks passed |
| Admin export UI control | done | SaaS `04e04c2` | SaaS worklog | Browser `/admin/assistant` verified export link and filtered URL |
| User guide and worklogs | done | SaaS `04e04c2`; browser this commit | SaaS/browser worklogs | User guide updated; worklog guard passed in SaaS |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: admin assistant action audit export |
| 2026-05-12 | Static checks | SaaS `npm run typecheck` passed; SaaS `npm run lint` passed with 7 pre-existing hook dependency warnings; browser-assistant `npm run typecheck` and `npm run lint` passed |
| 2026-05-12 | API proof | `GET /api/admin/assistant/action-audits/export?month=2026-05&limit=10` returned `text/csv` and attachment filename; filtered export for `action=task_update_applied&task=001&assistantRecordId=f02ce245&actorId=local-auth-placeholder` returned one matching row |
| 2026-05-12 | Browser proof | `/admin/assistant` rendered `Export CSV`; after action and task filters, the export link URL included `action=task_update_applied&task=001` and the list showed one record |

## Out of Scope

- Editing, deleting, or redacting audit records.
- Bundled evidence packages beyond the filtered CSV.
- Backfilling historical text-marker-only provenance into structured records.
- Scheduled or automated export delivery.

## Next Slice Candidate

Add governance drill-down for individual assistant action audit records, including a richer per-record review view with linked assistant answer, closure gate fields, and task history context.
