# 70. Knowledge Candidate Row Risk Chips PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge candidate row risk chips.
Worklog: [../docs/worklogs/2026-05-12-2055-knowledge-candidate-row-risk-chips.md](../docs/worklogs/2026-05-12-2055-knowledge-candidate-row-risk-chips.md)

## Problem Statement

Knowledge admins could only see candidate state, title, project, and task in the queue. Risk signals such as confidence band, reviewed state, and cleanup state required opening a candidate.

## Solution

Add compact risk chips to each candidate queue row using list data that is already loaded.

## Acceptance Criteria

1. Candidate queue rows show risk chips.
2. Chips include confidence band, reviewed/unreviewed state, and cleanup state.
3. Chips are read-only and do not change filtering or selection.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 70 PRD and roadmap entry | implemented | `f340c2e` | [browser worklog](../docs/worklogs/2026-05-12-2055-knowledge-candidate-row-risk-chips.md) | PRD and roadmap updated |
| Knowledge candidate row risk chips | implemented | `e010a08` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-2055-knowledge-candidate-row-risk-chips.md) | `npm run typecheck`, `npm run lint`, API 200, and Browser UI verification passed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 69 next candidate: Knowledge candidate row risk chips |
| 2026-05-12 | Final verification | SaaS typecheck passed; SaaS lint passed with 7 pre-existing hook warnings; browser-assistant typecheck/lint passed; `/api/admin/knowledge/candidates` returned 200; agent-browser verified confidence band, reviewed/unreviewed, and cleanup-state chips in candidate queue rows |

## Next Slice Candidate

Add Knowledge candidate risk quick filters so admins can focus low-confidence or unreviewed candidates from the queue.
