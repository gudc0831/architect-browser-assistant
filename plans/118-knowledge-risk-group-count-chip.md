# Slice 118: Knowledge Risk Group Count Chip

## Product Context

The existing guardrail summary showed raw warning count only. Reviewers also need to know how many risk categories are affected.

## Goal

Add a risk group count chip to `/admin/knowledge`.

## Scope

- Add `Risk groups X/Y` to the guardrail summary chips.
- Count only groups with warnings in the numerator.
- Keep total group count stable.
- Update as guardrails change.

## Acceptance Criteria

1. `Knowledge guardrail summary` shows risk group count.
2. Count numerator tracks groups with warnings.
3. Count denominator tracks total groups.
4. Count updates when draft changes alter guardrails.
5. Existing warning/readiness/confidence chips remain visible.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for risk group count chip.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge guardrail summary` shows `Risk groups 4/5` beside warning, readiness, and confidence chips.
