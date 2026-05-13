# Slice 149: Knowledge Copy Final Review Closeout

## Product Context

The final reviewer needs a single closeout note that can be pasted into an audit thread or handoff before taking the approval/rejection action.

## Goal

Add `Copy final closeout` to Knowledge Admin.

## Scope

- Copy candidate, task, package quality, final status, next action, and checklist rows.
- Use deterministic Markdown text.
- Reuse current UI state.
- Do not persist closeout copies.

## Acceptance Criteria

1. A final closeout copy button is visible.
2. Clipboard text starts with `# Knowledge final review closeout`.
3. Clipboard text includes next action and checklist rows.
4. Status line confirms copy success.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser clipboard verification.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser clipboard verification clicked `Copy final closeout` and confirmed `# Knowledge final review closeout`, `## Package quality checks`, `## Final checklist`, and next action.
