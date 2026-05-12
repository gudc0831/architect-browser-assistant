# 37. Assistant Audit Cleanup Filter Handoff PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup coverage saved filter links.
Worklog: [../docs/worklogs/2026-05-12-1358-assistant-audit-cleanup-filter-handoff.md](../docs/worklogs/2026-05-12-1358-assistant-audit-cleanup-filter-handoff.md)

## Problem Statement

Cleanup coverage presets make the dashboard easier to scan, but monthly governance handoff still requires admins to manually restate the exact month, category, reviewer, token, cleanup id, stale threshold, and preset scope used for review.

## Solution

Add a read-only filter handoff string to the Admin cleanup review-note report:

1. Reuse the same cleanup review query string that powers dashboard and exports.
2. Display the handoff string on screen.
3. Provide a copy action that writes the handoff string to the clipboard when available.
4. Keep the handoff read-only and avoid adding saved server state.

## Acceptance Criteria

1. Admin users can copy a stable text handoff for the active cleanup coverage filters.
2. The handoff preserves month, category, reviewer, token, cleanup id, stale threshold, and coverage preset.
3. The UI shows the handoff text and copy action without mutating cleanup data.
4. Static checks, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 37 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1358-assistant-audit-cleanup-filter-handoff.md) | PRD and roadmap updated |
| Admin UI filter handoff text/copy action | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1358-assistant-audit-cleanup-filter-handoff.md) | Browser verified copy action and rendered handoff string |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 36 next candidate: cleanup review saved filter links |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | Browser verification | `agent-browser` verified `Copy filter handoff`, rendered `cleanup-review-coverage?month=2026-05...` handoff text, and no console errors beyond React DevTools/HMR/Fast Refresh logs. |

## Out of Scope

- Server-side saved filters.
- Per-user default filter preferences.
- Public share links or signed URLs.

## Next Slice Candidate

Add cleanup coverage reviewed-by quick filter so admins can focus coverage rows by reviewer id directly from reviewer counts.
