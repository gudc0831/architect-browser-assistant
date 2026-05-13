# Slice 114: Knowledge Queue Layout Stability

## Product Context

Browser UI verification for the Knowledge Admin scope review tools exposed a queue layout issue where the first candidate counter row could stretch vertically instead of staying compact.

## Goal

Stabilize the `/admin/knowledge` candidate queue layout.

## Scope

- Replace the queue container's two-row grid behavior with a vertical flex layout.
- Keep queue header, filter controls, and candidate list in the same visual order.
- Let the candidate list consume remaining height and scroll.
- Keep candidate counter rows compact.
- Preserve mobile stacking behavior.

## Acceptance Criteria

1. Candidate state count chips stay compact on desktop.
2. Candidate risk count chips stay compact on desktop.
3. Candidate list remains scrollable.
4. Scope review tools still render after the layout change.
5. Mobile layout remains single-column and usable.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser UI verification for desktop and mobile Knowledge Admin queue layout.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser UI verification confirmed candidate state/risk count chips stay compact at 31px height and mobile remains single-column.
