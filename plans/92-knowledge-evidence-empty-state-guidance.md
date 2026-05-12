# Slice 92: Knowledge Evidence Empty-State Guidance

## Product Context

Evidence source and priority filters can combine to hide every evidence row. Reviewers need to understand why the list is empty and how to recover.

## Goal

Improve the evidence empty state in `/admin/knowledge`.

## Scope

- Name the active source filter in the empty state.
- Name the active priority filter in the empty state.
- Suggest clearing evidence filters to restore rows.
- Keep behavior read-only and client-side.

## Acceptance Criteria

1. Empty evidence state includes the active source filter label.
2. Empty evidence state includes the active priority filter label.
3. Empty evidence state suggests clearing filters.
4. Empty state continues to appear only when no visible evidence rows match.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence empty-state guidance.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
