# 44. Assistant Audit Cleanup Stale Unreviewed Shortcut PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup stale-unreviewed shortcut.
Worklog: [../docs/worklogs/2026-05-12-1426-assistant-audit-cleanup-stale-unreviewed-shortcut.md](../docs/worklogs/2026-05-12-1426-assistant-audit-cleanup-stale-unreviewed-shortcut.md)

## Problem Statement

Stale unreviewed cleanup runs are the most urgent coverage gap, but admins currently need to combine coverage preset and stale threshold controls to get that view.

## Solution

Add `Show stale unreviewed` to the cleanup review report tools. The action sets coverage preset to `stale_unreviewed` and stale days to `0`, then the existing query path refreshes summary, dashboard, and exports.

## Acceptance Criteria

1. Admin users can switch directly to stale-unreviewed cleanup coverage with one action.
2. The action sets coverage preset and stale threshold consistently.
3. The stale-only quick filter is documented and remains read-only.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 44 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1426-assistant-audit-cleanup-stale-unreviewed-shortcut.md) | PRD and roadmap updated |
| Admin UI stale-unreviewed shortcut | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1426-assistant-audit-cleanup-stale-unreviewed-shortcut.md) | Browser verified shortcut sets preset and stale threshold |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 43 next candidate: cleanup coverage stale-only quick filter |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Show stale unreviewed`; activating it set coverage preset to `stale_unreviewed` and stale days to `0`. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Server-side saved queues.
- Notifications for stale cleanup runs.
- Mutating cleanup metadata.

## Next Slice Candidate

Add cleanup coverage reviewed-only shortcut so admins can return directly to reviewed cleanup evidence.
