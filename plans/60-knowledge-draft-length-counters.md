# 60. Knowledge Draft Length Counters PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify Knowledge draft length counters.
Worklog: [../docs/worklogs/2026-05-12-1825-knowledge-draft-length-counters.md](../docs/worklogs/2026-05-12-1825-knowledge-draft-length-counters.md)

## Problem Statement

Knowledge draft review did not show quick size signals for title, summary, body, or tags while editing.

## Solution

Add read-only draft length counters derived from local editor state.

## Acceptance Criteria

1. Draft editor shows title, summary, body, and tag counts.
2. Counts update from local draft state.
3. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 60 PRD and roadmap entry | implemented | `architect-browser-assistant` `378d702` | [browser worklog](../docs/worklogs/2026-05-12-1825-knowledge-draft-length-counters.md) | PRD and roadmap updated |
| Knowledge draft length counters | implemented | `architect-saas` `a214d97` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1825-knowledge-draft-length-counters.md) | `npm run typecheck`, `npm run lint`, API 200, and Browser UI verification passed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 59 next candidate: Knowledge draft length counters |
| 2026-05-12 | Final verification | SaaS typecheck passed; SaaS lint passed with 7 pre-existing hook warnings; browser-assistant typecheck/lint passed; `/api/admin/knowledge/candidates` returned 200; agent-browser verified Title/Summary/Body/Tags counters on `/admin/knowledge` |

## Next Slice Candidate

Add a clear candidate search action to reset Knowledge Admin search without touching state filters.
