# Slice 110: Knowledge Scope Review Guardrail

## Product Context

Knowledge publication scope controls who can see approved WIKI content. Organization-wide scope is useful but broad, so reviewers should explicitly confirm it before approval.

## Goal

Add a publication scope review guardrail to `/admin/knowledge`.

## Scope

- Read the edited draft publication scope.
- Add a warning guardrail for organization-wide scope.
- Add a ready guardrail for restricted scopes.
- Keep scope review client-side and read-only.
- Include the scope review guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions publication scope.
2. Warning appears when scope is organization-wide.
3. Ready state appears when scope is restricted.
4. Scope review updates when the scope select changes.
5. `Copy approval checklist` includes the scope review guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for organization and restricted scope guardrails.

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
- 2026-05-13: Browser UI verification confirmed `Organization scope review` for organization scope and `Restricted scope selected` for project scope.
