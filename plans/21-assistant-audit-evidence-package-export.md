# 21. Assistant Audit Evidence Package Export PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify 21 assistant audit evidence package export for operational review.
Worklog: [../docs/worklogs/2026-05-12-1015-assistant-audit-evidence-package-export.md](../docs/worklogs/2026-05-12-1015-assistant-audit-evidence-package-export.md)

## Problem Statement

Slices 19 and 20 put governance context and append-only notes in the assistant action audit drill-down. Admins still need a portable per-record evidence package that combines the action audit, assistant record summary, task snapshots, provenance, and governance notes without mutating any records.

## Solution

Add a read-only Markdown package export from the assistant action audit drill-down:

1. Reuse the Slice 19 detail API data model as the package source.
2. Add an admin-only package export API for one action audit record.
3. Include action audit fields, raw event metadata, assistant record summary, closure fields, task snapshots, provenance, and append-only governance notes.
4. Add an `Export package` link in the governance drill-down panel.
5. Keep export read-only and scoped to the same admin/project boundary.

## Acceptance Criteria

1. Admin users can export a per-record evidence package from an assistant action audit drill-down.
2. The package includes action audit fields, assistant record summary, task snapshots, provenance, and append-only governance notes.
3. The package remains read-only and does not mutate audit, task, assistant, or note records.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 21 PRD and roadmap entry | implemented | browser-assistant `64b0537` | [browser worklog](../docs/worklogs/2026-05-12-1015-assistant-audit-evidence-package-export.md) | Document and roadmap updated |
| Evidence package export API | implemented | architect-saas `393c308` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1015-assistant-audit-evidence-package-export.md) | API proof returned Markdown package with attachment header |
| Drill-down export package UI | implemented | architect-saas `393c308` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1015-assistant-audit-evidence-package-export.md) | Browser proof confirmed `Export package` link in detail panel |
| User guide and worklogs | implemented | architect-saas `393c308`, browser-assistant `64b0537` | SaaS and browser worklogs | `사용자 가이드.md`, PRD, roadmap, worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit evidence package export |
| 2026-05-12 | Static checks | `npm run typecheck` and `npm run lint` passed in `architect-saas`; lint only reported 7 pre-existing hook warnings outside changed files. `npm run typecheck` and `npm run lint` passed in `architect-browser-assistant`. |
| 2026-05-12 | API proof | Created local verification assistant record/action audit/governance note through existing APIs, then `GET /api/admin/assistant/action-audits/50a0d416-ede5-41e4-a5da-fc4c084926b7/package?month=2026-05` returned `200`, `text/markdown`, an attachment filename, and package sections for provenance, governance notes, and raw metadata. |
| 2026-05-12 | Browser proof | Playwright opened `http://localhost:3000/admin/assistant`, clicked `Review details`, and confirmed the `Export package` link beside `Open daily detail` on desktop and 390px width. Residual console noise was limited to the pre-existing `/api/project/changes` 500 polling error. |

## Out of Scope

- ZIP/PDF generation.
- Including binary file attachments.
- Exporting filtered bulk packages.
- Editing governance notes or source audit records.

## Next Slice Candidate

Add filtered governance note export/reporting across multiple assistant action audits.
