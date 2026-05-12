# Slice 88: Knowledge Active Evidence Filter Chips

## Product Context

Evidence rows can now be filtered by source coverage and priority tier. Reviewers need a compact summary of the combined evidence scope before making approval decisions.

## Goal

Add active evidence filter chips to `/admin/knowledge`.

## Scope

- Show source filter scope.
- Show priority filter scope.
- Show visible evidence count against total selected evidence count.
- Keep chips read-only and derived from current evidence filter state.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge active evidence filter chips`.
2. Chips show the active source filter.
3. Chips show the active priority filter.
4. Chips show visible evidence count against total evidence count.
5. Chips update when source or priority filters change.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for active evidence filter chips.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
