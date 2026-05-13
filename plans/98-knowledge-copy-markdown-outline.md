# Slice 98: Knowledge Copy Markdown Outline

## Product Context

Markdown outline preview helps reviewers inspect structure on screen. Reviewers also need to copy that outline for handoff and review notes.

## Goal

Add a copy Markdown outline action to `/admin/knowledge`.

## Scope

- Add `Copy Markdown outline` in the WIKI draft editor.
- Include selected candidate and task context.
- Include heading count.
- Include heading level, line number, and text.
- Include an explicit empty-outline row when no headings exist.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy Markdown outline`.
2. Copied text includes candidate and task context.
3. Copied text includes heading count.
4. Copied text includes heading level, line number, and text.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy Markdown outline.

## Implementation Notes

- Status: implemented
- SaaS commit: `cce2357`
- Browser assistant planning commit: `9cb3f7b`

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: `GET /api/admin/knowledge/candidates` returned 200.
- 2026-05-13: Browser UI verification confirmed `Copy Markdown outline` is available in the draft editor.
