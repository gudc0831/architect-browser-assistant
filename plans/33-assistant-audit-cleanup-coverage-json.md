# 33. Assistant Audit Cleanup Coverage JSON PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup coverage JSON export.
Worklog: [../docs/worklogs/2026-05-12-1338-assistant-audit-cleanup-coverage-json.md](../docs/worklogs/2026-05-12-1338-assistant-audit-cleanup-coverage-json.md)

## Problem Statement

Coverage CSV is useful for spreadsheets, but governance automation and evidence archiving need a machine-readable export that preserves filters, summary counts, and coverage rows together.

## Solution

Add coverage JSON export:

1. Use the same filters as cleanup note report, summary, dashboard, and coverage CSV.
2. Return a read-only JSON attachment with warning, filters, summary counts, category/reviewer counts, and coverage rows.
3. Add an `Export coverage JSON` link to the Admin cleanup note report.

## Acceptance Criteria

1. Admin users can export cleanup coverage as JSON under the active filter scope.
2. JSON includes warning, filters, summary counts, and coverage rows.
3. Export is read-only and does not mutate cleanup notes or cleanup metadata.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 33 PRD and roadmap entry | implemented | architect-browser-assistant `4a295ec` | [browser worklog](../docs/worklogs/2026-05-12-1338-assistant-audit-cleanup-coverage-json.md) | PRD and roadmap updated |
| Coverage JSON export API | implemented | architect-saas `554ea17` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1338-assistant-audit-cleanup-coverage-json.md) | API returned JSON attachment with warning, summary count, and reviewed row |
| Admin UI export action | implemented | architect-saas `554ea17` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1338-assistant-audit-cleanup-coverage-json.md) | Browser verified `Export coverage JSON` link |
| User guide and worklogs | implemented | architect-saas `554ea17`; architect-browser-assistant `4a295ec` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup coverage JSON export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/coverage/json?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned `200`, JSON attachment, read-only warning, summary totalNotes 2, and reviewed coverage row. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Export coverage JSON` link in cleanup review-note report. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- New JSON schema versioning.
- Signing or uploading evidence packages.
- Changing coverage dashboard layout.

## Next Slice Candidate

Add stale cleanup review alerts so admins can identify cleanup runs that remain unreviewed beyond a configurable age threshold.
