# Slice 105: Knowledge Copy WIKI Link Handoff

## Product Context

Reviewers may need to hand off WIKI link targets for curation before approval. A copy action should preserve candidate and task context with the parsed link list.

## Goal

Add a copy WIKI link handoff action to `/admin/knowledge`.

## Scope

- Add `Copy WIKI links` in the WIKI draft editor.
- Include selected candidate and task context.
- Include WIKI link count.
- Include line number, target, and optional alias label.
- Include an explicit empty-link row when no WIKI links exist.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy WIKI links`.
2. Copied text includes candidate and task context.
3. Copied text includes WIKI link count.
4. Copied text includes line number and WIKI target.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy WIKI links.

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
- 2026-05-13: Browser UI verification confirmed `Copy WIKI links` copies candidate, task, link count, source line, target, and alias label.
