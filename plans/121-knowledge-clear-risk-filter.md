# Slice 121: Knowledge Clear Risk Filter

## Product Context

Focused risk review should have a clear path back to all categories.

## Goal

Add a clear risk group filter action to `/admin/knowledge`.

## Scope

- Add `Clear risk group` beside risk filter shortcuts.
- Disable the action when all groups are already visible.
- Reset the active risk filter to all groups.
- Keep the action client-side.

## Acceptance Criteria

1. `/admin/knowledge` shows `Clear risk group`.
2. The action is disabled when all risk groups are visible.
3. Selecting a category enables the action.
4. Clicking the action restores all risk groups.
5. Active filter chips update after clearing.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for clear risk filter.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: `GET /api/admin/knowledge/candidates` returned 200.
- 2026-05-13: Browser UI verification confirmed `Clear risk group` restores all five risk group detail cards.
