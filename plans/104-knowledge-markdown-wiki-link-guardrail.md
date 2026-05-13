# Slice 104: Knowledge Markdown WIKI Link Guardrail

## Product Context

WIKI link preview shows link structure. Approval guardrails should also warn reviewers when a draft has body content but no WIKI links to related knowledge.

## Goal

Add a Markdown WIKI link guardrail to `/admin/knowledge`.

## Scope

- Add a ready guardrail when Markdown WIKI links exist.
- Add a warning guardrail when the body has content but no `[[WIKI links]]`.
- Avoid duplicate warnings when the body is empty and existing readiness already covers the missing body.
- Include the WIKI link guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions WIKI link coverage.
2. Ready state appears when WIKI links exist.
3. Warning appears when a non-empty body has no WIKI links.
4. Empty body continues to rely on the existing readiness warning.
5. `Copy approval checklist` includes the WIKI link guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for WIKI link ready and warning states.

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
- 2026-05-13: Browser UI verification confirmed `Markdown WIKI links missing` for a non-empty body with no WIKI links and `Markdown WIKI links present` after adding a `[[Core Circulation|circulation rules]]` link.
