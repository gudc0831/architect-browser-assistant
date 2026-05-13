# Slice 106: Knowledge Tag Coverage Guardrail

## Product Context

Tags support retrieval, WIKI grouping, and reviewer triage. Approval guardrails should warn when a draft has too few tags to be useful after publication.

## Goal

Add a draft tag coverage guardrail to `/admin/knowledge`.

## Scope

- Reuse the edited draft tag input.
- Add a ready guardrail when at least two draft tags exist.
- Add a warning guardrail when fewer than two draft tags exist.
- Keep existing readiness behavior for missing tags.
- Include the tag coverage guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions tag coverage.
2. Ready state appears when two or more tags exist.
3. Warning appears when fewer than two tags exist.
4. Existing readiness chips continue to report whether tags are present.
5. `Copy approval checklist` includes the tag coverage guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for tag coverage ready and warning states.

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
- 2026-05-13: Browser UI verification confirmed `Tag coverage limited` for one tag and `Tag coverage ready` for two or more tags.
