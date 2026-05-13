# Slice 113: Knowledge Scope Change Guardrail

## Product Context

Changing publication scope changes who can see approved knowledge. Approval guardrails should call out that audience change before approval.

## Goal

Add a publication scope change guardrail to `/admin/knowledge`.

## Scope

- Compare edited scope to the selected candidate's original draft scope.
- Add a warning guardrail when scope changed.
- Add a ready guardrail when scope is unchanged.
- Include original and current scope labels.
- Include the scope change guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions scope change state.
2. Warning appears when the edited scope differs from the original draft scope.
3. Ready state appears when scope is unchanged.
4. Guardrail updates when the scope select changes.
5. `Copy approval checklist` includes the scope change guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for scope changed and unchanged states.

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
- 2026-05-13: Browser UI verification confirmed `Publication scope unchanged` for original scope and `Publication scope changed` after switching to project scope.
