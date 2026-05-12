# 30. Assistant Audit Cleanup Note Summary PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup review-note summary metrics.
Worklog: [../docs/worklogs/2026-05-12-1242-assistant-audit-cleanup-note-summary.md](../docs/worklogs/2026-05-12-1242-assistant-audit-cleanup-note-summary.md)

## Problem Statement

Cleanup review-note reporting lists individual notes, but admins also need quick governance coverage: how many cleanup runs have notes, which runs remain unreviewed, and which categories/reviewers dominate the selected filter scope.

## Solution

Add cleanup review-note summary metrics:

1. Add a read-only summary API using the same filters as cleanup note reporting.
2. Return total note count, total cleanup runs, reviewed cleanup runs, unreviewed cleanup runs, category counts, and reviewer counts.
3. Surface summary metrics above cleanup note report cards in `/admin/assistant`.
4. Keep summary metrics read-only and reconciled with report/export filters.

## Acceptance Criteria

1. Admin users can see cleanup note counts by category and reviewer for the selected month/filter scope.
2. The summary shows reviewed cleanup runs, unreviewed cleanup runs, and total cleanup runs.
3. Summary metrics reconcile with the cleanup note report filters.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 30 PRD and roadmap entry | implemented | architect-browser-assistant `06c26ef` | [browser worklog](../docs/worklogs/2026-05-12-1242-assistant-audit-cleanup-note-summary.md) | PRD and roadmap updated |
| Cleanup note summary API | implemented | architect-saas `a0275ad` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1242-assistant-audit-cleanup-note-summary.md) | API returned total notes, cleanup coverage, category counts, and reviewer counts |
| Admin UI summary metrics | implemented | architect-saas `a0275ad` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1242-assistant-audit-cleanup-note-summary.md) | Browser verified summary metrics above cleanup note report cards |
| User guide and worklogs | implemented | architect-saas `a0275ad`; architect-browser-assistant `06c26ef` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup governance summary metrics |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/summary?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned 2 notes, 1 cleanup run, 1 reviewed run, 0 unreviewed runs, category count 2, and reviewer count 2. |
| 2026-05-12 | Browser verification | `agent-browser` verified cleanup note summary metrics, category counts, reviewer counts, report cards, and desktop screenshot. Console contained React DevTools/HMR logs only. |

## Out of Scope

- Chart rendering.
- Per-reviewer drill-down pages.
- Changing cleanup note report/export filters.

## Next Slice Candidate

Add cleanup note reviewed/unreviewed CSV export so admins can export cleanup runs with note coverage status for monthly governance review.
