# 64. Knowledge Copy Source Handoff PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge copy source handoff action.
Worklog: [../docs/worklogs/2026-05-12-1925-knowledge-copy-source-handoff.md](../docs/worklogs/2026-05-12-1925-knowledge-copy-source-handoff.md)

## Problem Statement

Knowledge admins could inspect source chips, but a reviewer still had to manually assemble candidate, task, scope, state, confidence, and evidence context for handoff.

## Solution

Add a `Copy source handoff` action in the WIKI draft editor. The action copies a compact text package for the selected candidate detail.

## Acceptance Criteria

1. WIKI draft editor exposes a copy source handoff action.
2. Copied handoff includes candidate record, task, project, state, review, scope, confidence, evidence count, and evidence kind counts.
3. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 64 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1925-knowledge-copy-source-handoff.md) | PRD and roadmap updated |
| Knowledge copy source handoff action | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1925-knowledge-copy-source-handoff.md) | Final batch verification pending |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 63 next candidate: Knowledge copy source handoff action |

## Next Slice Candidate

Add a preview density toggle so admins can switch the Markdown preview between compact and expanded review modes.
