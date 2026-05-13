# Slice 135: Knowledge Approval Submit Blocker Count

## Product Context

Final approval actions should keep unresolved guardrail blockers visible at the point of submission.

## Goal

Show approval blocker count beside the final approval/rejection actions in `/admin/knowledge`.

## Scope

- Add approval submit guardrail chips near the action footer.
- Show active blocker count.
- Show warning group count.
- Keep the chips read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows approval submit guardrail chips.
2. The chips include active blocker count.
3. The chips include warning group count.
4. The chips update when draft state changes.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval submit blocker count.

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
- 2026-05-13: Browser UI verification confirmed final submit guardrail chips show blocker count and warning group count.
