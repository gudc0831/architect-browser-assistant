# Slice 73: Knowledge Clear Candidate Filters

## Product Context

Candidate queue filtering now includes state, risk, and search. Reviewers need a quick way to return to the default candidate review scope after narrowing the queue.

## Goal

Add a clear candidate filters action to `/admin/knowledge`.

## Scope

- Add a button near active filter chips.
- Reset state to `candidate`.
- Reset risk to `All risk`.
- Clear candidate search.
- Disable the action when the queue is already in the default filter state.

## Acceptance Criteria

1. `/admin/knowledge` shows `Clear candidate filters`.
2. The action is disabled when state/risk/search are already default.
3. The action resets state, risk, and search together.
4. Active filter chips update after clearing.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for clear candidate filters.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
