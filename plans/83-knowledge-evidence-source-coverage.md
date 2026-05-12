# Slice 83: Knowledge Evidence Source Coverage

## Product Context

Admin WIKI approval depends on traceable evidence. Reviewers need a quick summary of how many evidence rows include source URLs.

## Goal

Add evidence source coverage chips to `/admin/knowledge`.

## Scope

- Count evidence rows with source URLs.
- Count evidence rows without source URLs.
- Show total evidence count beside coverage counts.
- Keep coverage read-only and based on selected candidate detail.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge evidence source coverage`.
2. Coverage shows sourced evidence count.
3. Coverage shows unsourced evidence count.
4. Coverage shows total evidence count.
5. Coverage updates when selected candidate changes.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for evidence source coverage.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
