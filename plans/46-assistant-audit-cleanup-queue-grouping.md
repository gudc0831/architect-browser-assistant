# 46. Assistant Audit Cleanup Queue Grouping PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup governance queue grouping.
Worklog: [../docs/worklogs/2026-05-12-1450-assistant-audit-cleanup-queue-grouping.md](../docs/worklogs/2026-05-12-1450-assistant-audit-cleanup-queue-grouping.md)

## Problem Statement

Cleanup coverage rows were visible as a flat list, which made monthly governance review harder because urgent stale gaps, ordinary unreviewed runs, and reviewed evidence were mixed together.

## Solution

Group the existing cleanup coverage rows into three read-only queues: stale unreviewed, other unreviewed, and reviewed evidence. The grouping uses the existing coverage API response and does not change cleanup metadata or export contracts.

## Acceptance Criteria

1. Cleanup coverage rows are grouped into stale unreviewed, other unreviewed, and reviewed evidence sections.
2. Each group keeps the existing cleanup row actions: review cleanup, focus token, focus cleanup, and export package.
3. Empty groups show a clear empty state without hiding the current filter scope.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 46 PRD and roadmap entry | implemented | pending commit | [browser worklog](../docs/worklogs/2026-05-12-1450-assistant-audit-cleanup-queue-grouping.md) | PRD and roadmap updated |
| Admin UI queue grouping | implemented | pending commit | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1450-assistant-audit-cleanup-queue-grouping.md) | Browser UI verified all three queue headings render |
| User guide and worklogs | implemented | pending commit | browser/SaaS worklogs | Static checks and API verification completed |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from Slice 45 next candidate: cleanup governance queue grouping |
| 2026-05-12 | Static checks | `architect-saas npm run typecheck`; `architect-saas npm run lint` passed with 7 pre-existing hook warnings; `architect-browser-assistant npm run typecheck`; `architect-browser-assistant npm run lint` passed |
| 2026-05-12 | API check | `/api/admin/assistant/cleanup-review-notes/coverage?month=2026-05&coveragePreset=all&staleDays=7` returned coverage rows without contract changes |
| 2026-05-12 | Browser UI | `Stale unreviewed queue`, `Other unreviewed queue`, and `Reviewed evidence queue` rendered on `/admin/assistant`; console showed only React DevTools/HMR/Fast Refresh logs |

## Out of Scope

- Mutating cleanup metadata.
- Reviewer assignment queues.
- Server-side queue persistence.

## Next Slice Candidate

Add queue-level metrics so admins can compare run counts, note counts, and cleanup counts across cleanup governance groups.
