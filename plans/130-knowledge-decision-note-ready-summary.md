# Slice 130: Knowledge Decision Note Ready Summary

## Product Context

Decision handoff should also preserve what passed review so another admin can see the positive basis for approval or remaining review.

## Goal

Include ready checks and risk group summary in the copied approval decision note.

## Scope

- Add a `Ready checks` section to copied decision notes.
- Add a compact `Risk groups` summary section.
- Include evidence kind counts in the decision context.
- Keep the note concise enough for handoff.

## Acceptance Criteria

1. Copied decision notes include ready check labels and details.
2. Copied decision notes include per-risk-group warning and ready counts.
3. Evidence kind counts are included.
4. The note remains Markdown text suitable for chat or ticket handoff.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copied ready summary content.

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
- 2026-05-13: Browser UI verification confirmed copied decision notes include all ready checks, evidence-ready detail, and per-risk-group warning/ready counts; `/api/project/changes` returned the known unrelated 500 during page load.
