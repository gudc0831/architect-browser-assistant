# Slice 146: Knowledge Package Quality Missing Guidance

## Product Context

Quality reports should not only say something is missing; they should guide the reviewer toward the next corrective action.

## Goal

Add missing-section guidance to package quality checks.

## Scope

- Include missing package quality count.
- Show guidance for draft, decision, blocker, evidence, and source coverage warnings.
- Keep guidance aligned with existing approval guardrails.
- Keep guidance read-only.

## Acceptance Criteria

1. Missing count is visible in quality chips.
2. Warning rows explain what the reviewer should inspect.
3. Ready rows explain what is already covered.
4. Quality guidance is included in the copied quality report.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser UI and clipboard verification.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser UI and clipboard verification confirmed missing quality count and warning guidance for decision/source coverage.
