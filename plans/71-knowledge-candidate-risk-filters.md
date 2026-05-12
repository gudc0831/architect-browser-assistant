# Slice 71: Knowledge Candidate Risk Filters

## Product Context

The Admin WIKI candidate queue already exposes state filters, search, and row-level risk chips. Reviewers still need a queue-level way to focus the riskiest candidates without reading every row.

## Goal

Add candidate risk quick filters to `/admin/knowledge` so admins can focus low-confidence, unreviewed, or cleanup-approved candidates from the loaded queue.

## Scope

- Add a queue-level risk filter group independent from state filter and search.
- Support `All risk`, `Low confidence`, `Unreviewed`, and `Cleanup approved`.
- Keep the feature read-only and client-side; no API schema changes.
- Update user guide and worklogs.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate risk quick filters`.
2. `Low confidence` filters candidates below 60 percent confidence.
3. `Unreviewed` filters candidates without `reviewedAt`.
4. `Cleanup approved` filters candidates with approved cleanup state.
5. Existing state filter and search continue to combine with the new risk filter.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for `/admin/knowledge` risk quick filters.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
