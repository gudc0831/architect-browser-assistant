# Slice 79: Knowledge Candidate Risk Totals

## Product Context

Risk quick filters help reviewers focus the queue, but reviewers should see the size of each risk group before applying filters.

## Goal

Add candidate risk totals to `/admin/knowledge`.

## Scope

- Show low-confidence candidate count.
- Show unreviewed candidate count.
- Show cleanup-approved candidate count.
- Keep totals read-only and based on the loaded queue.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate risk totals`.
2. Totals include low confidence, unreviewed, and cleanup approved counts.
3. Totals update when the loaded candidate queue refreshes.
4. Existing filters remain unchanged by the read-only totals.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for risk totals.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
