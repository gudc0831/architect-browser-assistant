# Slice 119: Knowledge Approval Risk Filter Shortcuts

## Product Context

Grouped approval risks make warning categories visible. Reviewers also need shortcuts to focus on one category at a time.

## Goal

Add approval risk filter shortcuts to `/admin/knowledge`.

## Scope

- Add shortcut buttons for all, scope, metadata, structure, evidence, and state risk groups.
- Filter the risk group detail panel by the selected shortcut.
- Keep the full risk summary chips visible.
- Keep filtering client-side and read-only.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge approval risk filter shortcuts`.
2. `All risk groups` shows every risk group detail card.
3. Selecting a category shows only that category's detail card.
4. Full risk summary chips remain visible.
5. Filtering does not change approval guardrails.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for risk filter shortcuts.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: `GET /api/admin/knowledge/candidates` returned 200.
- 2026-05-13: Browser UI verification confirmed selecting `Structure` filters the risk group detail panel to one group while summary chips remain visible.
