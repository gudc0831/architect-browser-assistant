# Slice 120: Knowledge Active Risk Filter Chips

## Product Context

When a risk group filter is active, reviewers need visible confirmation of the current filter and how many groups are shown.

## Goal

Add active approval risk filter chips to `/admin/knowledge`.

## Scope

- Show the active risk group label.
- Show visible group count versus total group count.
- Update as filter shortcuts change.
- Keep chips read-only.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge active approval risk filter chips`.
2. Chips show active risk group.
3. Chips show visible/total group count.
4. Chips update when shortcut selection changes.
5. Chips reset when filter is cleared.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for active risk filter chips.

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
- 2026-05-13: Browser UI verification confirmed active risk filter chips update to `Risk group Structure` and `Showing 1/5`, then reset to all groups.
