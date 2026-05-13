# Slice 103: Knowledge Markdown WIKI Link Preview

## Product Context

The product direction keeps approved knowledge as structured Markdown WIKI content. Reviewers need to see whether a draft links to related WIKI pages before approval.

## Goal

Add a Markdown WIKI link preview to `/admin/knowledge`.

## Scope

- Parse `[[WIKI link]]` and `[[target|label]]` references from the current draft body.
- Show link source line and target.
- Limit the preview to the first 12 links.
- Show an explicit empty state when no WIKI links are present.
- Keep the feature read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge Markdown WIKI link preview`.
2. Preview derives from the current draft Markdown body.
3. Preview shows line number and WIKI target.
4. Empty bodies or bodies without links show an empty link state.
5. Editing Markdown updates the link preview.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for WIKI link preview.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge Markdown WIKI link preview` updates to `L3: [[Core Circulation]]` after editing the draft body.
