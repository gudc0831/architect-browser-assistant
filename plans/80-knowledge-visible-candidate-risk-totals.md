# Slice 80: Knowledge Visible Candidate Risk Totals

## Product Context

Overall risk totals show the queue baseline. Reviewers also need to know how much risk remains inside the current filtered result set.

## Goal

Add visible candidate risk totals to `/admin/knowledge`.

## Scope

- Show visible low-confidence count.
- Show visible unreviewed count.
- Show visible cleanup-approved count.
- Show visible candidate count.
- Keep totals derived from current filtered and sorted queue state.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge visible candidate risk totals`.
2. Visible totals update with state filters.
3. Visible totals update with risk filters.
4. Visible totals update with search.
5. Existing overall risk totals remain available.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for visible risk totals.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
