# 32. Assistant Audit Cleanup Coverage Dashboard PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup reviewed/unreviewed coverage dashboard.
Worklog: [../docs/worklogs/2026-05-12-1324-assistant-audit-cleanup-coverage-dashboard.md](../docs/worklogs/2026-05-12-1324-assistant-audit-cleanup-coverage-dashboard.md)

## Problem Statement

Coverage CSV export is useful for monthly governance review, but admins also need to inspect reviewed/unreviewed cleanup runs directly inside the Admin UI before exporting.

## Solution

Add a read-only cleanup coverage dashboard:

1. Add a coverage JSON API using the same filters as cleanup note report/export.
2. Show coverage cards with reviewed/unreviewed status, cleanup id, token, note count, latest note timestamp, reviewer ids, and cleanup counts.
3. Link each coverage card back to cleanup detail and package export.
4. Keep dashboard rows reconciled with coverage CSV export.

## Acceptance Criteria

1. Admin users can see cleanup coverage cards for active cleanup note report filters.
2. Each card shows reviewed/unreviewed status, cleanup id, token, note count, latest note timestamp, and reviewer ids.
3. Cards expose cleanup detail/package actions.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 32 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1324-assistant-audit-cleanup-coverage-dashboard.md) | PRD and roadmap updated |
| Coverage JSON API | implemented | architect-saas `a5409e5` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1324-assistant-audit-cleanup-coverage-dashboard.md) | API returned reviewed row, note count, and reviewer ids |
| Admin UI coverage cards | implemented | architect-saas `a5409e5` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1324-assistant-audit-cleanup-coverage-dashboard.md) | Browser verified reviewed coverage card, note count, and reviewers |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup coverage dashboard |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/coverage?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned one reviewed coverage row with note count 2 and reviewer id. |
| 2026-05-12 | Browser verification | `agent-browser` verified coverage cards in cleanup review-note report with reviewed status, note count, and reviewer id. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- New charting components.
- Editing cleanup notes from coverage cards.
- Changing coverage CSV columns.

## Next Slice Candidate

Add cleanup coverage JSON export so admins can download machine-readable coverage evidence using the same filters as the dashboard and CSV.
