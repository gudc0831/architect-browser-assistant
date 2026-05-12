# 36. Assistant Audit Cleanup Coverage Presets PRD

Created: 2026-05-12
Parent document: [../PLAN.md](../PLAN.md)
Current status: `implemented`
Goal: Implement and verify assistant audit cleanup coverage filter presets.
Worklog: [../docs/worklogs/2026-05-12-1344-assistant-audit-cleanup-coverage-presets.md](../docs/worklogs/2026-05-12-1344-assistant-audit-cleanup-coverage-presets.md)

## Problem Statement

Cleanup coverage now exposes reviewed, unreviewed, and stale status, but admins still need to combine low-level filters manually. Monthly governance review needs explicit presets that quickly answer three common questions: show all cleanup runs, show already reviewed cleanup runs, and show stale unreviewed cleanup runs.

## Solution

Add a `coveragePreset` filter to cleanup review coverage:

1. `all` shows every cleanup run in the current filter scope.
2. `reviewed` shows cleanup runs with at least one cleanup review note.
3. `stale_unreviewed` shows unreviewed cleanup runs older than the selected stale threshold.
4. Apply the preset to dashboard coverage rows, summary metrics, CSV/JSON exports, and Markdown rollup package.
5. Surface the active preset in the Admin UI without mutating cleanup notes or cleanup metadata.

## Acceptance Criteria

1. Admin users can switch coverage filters with explicit presets for all, reviewed, and stale unreviewed cleanup runs.
2. Presets update the visible dashboard and coverage exports without mutating cleanup notes.
3. Preset state is visible in the Admin UI and documented in this PRD.
4. Static checks, API verification, Browser UI verification, user guide, worklog, and repo commits are completed.

## Implementation Status

Current implementation state: `implemented`

| Item | Status | Commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 36 PRD and roadmap entry | implemented | architect-browser-assistant `e62e7d4` | [browser worklog](../docs/worklogs/2026-05-12-1344-assistant-audit-cleanup-coverage-presets.md) | PRD and roadmap updated |
| Cleanup coverage preset API filter | implemented | architect-saas `e1f1292` | [SaaS worklog](../../architect-saas/docs/worklogs/2026-05-12-1344-assistant-audit-cleanup-coverage-presets.md) | API returned `coveragePreset` in coverage/summary/JSON and filtered rows |
| Admin UI preset selector | implemented | architect-saas `e1f1292` | SaaS worklog | Browser verified `Coverage preset` selector and `Stale unreviewed` state |
| User guide and worklogs | implemented | architect-saas `e1f1292`; architect-browser-assistant `e62e7d4` | browser/SaaS worklogs | User guide and compact worklogs updated |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-12 | Planning | Slice selected from roadmap candidate: cleanup review coverage filter presets |
| 2026-05-12 | Static checks | `architect-saas`: `npm run typecheck` passed; `npm run lint` passed with 7 pre-existing React hook warnings in task components. `architect-browser-assistant`: `npm run typecheck` and `npm run lint` passed. |
| 2026-05-12 | API verification | `GET /api/admin/assistant/cleanup-review-notes/coverage?month=2026-05&coveragePreset=stale_unreviewed&staleDays=0` returned `200` with `coveragePreset: stale_unreviewed`. Summary and JSON export verified `reviewed` preset. Markdown rollup verified stale-unreviewed preset output. |
| 2026-05-12 | Browser verification | `agent-browser` verified the `Coverage preset` selector and selected `Stale unreviewed`. Console contained React DevTools and Fast Refresh logs only. |

## Out of Scope

- Saving per-admin default presets.
- Adding a separate cleanup review workflow queue.
- Mutating cleanup review notes or cleanup metadata from preset selection.

## Next Slice Candidate

Add cleanup review saved filter links so admins can copy a URL-like query summary for monthly governance handoff.
