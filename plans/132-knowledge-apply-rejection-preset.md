# Slice 132: Knowledge Apply Rejection Preset

## Product Context

Preset buttons only help if they fill the rejection reason draft with a complete, actionable blocker sentence.

## Goal

Apply a selected rejection reason preset to the rejection reason draft.

## Scope

- Clicking a preset writes a blocker-specific rejection reason.
- The reason includes the guardrail label and detail.
- Status text confirms the preset was applied.
- Existing approval/rejection API behavior is unchanged.

## Acceptance Criteria

1. Clicking a preset fills the rejection reason input.
2. The filled reason names the blocker.
3. The filled reason includes the blocker detail.
4. The status line confirms preset application.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for applying a rejection preset.

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
- 2026-05-13: Browser UI verification confirmed selecting `Markdown WIKI links missing` fills the rejection reason with blocker label and detail.
