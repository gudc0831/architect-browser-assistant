# Slice 107: Knowledge Draft Tag Preview

## Product Context

The draft tag input is comma-separated. Reviewers need a quick chip preview of the parsed tags before approval.

## Goal

Add a draft tag preview to `/admin/knowledge`.

## Scope

- Parse the edited tag input with the existing tag splitter.
- Show parsed draft tags as chips.
- Show an explicit empty state when no tags are present.
- Include duplicate markers when duplicate tags are detected.
- Keep the feature read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge draft tag preview`.
2. Preview derives from the current edited tag input.
3. Empty tag input shows `No draft tags`.
4. Duplicate values are visually marked.
5. Editing the tag input updates the preview.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for draft tag preview.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge draft tag preview` shows parsed tags and duplicate markers from the edited tag input.
