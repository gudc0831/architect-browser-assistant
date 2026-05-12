# 29. Assistant Audit Cleanup Note Report PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup review-note reporting and CSV export.
Worklog: [../docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md](../docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md)

## Problem Statement

Cleanup review notes are useful inside one cleanup detail panel, but admins also need to review notes across cleanup runs by category, reviewer, cleanup token, and cleanup id. Opening each cleanup run one at a time does not scale for governance review.

## Solution

Add cleanup review-note reporting:

1. Add an admin-only report API for cleanup review notes.
2. Join cleanup notes with their source cleanup audit run to expose token, cutoff, actor, and deleted/skipped counts.
3. Add a filtered CSV export that mirrors report filters.
4. Surface report filters and cards in `/admin/assistant`.
5. Keep report/export read-only and separate from retention cleanup eligibility.

## Acceptance Criteria

1. Admin users can list cleanup review notes across cleanup runs.
2. Admin users can filter cleanup notes by category, reviewer, preview token, cleanup id, and month.
3. CSV export mirrors active filters and includes note text, reviewer, timestamp, cleanup id, cleanup token, cutoff, and cleanup counts.
4. Report cards link back to cleanup detail/package actions.
5. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 29 PRD and roadmap entry | implemented | pending browser-assistant commit | [browser worklog](../docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md) | PRD and roadmap updated |
| Cleanup note report API | implemented | architect-saas `c969bd5` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md) | API returned filtered notes with cleanup id, token, and counts |
| Cleanup note CSV export | implemented | architect-saas `c969bd5` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md) | CSV returned note headers, cleanup context, and note text |
| Admin UI cleanup note report | implemented | architect-saas `c969bd5` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1228-assistant-audit-cleanup-note-report.md) | Browser verified report cards, filters, export link, and cleanup actions |
| User guide and worklogs | implemented | pending repo commits | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup review-note reporting/export |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned 2 notes with cleanup id, token, and counts. |
| 2026-05-12 | CSV verification | `GET /api/admin/assistant/cleanup-review-notes/export?month=2026-05&category=review_note&archivePreviewToken=b0ad7bf1bf61cf86308c2afe` returned `200`, CSV attachment, expected headers, and note text. |
| 2026-05-12 | Browser verification | `agent-browser` verified cleanup review-note report, filters, CSV export link, report cards, cleanup actions, desktop screenshot, and 390px mobile screenshot. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Editing or deleting cleanup review notes.
- Adding cleanup note summary analytics.
- Changing retention cleanup eligibility.

## Next Slice Candidate

Add cleanup governance summary metrics so admins can see category counts, reviewer counts, and cleanup-token coverage for cleanup review notes.
