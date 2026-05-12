# 22. Filtered Governance Note Export Reporting PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 22 filtered governance note export/reporting across assistant action audits.
Worklog: [../docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md](../docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md)

## Problem Statement

Slice 20 added append-only governance notes to individual assistant action audits, and Slice 21 made each audit portable as a Markdown evidence package. Admin reviewers still need a cross-audit report that finds governance notes by category, reviewer, task, and assistant record, then exports those notes without mutating the source records.

## Solution

Add a read-only governance note report:

1. Reuse `assistant.governance_note.created` audit events as the report source.
2. Resolve each note back to its source assistant action audit and task labels.
3. Add filters for month, category, reviewer, task, and assistant record.
4. Add a read-only CSV export for the filtered report.
5. Surface the report in `/admin/assistant` with links to the source audit drill-down and `/daily` task detail.

## Acceptance Criteria

1. Admin users can filter governance notes across assistant action audits by month, category, reviewer, task, and assistant record.
2. Each report row links back to the source action audit drill-down and `/daily` task detail.
3. CSV export is read-only and includes note category, reviewer, timestamp, source audit id, assistant record id, task labels, and note text.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 22 PRD and roadmap entry | implemented | browser-assistant `0a662c3` | [browser worklog](../docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md) | Document and roadmap updated |
| Governance note report API | implemented | architect-saas `9c710f2` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md) | API proof returned filtered governance note rows |
| Governance note CSV export | implemented | architect-saas `9c710f2` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md) | CSV proof returned attachment with note/audit/task columns |
| Admin UI report and drill-down link | implemented | architect-saas `9c710f2` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1027-governance-note-export-reporting.md) | Browser proof confirmed report filters, export URL, source audit drill-down, and `/daily` link |
| User guide and worklogs | implemented | architect-saas `9c710f2`, browser-assistant `0a662c3` | SaaS and browser worklogs | `사용자 가이드.md`, PRD, roadmap, worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: filtered governance note export/reporting |
| 2026-05-12 | Static checks | `npm run typecheck` and `npm run lint` passed in `architect-saas`; lint only reported 7 pre-existing hook warnings outside changed files. |
| 2026-05-12 | API proof | `GET /api/admin/assistant/governance-notes?month=2026-05&limit=10` returned 3 notes. Filtering by category, reviewer, task, and assistant record returned 1 note. CSV export returned `200`, `text/csv`, attachment filename, and note/source audit/task columns. |
| 2026-05-12 | Browser proof | Playwright opened `http://localhost:3000/admin/assistant`, confirmed `Governance note report`, filtered to 1 note, verified `Export notes CSV` query parameters, opened `Review audit` drill-down, and checked 390px layout. Residual console noise was limited to the pre-existing `/api/project/changes` 500 polling error. |

## Out of Scope

- Editing or deleting governance notes.
- Bulk Markdown/ZIP evidence package generation.
- Cross-project or organization-wide reporting beyond the selected project boundary.
- Changing the per-record governance note append API.

## Next Slice Candidate

Add assistant audit retention and archival controls for old audit and governance-note events.
