# 47. Assistant Audit Cleanup Queue Metrics PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup queue metrics.
Worklog: [../docs/worklogs/2026-05-12-1510-assistant-audit-cleanup-queue-metrics.md](../docs/worklogs/2026-05-12-1510-assistant-audit-cleanup-queue-metrics.md)

## Problem Statement

Queue groups made cleanup governance easier to scan, but reviewers still had to inspect rows to understand how much evidence, deletion volume, or skipped cleanup volume each group represented.

## Solution

Add queue-level totals derived from the visible cleanup coverage rows: run count, cleanup review note count, deleted count, and skipped count. Metrics are read-only and scoped to the active filters.

## Acceptance Criteria

1. Each cleanup queue group shows Runs, Notes, Deleted, and Skipped totals.
2. Totals reconcile with the currently filtered coverage rows.
3. No new server persistence or cleanup metadata mutation is introduced.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 47 PRD and roadmap entry | implemented | `architect-browser-assistant` `b3e5ef2` | [browser worklog](../docs/worklogs/2026-05-12-1510-assistant-audit-cleanup-queue-metrics.md) | PRD and roadmap updated |
| Admin UI queue metrics | implemented | `architect-saas` `130f610` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1510-assistant-audit-cleanup-queue-metrics.md) | Browser UI verified metric labels render |
| User guide and worklogs | implemented | `architect-saas` `130f610`; `architect-browser-assistant` `b3e5ef2` | browser/SaaS worklogs | Static checks completed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 46 next candidate: cleanup queue metrics |
| 2026-05-12 | Static checks | `architect-saas npm run typecheck`; `architect-saas npm run lint` passed with 7 pre-existing hook warnings; `architect-browser-assistant npm run typecheck`; `architect-browser-assistant npm run lint` passed |
| 2026-05-12 | Browser UI | `Runs`, `Notes`, `Deleted`, and `Skipped` queue metric labels rendered on `/admin/assistant`; console showed only React DevTools/HMR/Fast Refresh logs |

## Out of Scope

- Persisted queue snapshots.
- Reviewer assignment counts.
- Cleanup mutation or deletion behavior.

## Next Slice Candidate

Add queue-level shortcut actions so admins can switch to stale unreviewed, reviewed, or all cleanup coverage directly from the queue header area.
