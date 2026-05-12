# 59. Knowledge Evidence-Kind Rollup PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge evidence-kind rollup chips.
Worklog: [../docs/worklogs/2026-05-12-1810-knowledge-evidence-kind-rollup.md](../docs/worklogs/2026-05-12-1810-knowledge-evidence-kind-rollup.md)

## Problem Statement

Knowledge admins could see evidence rows and total evidence count, but not the mix of evidence kinds supporting a WIKI candidate.

## Solution

Add read-only evidence-kind rollup chips derived from the candidate evidence array.

## Acceptance Criteria

1. Knowledge draft detail shows evidence-kind counts.
2. Counts are read-only and derived from candidate evidence.
3. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 59 PRD and roadmap entry | implemented | `architect-browser-assistant` `0b1623d` | [browser worklog](../docs/worklogs/2026-05-12-1810-knowledge-evidence-kind-rollup.md) | PRD and roadmap updated |
| Knowledge evidence-kind rollup chips | implemented | `architect-saas` `50f7eaf` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1810-knowledge-evidence-kind-rollup.md) | Final batch verification pending |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 58 next candidate: Knowledge evidence-kind rollup chips |

## Next Slice Candidate

Add Knowledge draft length counters for title, summary, body, and tags.
