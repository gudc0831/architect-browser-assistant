# 17. Admin Assistant Action Audit Review PRD

Created: 2026-05-11
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 17 admin-facing assistant action audit review surface with filters and task links.
Worklog: [../docs/worklogs/2026-05-11-1638-admin-action-audit-review.md](../docs/worklogs/2026-05-11-1638-admin-action-audit-review.md)

## Problem Statement

Slices 15 and 16 made assistant-origin task changes visible in task detail and persisted them as structured audit records. Admin review still depends on the raw audit timeline, which is hard to filter by task, action, assistant record, or actor.

## Solution

Add an admin-facing review surface for assistant task action audits:

1. Reuse the structured action-audit event metadata from Slice 16.
2. Add an admin API that lists action audit records for the current project and month.
3. Enrich each record with readable source, target, and created-task labels.
4. Add filters for action type, task id/display id/title, assistant record id, and actor id.
5. Link each audit record back to the most relevant `/daily` task detail.

## Acceptance Criteria

1. Admin users can list assistant task action audit records by project/month.
2. Filters cover action type, task id/display id/title, assistant record id, and actor id.
3. Each listed audit record shows action, actor, timestamp, source task, target task, created task where applicable, and assistant record id.
4. Each listed audit record links back to `/daily` task detail where possible.
5. Static checks, API verification, and browser verification are recorded.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 17 PRD and roadmap entry | done | pending commit | this worklog | Document created and updated |
| Shared action-audit parser | done | pending SaaS commit | SaaS worklog | `npm run typecheck` passed |
| Admin action-audit API | done | pending SaaS commit | SaaS worklog | filtered API checks passed |
| Admin review UI and filters | done | pending SaaS commit | SaaS worklog | Browser verified list, filters, href, and `/daily?taskId` detail focus |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-11 | Static checks | `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing hook dependency warnings; `npm run worklog:check` passed |
| 2026-05-11 | API proof | `GET /api/admin/assistant/action-audits?month=2026-05&limit=10` returned task update and follow-up action records; action+task and assistantRecordId+actor filters returned expected records |
| 2026-05-11 | Browser proof | `/admin/assistant` showed `Assistant action audits`, filters, two records, task update/follow-up records, `/daily?taskId=...` hrefs; `/daily?taskId=arch-task-001` opened task detail for task `001` |

## Out of Scope

- Exporting audit records to files.
- Backfilling historical text-marker-only provenance into structured records.
- Editing or deleting audit records from the admin review surface.
- Mobile-specific admin audit review UX.

## Next Slice Candidate

Add admin export or deeper drill-down for assistant governance records if operational review needs downloadable evidence packages.
