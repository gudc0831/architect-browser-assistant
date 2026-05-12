# 51. Knowledge Candidate Queue Counts PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge candidate queue counts.
Worklog: [../docs/worklogs/2026-05-12-1610-knowledge-candidate-queue-counts.md](../docs/worklogs/2026-05-12-1610-knowledge-candidate-queue-counts.md)

## Problem Statement

Knowledge admins could filter candidate states, but they could not see the size of candidate, approved, rejected, or all queues before choosing a filter.

## Solution

Add state totals to the Knowledge Admin candidate queue using the existing candidate list response.

## Acceptance Criteria

1. Knowledge Admin shows Candidate, Approved, Rejected, and All counts.
2. Counts are derived from the loaded candidate list and do not require a new API.
3. Existing candidate selection and detail review flows remain unchanged.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 51 PRD and roadmap entry | implemented | `architect-browser-assistant` `d6a4479` | [browser worklog](../docs/worklogs/2026-05-12-1610-knowledge-candidate-queue-counts.md) | PRD and roadmap updated |
| Knowledge Admin queue counts | implemented | `architect-saas` `9742831` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1610-knowledge-candidate-queue-counts.md) | Browser UI verified state count labels render |
| User guide and worklogs | implemented | `architect-saas` `9742831`; `architect-browser-assistant` `d6a4479` | browser/SaaS worklogs | Static checks completed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 50 next candidate: Knowledge candidate queue counts |
| 2026-05-12 | Static checks | `architect-saas npm run typecheck`; `architect-saas npm run lint` passed with 7 pre-existing hook warnings; `architect-browser-assistant npm run typecheck`; `architect-browser-assistant npm run lint` passed |
| 2026-05-12 | Browser UI | Candidate/Approved/Rejected/All count labels rendered on `/admin/knowledge`; console showed only React DevTools/HMR/Fast Refresh logs |

## Out of Scope

- New knowledge candidate APIs.
- Search or grouping behavior.
- Knowledge item mutation changes.

## Next Slice Candidate

Add Knowledge candidate quick filter buttons so admins can change candidate state filters without opening the select.
