# 19. Assistant Audit Governance Drill-Down PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 19 assistant audit governance drill-down for operational review.
Worklog: [../docs/worklogs/2026-05-12-0946-assistant-audit-governance-drill-down.md](../docs/worklogs/2026-05-12-0946-assistant-audit-governance-drill-down.md)

## Problem Statement

Slices 17 and 18 let admins list, filter, link, and export structured assistant action audit records. Governance review still requires jumping between the audit list, `/daily`, assistant records, closure fields, and task history. Admins need a read-only per-record drill-down that keeps those references together.

## Solution

Add a read-only governance drill-down for each assistant action audit record:

1. Add an admin-only detail API for one assistant action audit record.
2. Return the normalized audit record, raw audit event metadata, linked assistant record, approved/deferred summary draft, source/target/created task snapshots, task history text, decision/provenance marker, and `/daily` task link.
3. Add a `Review details` control to each `/admin/assistant` action audit card.
4. Render an inline governance panel without mutating audit, assistant, or task records.

## Acceptance Criteria

1. Admin users can open a richer per-record review view from an assistant action audit.
2. The view links the audit event, assistant record, closure gate fields, task history/provenance, and `/daily` task detail.
3. The view is read-only and does not expose mutation controls.
4. The API applies the same admin/project boundary as the action audit list.
5. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 19 PRD and roadmap entry | done | browser this commit | browser worklog | Document created and roadmap updated |
| Admin action-audit detail API | done | SaaS `c274810` | SaaS worklog | Detail API smoke check passed |
| Admin governance drill-down UI | done | SaaS `c274810` | SaaS worklog | Browser `/admin/assistant` Review details panel verified |
| User guide and worklogs | done | SaaS `c274810`; browser this commit | SaaS/browser worklogs | User guide and worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit governance drill-down |
| 2026-05-12 | Static checks | SaaS `npm run typecheck` passed; SaaS `npm run lint` passed with 7 pre-existing hook dependency warnings; browser-assistant `npm run typecheck` and `npm run lint` passed |
| 2026-05-12 | API proof | `GET /api/admin/assistant/action-audits/{auditId}?month=2026-05` returned raw audit event, assistant record, closure state, `/daily` link, task snapshots, task history, and provenance |
| 2026-05-12 | Browser proof | `/admin/assistant` showed `Review details`; opening a record rendered `Governance detail`, assistant record metadata, closure fields, task snapshots, task history/provenance, and `Open daily detail` |
| 2026-05-12 | Residual environment note | Browser console still showed pre-existing `/api/project/changes` 500 polling errors unrelated to the assistant audit detail flow |

## Out of Scope

- Editing, deleting, redacting, or annotating audit records.
- Backfilling text-marker-only provenance into structured records.
- Creating a separate full-page audit workspace.
- Automated governance scoring.

## Next Slice Candidate

Add governance note capture for assistant audit reviews, keeping notes append-only and separated from immutable audit records.
