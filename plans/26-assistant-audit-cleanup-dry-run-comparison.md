# 26. Assistant Audit Cleanup Dry-Run Comparison PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup dry-run comparison.
Worklog: [../docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md](../docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md)

## Problem Statement

Admins can now run guarded cleanup and review cleanup history, but they still need to compare a previous cleanup token with the current retention preview before another cleanup run. The comparison must stay read-only and make it clear which events are newly eligible, already represented by a previous cleanup run, and still protected.

## Solution

Add a read-only cleanup dry-run comparison:

1. Accept a previous cleanup archive preview token and current retention preview parameters.
2. Load the matching cleanup history event and recompute the current retention preview.
3. Return counts and ids for newly eligible, previously deleted/skipped, and currently protected records.
4. Provide a JSON export of the comparison for review.
5. Surface the comparison in `/admin/assistant` near cleanup history.

## Acceptance Criteria

1. Admin users can select a previous cleanup token and compare it with the current retention preview token.
2. The comparison shows newly eligible, already deleted/skipped, and still protected counts without deleting records.
3. The comparison can be exported as read-only JSON for review before another cleanup run.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 26 PRD and roadmap entry | implemented | `architect-browser-assistant` `4a26f87` | [browser worklog](../docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md) | PRD and roadmap updated |
| Dry-run comparison API | implemented | `architect-saas` `dc6cc48` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md) | API returned current token, 0 newly eligible, 0 previous deleted/skipped, 6 still protected |
| Dry-run JSON export | implemented | `architect-saas` `dc6cc48` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md) | JSON export returned read-only warning and comparison fields |
| Admin UI comparison controls | implemented | `architect-saas` `dc6cc48` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1128-assistant-audit-cleanup-comparison.md) | Browser verified comparison input, result metrics, export link, and mobile layout |
| User guide and worklogs | implemented | `architect-saas` `dc6cc48`; `architect-browser-assistant` `4a26f87` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: assistant audit cleanup dry-run comparison |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/audit-cleanups/compare?month=2026-05&retentionDays=365&archivePreviewToken=b0ad7bf1bf61cf86308c2afe&limit=500` returned current preview token, 0 newly eligible, 0 previous deleted/skipped, and 6 still protected. |
| 2026-05-12 | Export verification | `GET /api/admin/assistant/audit-cleanups/compare/export?...` returned `200`, JSON attachment headers, read-only warning, `newlyEligibleIds`, and `currentPreview`. |
| 2026-05-12 | Browser verification | `agent-browser` verified `/admin/assistant` dry-run comparison controls, result metrics, export link, desktop screenshot, and 390px mobile screenshot. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Deleting records.
- Restoring deleted records.
- Scheduling cleanup jobs.
- Comparing non-assistant audit domains.

## Next Slice Candidate

Add assistant audit cleanup detail drill-down and evidence package export for one cleanup run.
