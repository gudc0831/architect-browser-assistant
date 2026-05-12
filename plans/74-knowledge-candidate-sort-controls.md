# Slice 74: Knowledge Candidate Sort Controls

## Product Context

The candidate queue can now be narrowed by state, risk, and search. Reviewers also need predictable ordering for the narrowed queue.

## Goal

Add candidate sort controls to `/admin/knowledge`.

## Scope

- Add a `Sort candidates` control.
- Support `Newest first`.
- Support `Low confidence first`.
- Show the active sort in active filter chips.
- Keep sorting client-side against the loaded queue.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate sort`.
2. `Newest first` orders by most recently updated candidate.
3. `Low confidence first` orders by ascending confidence score, with newest as tie-breaker.
4. Active filter chips include the selected sort.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for sort control and sort chip.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
