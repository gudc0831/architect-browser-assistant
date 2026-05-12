# Slice 93: Knowledge Draft Dirty-State Indicators

## Product Context

Reviewers can edit WIKI draft fields before approving or rejecting a candidate. They need a clear read on which fields differ from the selected candidate draft before using reset or approval actions.

## Goal

Add draft dirty-state indicators to `/admin/knowledge`.

## Scope

- Compare current draft values against the selected candidate draft.
- Show changed/unchanged chips for title, summary, body, tags, scope, and rejection reason.
- Show changed field count.
- Keep indicators read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge draft dirty-state indicators`.
2. Indicators cover title, summary, body, tags, scope, and rejection reason.
3. Indicators show changed versus original state.
4. Indicators update while reviewers edit draft fields.
5. Changed count reflects the number of dirty fields.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for draft dirty-state indicators.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
