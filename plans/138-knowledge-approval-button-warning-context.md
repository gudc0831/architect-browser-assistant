# Slice 138: Knowledge Approval Button Warning Context

## Product Context

The approval button should carry enough local context for admins to understand whether they are approving with unresolved warnings.

## Goal

Add warning-count context to the final WIKI approval button.

## Scope

- Add tooltip text to the approval button.
- Include active warning count when warnings remain.
- Include no-warning text when clear.
- Keep the button behavior unchanged.

## Acceptance Criteria

1. Approval button keeps existing behavior.
2. Approval button context names active warning count.
3. Approval button context names no-warning state when clear.
4. The context aligns with the submit guardrail chips.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval button warning context.

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
- 2026-05-13: Browser UI verification confirmed the final WIKI approval button carries active warning-count context; `/api/project/changes` returned the known unrelated 500 during page load.
