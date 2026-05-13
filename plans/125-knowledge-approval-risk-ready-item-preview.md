# Slice 125: Knowledge Approval Risk Ready Item Preview

## Product Context

Risk review is faster when reviewers can see which checks already passed in the same grouped context as warnings.

## Goal

Show ready item labels inside each approval risk group card on `/admin/knowledge`.

## Scope

- Add a compact ready-note preview to each risk group card.
- Limit the preview to the first few ready labels to keep the panel dense.
- Preserve warning counts and warning item previews.
- Keep the preview read-only.

## Acceptance Criteria

1. Risk group cards with ready notes show a compact ready preview.
2. The ready preview follows the active risk filter.
3. The preview does not expand the card into a separate nested card.
4. Warning and empty-state behavior remain intact.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for ready item previews.

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
- 2026-05-13: Browser UI verification confirmed risk cards show compact ready-note labels beside warning/empty-state context.
