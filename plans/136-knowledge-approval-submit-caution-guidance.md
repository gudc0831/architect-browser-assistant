# Slice 136: Knowledge Approval Submit Caution Guidance

## Product Context

Admins need clear final-action guidance when approval is possible but warnings still need review or explicit acceptance.

## Goal

Show approval submit caution guidance in `/admin/knowledge`.

## Scope

- Show `Resolve before approval` when blockers remain.
- Show `Ready to approve` when no blockers remain.
- Add approval button tooltip context for the active warning count.
- Do not change the approval API behavior.

## Acceptance Criteria

1. The final action area shows caution text when blockers remain.
2. The final action area shows ready text when no blockers remain.
3. The approval button exposes warning-count context.
4. Existing approval and rejection flows remain unchanged.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for submit caution guidance.

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
- 2026-05-13: Browser UI verification confirmed final submit guidance shows `Resolve before approval` when blockers remain.
