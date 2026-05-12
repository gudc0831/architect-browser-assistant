# 62. Knowledge Reset Draft PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge reset draft action.
Worklog: [../docs/worklogs/2026-05-12-1855-knowledge-reset-draft.md](../docs/worklogs/2026-05-12-1855-knowledge-reset-draft.md)

## Problem Statement

Knowledge admins could edit the WIKI draft but had no quick way to restore the loaded candidate draft after local edits.

## Solution

Add a `Reset draft` action in the WIKI draft editor. The action restores title, summary, Markdown body, tags, scope, and rejection reason from the selected candidate detail without changing queue filters.

## Acceptance Criteria

1. WIKI draft editor exposes a reset action.
2. Reset restores the editable draft fields from the currently loaded candidate detail.
3. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 62 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1855-knowledge-reset-draft.md) | PRD and roadmap updated |
| Knowledge reset draft action | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1855-knowledge-reset-draft.md) | Final batch verification pending |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 61 next candidate: Knowledge reset draft action |

## Next Slice Candidate

Add a copy Markdown action so admins can copy the current WIKI draft body for handoff or external review.
