# Slice 124: Knowledge Approval Risk Warning Item Preview

## Product Context

The grouped risk cards show category counts, but reviewers still need to know which exact guardrails are blocking approval before opening the full guardrail list.

## Goal

Show warning item labels inside each approval risk group card on `/admin/knowledge`.

## Scope

- List warning guardrail labels in the relevant risk group card.
- Preserve the existing warning styling for affected cards.
- Keep the full guardrail detail list as the detailed source below the group summary.
- Do not change approval or rejection behavior.

## Acceptance Criteria

1. Risk group cards with warnings list the warning item labels.
2. Risk group cards without warnings do not show an empty warning list.
3. The warning preview follows the active risk filter.
4. The full approval guardrail list remains available.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for warning item previews.

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
- 2026-05-13: Browser UI verification confirmed the Structure and Evidence risk cards list warning item labels.
