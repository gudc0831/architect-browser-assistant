# 31. Assistant Audit Cleanup Coverage Export PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup reviewed/unreviewed coverage CSV export.
Worklog: [../docs/worklogs/2026-05-12-1310-assistant-audit-cleanup-coverage-export.md](../docs/worklogs/2026-05-12-1310-assistant-audit-cleanup-coverage-export.md)

## Problem Statement

Cleanup note summary shows reviewed and unreviewed counts, but admins need a durable monthly export listing every cleanup run and its note coverage status. This lets governance reviewers reconcile cleanup runs without manually opening each detail page.

## Solution

Add a read-only coverage CSV export:

1. Use the same month/category/reviewer/token/cleanup-id filters as the cleanup note report.
2. Export cleanup runs with reviewed/unreviewed status.
3. Include cleanup id, token, actor, cutoff, deleted/skipped counts, note count, latest note timestamp, and reviewer ids.
4. Add an `Export coverage CSV` link to the cleanup review-note report.

## Acceptance Criteria

1. Admin users can export cleanup runs with reviewed/unreviewed status under the active filter scope.
2. CSV includes cleanup id, token, actor, cutoff, deleted/skipped counts, note count, latest note timestamp, and reviewer ids.
3. Export is read-only and reconciles with cleanup note summary coverage counts.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 31 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1310-assistant-audit-cleanup-coverage-export.md) | PRD and roadmap updated |
| Coverage CSV export API | implemented | architect-saas `b69a0d9` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1310-assistant-audit-cleanup-coverage-export.md) | API returned CSV attachment with coverage status, reviewed row, and reviewer ids |
| Admin UI export action | implemented | architect-saas `b69a0d9` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1310-assistant-audit-cleanup-coverage-export.md) | Browser verified `Export coverage CSV` link in cleanup note report |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup note reviewed/unreviewed CSV export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/coverage/export?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned `200`, CSV attachment, `coverage_status`, reviewed status, and reviewer ids. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Export coverage CSV` link in cleanup review-note report. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Editing cleanup notes.
- Creating a separate coverage dashboard table.
- Changing cleanup note summary calculations.

## Next Slice Candidate

Add an on-screen cleanup coverage dashboard so admins can review cleanup runs with coverage status without downloading CSV first.
