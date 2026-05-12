# 48. Assistant Audit Cleanup Queue Shortcuts PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup queue shortcuts.
Worklog: [../docs/worklogs/2026-05-12-1525-assistant-audit-cleanup-queue-shortcuts.md](../docs/worklogs/2026-05-12-1525-assistant-audit-cleanup-queue-shortcuts.md)

## Problem Statement

Admins could use top-level cleanup coverage shortcut buttons, but once they were scanning grouped queues, moving back to the filter toolbar interrupted the review flow.

## Solution

Add queue-level shortcut buttons in group headers: `Focus stale`, `Focus reviewed`, and `Show all coverage`. These controls reuse existing coverage preset and stale-threshold state.

## Acceptance Criteria

1. Queue group headers expose direct shortcut actions.
2. `Focus stale` selects stale unreviewed coverage with the zero-day stale shortcut.
3. `Focus reviewed` selects reviewed cleanup coverage.
4. `Show all coverage` returns to all coverage with the default 7-day stale threshold.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 48 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1525-assistant-audit-cleanup-queue-shortcuts.md) | PRD and roadmap updated |
| Admin UI queue shortcuts | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1525-assistant-audit-cleanup-queue-shortcuts.md) | Browser UI verified queue shortcut labels and `Focus reviewed` preset transition |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | Static checks completed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 47 next candidate: cleanup queue shortcuts |
| 2026-05-12 | Static checks | `architect-saas npm run typecheck`; `architect-saas npm run lint` passed with 7 pre-existing hook warnings; `architect-browser-assistant npm run typecheck`; `architect-browser-assistant npm run lint` passed |
| 2026-05-12 | Browser UI | `Focus stale`, `Focus reviewed`, and `Show all coverage` rendered on `/admin/assistant`; clicking `Focus reviewed` set Coverage preset to `reviewed`; console showed only React DevTools/HMR/Fast Refresh logs |

## Out of Scope

- Saved queue preferences.
- Reviewer assignment workflows.
- Server-side queue filters beyond existing coverage presets.

## Next Slice Candidate

Add row-level metadata chips so cleanup queue rows expose stale state, note count, reviewer count, and threshold without reading the full row body.
