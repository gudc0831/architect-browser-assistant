# Slice 102: Knowledge Copy Markdown Structure Summary

## Product Context

Markdown structure summary shows heading, paragraph, list-item, and line counts on screen. Reviewers also need to copy those counts into review handoffs.

## Goal

Add a copy Markdown structure summary action to `/admin/knowledge`.

## Scope

- Add `Copy Markdown structure` in the WIKI draft editor.
- Include selected candidate and task context.
- Include heading, paragraph, list-item, and non-empty line counts.
- Keep the action client-side and read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy Markdown structure`.
2. Copied text includes candidate and task context.
3. Copied text includes heading count.
4. Copied text includes paragraph and list-item counts.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy Markdown structure.

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
- 2026-05-13: Browser UI verification confirmed `Copy Markdown structure` exists and copied heading, paragraph, list-item, and line counts with candidate/task context.
