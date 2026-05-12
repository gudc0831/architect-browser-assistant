# 45. Assistant Audit Cleanup Reviewed Shortcut PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup reviewed coverage shortcut.
Worklog: [../docs/worklogs/2026-05-12-1430-assistant-audit-cleanup-reviewed-shortcut.md](../docs/worklogs/2026-05-12-1430-assistant-audit-cleanup-reviewed-shortcut.md)

## Problem Statement

After reviewing stale cleanup gaps, admins need a fast path back to reviewed cleanup evidence without opening the coverage preset selector.

## Solution

Add `Show reviewed cleanup` to the cleanup review report tools. The action sets coverage preset to `reviewed`, and the existing query path refreshes notes, summary, coverage rows, and exports.

## Acceptance Criteria

1. Admin users can switch directly to reviewed cleanup coverage with one action.
2. The action sets coverage preset consistently and leaves cleanup metadata unchanged.
3. The reviewed-only shortcut is documented and remains read-only.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 45 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1430-assistant-audit-cleanup-reviewed-shortcut.md) | PRD and roadmap updated |
| Admin UI reviewed shortcut | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1430-assistant-audit-cleanup-reviewed-shortcut.md) | Browser UI verified `Show reviewed cleanup` sets Coverage preset to `reviewed` |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | Static checks and API verification completed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 44 next candidate: cleanup coverage reviewed-only shortcut |
| 2026-05-12 | Static checks | `architect-saas npm run typecheck`; `architect-saas npm run lint` passed with 7 pre-existing hook warnings; `architect-browser-assistant npm run typecheck`; `architect-browser-assistant npm run lint` passed |
| 2026-05-12 | API check | `/api/admin/assistant/cleanup-review-notes/coverage?month=2026-05&coveragePreset=reviewed&staleDays=7` returned `filters.coveragePreset: reviewed` and reviewed coverage rows |
| 2026-05-12 | Browser UI | `Show reviewed cleanup` rendered on `/admin/assistant`; clicking it set Coverage preset to `reviewed`; console showed only React DevTools/HMR/Fast Refresh logs |

## Out of Scope

- Server-side reviewed queues.
- Reviewer assignment workflows.
- Mutating cleanup metadata.

## Next Slice Candidate

Add cleanup governance queue grouping so admins can group cleanup runs by review status and stale state before moving into broader Knowledge/WIKI product work.
