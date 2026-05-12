# Slice 86: Knowledge Evidence Source Filter

## Product Context

Evidence source coverage and guardrails identify sourced versus unsourced evidence. Reviewers need to focus the evidence list on those groups.

## Goal

Add evidence source filters to `/admin/knowledge`.

## Scope

- Add all, sourced, and unsourced evidence filters.
- Filter only the visible evidence list.
- Keep evidence coverage totals and approval guardrails based on the full selected candidate detail.
- Show an empty state when no evidence rows match the active source filter.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge evidence source filters`.
2. `Sourced` shows evidence rows with source URLs.
3. `Unsourced` shows evidence rows without source URLs.
4. `All evidence` restores the full evidence list.
5. Coverage and guardrails remain based on all selected evidence.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence source filters.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
