# Slice 87: Knowledge Evidence Priority Filter

## Product Context

Evidence source filters let reviewers focus sourced or unsourced evidence rows. Reviewers also need to focus evidence by priority tier while keeping source filters active.

## Goal

Add evidence priority filters to `/admin/knowledge`.

## Scope

- Add all, high, normal, and low priority filters.
- Combine priority filtering with the existing source filter.
- Reuse the same priority boundaries as evidence priority rollup and row chips.
- Keep coverage totals and guardrails based on all selected evidence.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge evidence priority filters`.
2. High priority shows evidence with priority 1-3.
3. Normal priority shows evidence with priority 4-5.
4. Low priority shows evidence with priority 6+.
5. Priority filtering combines with source filtering.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence priority filters.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
