# Slice 81: Knowledge Evidence Priority Rollup

## Product Context

The Admin WIKI draft already shows evidence kind rollups. Approval reviewers also need a quick read on how much of the supporting evidence is high-priority versus secondary.

## Goal

Add an evidence priority rollup to `/admin/knowledge`.

## Scope

- Derive priority tiers from evidence priority values.
- Use lower priority numbers as stronger evidence priority, matching existing evidence sort semantics.
- Show high, normal, and low priority evidence counts.
- Keep the rollup read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge evidence priority rollup`.
2. Priority values 1-3 count as high priority.
3. Priority values 4-5 count as normal priority.
4. Priority values 6+ count as low priority.
5. Empty evidence shows an empty priority state.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence priority rollup.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
