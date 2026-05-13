# Slice 129: Knowledge Decision Note Blocker Details

## Product Context

A decision handoff that says "blocked" is not enough. The copied decision note should name the guardrail warnings that need resolution or explicit acceptance.

## Goal

Include blocking warning details in the copied approval decision note.

## Scope

- Add a `Blocking warnings` section to the copied note.
- List warning labels and detail text.
- Include a no-warning line when the candidate is approve-ready.
- Keep warning source-of-truth in existing guardrails.

## Acceptance Criteria

1. Copied decision notes include a `Blocking warnings` section.
2. Warning candidates list warning labels and details.
3. Approve-ready candidates show a no-blocker line.
4. The section reflects the current edited draft state.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copied blocker warning details.

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
- 2026-05-13: Browser UI verification confirmed copied decision notes include the `Blocking warnings` section with active guardrail warning details.
