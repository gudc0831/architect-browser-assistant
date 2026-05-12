# Slice 82: Knowledge Evidence Priority Chips

## Product Context

The evidence priority rollup shows aggregate evidence weight. Reviewers also need row-level priority context while reading the evidence list.

## Goal

Add evidence priority chips to each evidence row in `/admin/knowledge`.

## Scope

- Show the priority tier on every evidence row.
- Show the raw priority number.
- Reuse the same priority tier helper as the rollup.
- Keep the evidence list read-only.

## Acceptance Criteria

1. Evidence rows show high, normal, or low priority tier.
2. Evidence rows show the source priority number.
3. Row chips use the same boundaries as `Knowledge evidence priority rollup`.
4. Existing kind, title, excerpt, and source link remain visible.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence priority chips.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
