# Slice 89: Knowledge Clear Evidence Filters

## Product Context

Evidence source and priority filters can be combined. Reviewers need a quick way to return to the full evidence list.

## Goal

Add a clear evidence filters action to `/admin/knowledge`.

## Scope

- Add `Clear evidence filters` in the evidence panel.
- Reset source filter to all evidence.
- Reset priority filter to all priorities.
- Disable the action when both evidence filters are already default.
- Keep coverage totals and guardrails unchanged.

## Acceptance Criteria

1. `/admin/knowledge` shows `Clear evidence filters`.
2. The action is disabled when source and priority filters are default.
3. The action resets source and priority filters together.
4. Active evidence filter chips update after clearing.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for clear evidence filters.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
