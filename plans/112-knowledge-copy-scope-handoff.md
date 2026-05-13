# Slice 112: Knowledge Copy Scope Handoff

## Product Context

Publication scope decisions often need reviewer handoff before approval, especially when a draft moves from project-limited knowledge to organization-wide knowledge.

## Goal

Add a copy publication scope handoff action to `/admin/knowledge`.

## Scope

- Add `Copy scope handoff` in the WIKI draft editor.
- Include selected candidate and task context.
- Include current and original scope.
- Include whether scope changed.
- Include the scope review note.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy scope handoff`.
2. Copied text includes candidate and task context.
3. Copied text includes current and original scope.
4. Copied text includes scope changed state.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy scope handoff.

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
- 2026-05-13: Browser UI verification confirmed `Copy scope handoff` copies candidate, task, current/original scope, changed state, and scope review note.
