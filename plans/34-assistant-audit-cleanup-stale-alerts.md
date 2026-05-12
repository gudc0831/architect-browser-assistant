# 34. Assistant Audit Cleanup Stale Alerts PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup stale review alerts.
Worklog: [../docs/worklogs/2026-05-12-1352-assistant-audit-cleanup-stale-alerts.md](../docs/worklogs/2026-05-12-1352-assistant-audit-cleanup-stale-alerts.md)

## Problem Statement

Coverage rows identify reviewed and unreviewed cleanup runs, but admins need a quick way to spot unreviewed runs that are old enough to require governance attention.

## Solution

Add stale review alerts:

1. Add a `staleDays` threshold to cleanup review summary and coverage APIs.
2. Mark unreviewed cleanup rows older than the threshold as stale.
3. Show `Stale days`, `Stale unreviewed`, and `stale review alert` in the Admin coverage dashboard.
4. Include stale fields in coverage CSV/JSON exports.

## Acceptance Criteria

1. Admin users can set a stale threshold in days for cleanup review coverage.
2. Coverage rows show stale/unreviewed status for cleanup runs older than the threshold without notes.
3. Stale counts reconcile with coverage rows and exports.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 34 PRD and roadmap entry | implemented | architect-browser-assistant `7038048` | [browser worklog](../docs/worklogs/2026-05-12-1352-assistant-audit-cleanup-stale-alerts.md) | PRD and roadmap updated |
| Stale coverage API fields | implemented | architect-saas `08c7339` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1352-assistant-audit-cleanup-stale-alerts.md) | API returned stale threshold, stale count, `isStale`, and export fields |
| Admin UI stale alerts | implemented | architect-saas `08c7339` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1352-assistant-audit-cleanup-stale-alerts.md) | Browser verified `Stale days` control and `Stale unreviewed` metric |
| User guide and worklogs | implemented | architect-saas `08c7339`; architect-browser-assistant `7038048` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: stale cleanup review alerts |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | Summary and coverage APIs with `staleDays=0` returned stale threshold fields; category `risk` coverage returned an unreviewed stale row; CSV export included `stale_threshold_days` and `is_stale`. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Stale days` and `Stale unreviewed` UI in cleanup review-note report. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Notifications or scheduled alerts.
- Persisting stale threshold as policy.
- Mutating cleanup metadata.

## Next Slice Candidate

Add cleanup reviewer rollup package export so admins can download a Markdown summary of reviewers, categories, stale status, and coverage rows for monthly governance review.
