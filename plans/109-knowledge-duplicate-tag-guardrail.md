# Slice 109: Knowledge Duplicate Tag Guardrail

## Product Context

Duplicate tags add noise to retrieval and WIKI grouping. Approval guardrails should warn when duplicate draft tags exist.

## Goal

Add a duplicate draft tag guardrail to `/admin/knowledge`.

## Scope

- Detect duplicate tags case-insensitively.
- Add a warning guardrail when duplicates exist.
- Add a ready guardrail when tags exist and are unique.
- Include the duplicate tag guardrail in `Copy approval checklist`.
- Keep detection client-side.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions duplicate tag state.
2. Warning appears when duplicate tags exist.
3. Ready state appears when draft tags exist and are unique.
4. Empty tag state continues to rely on readiness and coverage warnings.
5. `Copy approval checklist` includes the duplicate tag guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for duplicate tag warning and unique-tag ready states.

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
- 2026-05-13: Browser UI verification confirmed `Duplicate draft tags` for case-insensitive duplicates and `Draft tags unique` for unique tags.
