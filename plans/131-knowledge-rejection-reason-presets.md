# Slice 131: Knowledge Rejection Reason Presets

## Product Context

When guardrails block approval, admins should not have to rewrite the same blocker context into the rejection reason field.

## Goal

Show rejection reason preset buttons based on active approval guardrail warnings.

## Scope

- Build preset labels from active warning guardrails.
- Show presets near the rejection reason input.
- Provide a manual-review preset when there are no active warnings.
- Keep presets client-side and reversible before submit.

## Acceptance Criteria

1. `/admin/knowledge` shows rejection reason presets.
2. Presets reflect active warning guardrail labels.
3. A no-warning preset is available when no warning exists.
4. Presets do not submit rejection automatically.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for rejection reason preset visibility.

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
- 2026-05-13: Browser UI verification confirmed warning-derived rejection reason presets appear on desktop and mobile.
