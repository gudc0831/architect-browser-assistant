# Slice 147: Knowledge Final Review Closeout Summary

## Product Context

After package quality checks, Knowledge Admin needs a final closeout view that summarizes whether approval, rejection, or further revision is the most appropriate next action.

## Goal

Show final review closeout summary chips.

## Scope

- Add final closeout ready/missing counts.
- Include closeout status in the final action area.
- Summarize the current next action.
- Keep existing approval and rejection actions unchanged.

## Acceptance Criteria

1. Final closeout chips are visible near approval/rejection actions.
2. Chips include ready count and status.
3. Chips include a next-action label.
4. Chips update when guardrail or rejection reason state changes.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser UI verification for closeout chips.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser UI verification confirmed final closeout summary chips and checklist cards on desktop and mobile.
