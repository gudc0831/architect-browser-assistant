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

- SaaS commit: pending
- Browser assistant planning commit: pending
