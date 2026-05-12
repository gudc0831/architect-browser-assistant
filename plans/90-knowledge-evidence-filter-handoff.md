# Slice 90: Knowledge Evidence Filter Handoff

## Product Context

Evidence filtering is now combinable by source and priority. Reviewers need a copyable handoff that preserves the exact evidence review scope.

## Goal

Add evidence filter handoff copying to `/admin/knowledge`.

## Scope

- Add `Copy evidence filter handoff`.
- Include selected candidate and task context.
- Include active source and priority filters.
- Include visible evidence count against total evidence count.
- Include visible evidence titles, kinds, and priority tiers.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy evidence filter handoff`.
2. Copied text includes selected candidate and task context.
3. Copied text includes source and priority filters.
4. Copied text includes visible evidence count and visible evidence rows.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence filter handoff.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
