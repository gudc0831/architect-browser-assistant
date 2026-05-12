# 41. Assistant Audit Cleanup Stale Threshold Presets PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup stale-threshold presets.
Worklog: [../docs/worklogs/2026-05-12-1416-assistant-audit-cleanup-stale-threshold-presets.md](../docs/worklogs/2026-05-12-1416-assistant-audit-cleanup-stale-threshold-presets.md)

## Problem Statement

Admins can type any stale-day threshold, but repeated monthly review commonly uses immediate, weekly, and monthly stale windows. Retyping these values slows review and increases handoff variance.

## Solution

Add read-only stale threshold preset buttons for 0, 7, and 30 days. Presets update the existing stale-days state, so stale alerts, summary, coverage rows, and exports continue to use the same query path.

## Acceptance Criteria

1. Admin users can switch stale threshold to common preset windows.
2. Presets update stale alerts, summary, coverage dashboard, and exports.
3. The threshold presets are documented and remain read-only.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 41 PRD and roadmap entry | implemented | architect-browser-assistant `ae6d2c2` | [browser worklog](../docs/worklogs/2026-05-12-1416-assistant-audit-cleanup-stale-threshold-presets.md) | PRD and roadmap updated |
| Admin UI stale threshold presets | implemented | architect-saas `085e86c` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1416-assistant-audit-cleanup-stale-threshold-presets.md) | Browser verified 0/7/30 preset controls |
| User guide and worklogs | implemented | architect-saas `085e86c`; architect-browser-assistant `ae6d2c2` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 40 next candidate: cleanup coverage stale-threshold presets |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | Browser verification | `agent-browser` verified `0 stale days`, `7 stale days`, and `30 stale days`; selecting `30 stale days` populated stale-days field with `30`. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Persisted threshold defaults.
- Organization-level stale policy settings.
- Mutating cleanup metadata.

## Next Slice Candidate

Add cleanup coverage clear-filter action so admins can return the cleanup review report to the default all-runs scope in one click.
