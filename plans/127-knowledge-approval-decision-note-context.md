# Slice 127: Knowledge Approval Decision Note Context

## Product Context

After reviewing grouped approval risks, admins need a compact signal that says whether the current candidate is approve-ready or still blocked.

## Goal

Show approval decision note context chips in `/admin/knowledge`.

## Scope

- Add decision-note mode chips near guardrail and risk summary chips.
- Show blocker-review versus approve-ready state.
- Include scope and review status context.
- Keep the chips read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows approval decision note context chips.
2. The chips distinguish blocker-review from approve-ready context.
3. The chips include publication scope.
4. The chips include the current review status label.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for decision note context chips.

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
- 2026-05-13: Browser UI verification confirmed decision note context chips show blocker-review, warning count, scope, and review status on desktop and mobile.
