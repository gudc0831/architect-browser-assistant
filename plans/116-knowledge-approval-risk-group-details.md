# Slice 116: Knowledge Approval Risk Group Details

## Product Context

Risk summary chips are compact. Reviewers also need a small detail panel showing ready and warning counts by category.

## Goal

Add approval risk group details to `/admin/knowledge`.

## Scope

- Add `Knowledge approval risk groups` below the guardrail summary chips.
- Show category label.
- Show warning and ready-note counts.
- Use warning styling when a category has warnings.
- Keep the detail panel read-only.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge approval risk groups`.
2. Each risk group shows warning count.
3. Each risk group shows ready-note count.
4. Groups with warnings use warning styling.
5. Groups without warnings use ready styling.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval risk groups.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge approval risk groups` shows warning and ready-note counts for each group.
