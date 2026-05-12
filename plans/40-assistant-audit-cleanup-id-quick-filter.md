# 40. Assistant Audit Cleanup Id Quick Filter PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup coverage cleanup-id quick filter.
Worklog: [../docs/worklogs/2026-05-12-1412-assistant-audit-cleanup-id-quick-filter.md](../docs/worklogs/2026-05-12-1412-assistant-audit-cleanup-id-quick-filter.md)

## Problem Statement

Admins can review a cleanup row, but isolating that single cleanup run across notes, summary, coverage, and exports still requires manually copying the cleanup audit id.

## Solution

Add a `Focus cleanup` action to each cleanup coverage row. The action sets the cleanup id filter to that row's cleanup id and reuses existing filtered report/export behavior.

## Acceptance Criteria

1. Cleanup coverage rows expose a quick action to focus one cleanup id.
2. The cleanup-id quick filter updates cleanup notes, summary, coverage dashboard, and exports.
3. The quick filter is documented and remains read-only.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 40 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1412-assistant-audit-cleanup-id-quick-filter.md) | PRD and roadmap updated |
| Admin UI cleanup-id quick filter | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1412-assistant-audit-cleanup-id-quick-filter.md) | Browser verified `Focus cleanup` sets cleanup-id filter |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 39 next candidate: cleanup coverage cleanup-id quick filter |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Focus cleanup`; activating it populated cleanup id filter with `a9c28b2b-81f0-4879-9952-f6b8f1be18f5`. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Bulk cleanup selection.
- Cleanup id aliases.
- Mutating cleanup metadata.

## Next Slice Candidate

Add cleanup coverage stale-threshold presets so admins can switch common stale windows without typing numeric values.
