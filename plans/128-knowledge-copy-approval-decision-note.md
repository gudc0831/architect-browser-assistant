# Slice 128: Knowledge Copy Approval Decision Note

## Product Context

Admins need to hand off the final approval or rejection context after risk review without retyping candidate, task, scope, and evidence context.

## Goal

Add a `Copy decision note` action to `/admin/knowledge`.

## Scope

- Add `Copy decision note` beside existing copy actions.
- Copy candidate, task, project, state, scope, confidence, readiness, warning groups, and evidence context.
- Include draft rejection reason text when present.
- Keep the action client-side and read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy decision note`.
2. Copied text includes candidate and task context.
3. Copied text includes proposed decision context.
4. Copied text includes scope, confidence, readiness, warning group, and evidence counts.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for decision note copy output.

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
- 2026-05-13: Browser UI verification confirmed `Copy decision note` copies candidate, task, state, scope, confidence, readiness, warning group, evidence, and rejection-reason context.
