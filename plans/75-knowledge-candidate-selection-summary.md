# Slice 75: Knowledge Candidate Selection Summary

## Product Context

The Admin WIKI queue can now be filtered and sorted. A selected candidate can remain open even when the current filters no longer include it, so reviewers need clear selection context.

## Goal

Show a selected candidate summary in `/admin/knowledge`.

## Scope

- Add a read-only selected candidate summary near queue controls.
- Show the selected candidate position within the current visible queue.
- Show when the selected candidate is outside the active filters.
- Keep the detail panel behavior unchanged.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate selection summary`.
2. Summary shows selected candidate title.
3. Summary shows selected position when the candidate is in the visible queue.
4. Summary shows `Selected outside filters` when filters hide the selected candidate.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for selection summary.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
