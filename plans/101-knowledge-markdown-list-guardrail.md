# Slice 101: Knowledge Markdown List Guardrail

## Product Context

Markdown structure summary exposes list-item counts. Approval guardrails should also flag drafts that have body content but no list structure, because action and context extraction often depends on bullet or numbered lists.

## Goal

Add a Markdown list-structure guardrail to `/admin/knowledge`.

## Scope

- Reuse the current Markdown structure summary.
- Add a ready guardrail when Markdown list items exist.
- Add a warning guardrail when the body has content but no Markdown list items.
- Avoid duplicate warnings when the body is empty and the existing readiness guardrail already covers the missing body.
- Include the list guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions Markdown list coverage.
2. Ready state appears when list items exist.
3. Warning appears when a non-empty body has no list items.
4. Empty body continues to rely on the existing readiness warning.
5. `Copy approval checklist` includes the list guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for Markdown list guardrail ready and warning states.

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
- 2026-05-13: Browser UI verification confirmed `Markdown list structure missing` for a non-empty body with no list items.
- 2026-05-13: Browser UI verification confirmed `Markdown list structure present` for a body with a bullet item and confirmed `Copy approval checklist` includes the list guardrail.
