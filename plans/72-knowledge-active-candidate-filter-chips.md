# Slice 72: Knowledge Active Candidate Filter Chips

## Product Context

Admin WIKI reviewers can now combine state filters, risk filters, and search. The combined scope needs to be visible so reviewers understand which candidate queue they are acting on.

## Goal

Show active candidate filter chips in `/admin/knowledge` for state, risk, search, and visible result count.

## Scope

- Add read-only active filter chips below candidate quick filters.
- Include state, risk, search, and showing count.
- Keep the chips derived from existing client-side filter state.
- Update user guide and worklogs.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate active filter chips`.
2. Chips update when state quick filters change.
3. Chips update when risk quick filters change.
4. Chips show search text or `Search: none`.
5. Chips include visible candidate count against total loaded candidates.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for active filter chips.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
