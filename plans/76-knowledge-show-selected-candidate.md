# Slice 76: Knowledge Show Selected Candidate

## Product Context

The selected candidate detail can remain open while filters hide that candidate from the queue. Reviewers need a direct way to bring the selected item back into the visible queue.

## Goal

Add a `Show selected candidate` action when the selected candidate is outside active filters.

## Scope

- Show the action only when selected candidate is hidden by current filters.
- Reset risk and search filters.
- Set state filter to the selected candidate state when supported by queue quick filters.
- Fall back to `all` state for less common candidate states.
- Reset sort to newest first for a predictable reveal.

## Acceptance Criteria

1. Selection summary shows `Show selected candidate` only when selected candidate is outside filters.
2. The action reveals candidate, approved, and rejected selected records through matching state filters.
3. The action reveals pending or excluded records through the all-state filter.
4. Risk filter, search, and sort return to reveal-safe defaults.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for the out-of-filter action.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
