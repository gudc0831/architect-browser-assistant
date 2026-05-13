# Slice 148: Knowledge Final Review Next Action

## Product Context

Admins need explicit next-action language when a candidate still has blockers, missing quality checks, or a ready approval state.

## Goal

Compute and display final review next-action guidance.

## Scope

- Derive next action from package quality, guardrails, and rejection reason state.
- Surface guidance as a closeout item.
- Include guidance in closeout status chips.
- Keep guidance advisory only.

## Acceptance Criteria

1. Next action changes for missing package quality.
2. Next action changes when warnings remain without a rejection reason.
3. Next action names approval-ready state when no warnings remain.
4. Next action is included in final closeout copy.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser UI and clipboard verification.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser UI verification confirmed next-action guidance appears in final closeout chips and checklist.
