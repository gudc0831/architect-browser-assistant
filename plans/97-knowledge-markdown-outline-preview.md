# Slice 97: Knowledge Markdown Outline Preview

## Product Context

Reviewers can edit the WIKI draft Markdown body and preview raw Markdown. Before approval, they need a quick read on the heading structure.

## Goal

Add a Markdown outline preview to `/admin/knowledge`.

## Scope

- Parse Markdown heading lines from the current draft body.
- Show heading level, source line, and heading text.
- Limit the preview to the first 12 headings to keep the editor compact.
- Keep the feature read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge Markdown outline preview`.
2. Outline derives from the current draft Markdown body.
3. Outline shows heading level and line number.
4. Empty bodies or bodies without headings show an empty outline state.
5. Editing Markdown updates the outline.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for Markdown outline preview.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
