# Slice 91: Knowledge Visible Evidence Summary

## Product Context

Evidence source and priority filters can narrow the evidence list. Reviewers need source and priority counts for the currently visible evidence rows, not just the full selected candidate.

## Goal

Add a visible evidence summary to `/admin/knowledge`.

## Scope

- Count sourced and unsourced visible evidence rows.
- Count high, normal, and low priority visible evidence rows.
- Update counts as source and priority filters change.
- Keep the summary read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge visible evidence summary`.
2. Summary shows visible sourced and unsourced counts.
3. Summary shows visible high, normal, and low priority counts.
4. Summary updates when source filters change.
5. Summary updates when priority filters change.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for visible evidence summary.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
