# Slice 122: Knowledge Copy Risk Filter Handoff

## Product Context

Reviewers may hand off only one risk category to another admin. The active filter should be copyable with candidate and task context.

## Goal

Add a copy approval risk filter handoff action to `/admin/knowledge`.

## Scope

- Add `Copy risk filter` beside risk filter shortcuts.
- Include selected candidate and task context.
- Include active risk group.
- Include visible/total group count.
- Include visible group warning and ready counts.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy risk filter`.
2. Copied text includes candidate and task context.
3. Copied text includes active risk group.
4. Copied text includes visible/total group count.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy risk filter handoff.

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
- 2026-05-13: Browser UI verification confirmed `Copy risk filter` copies candidate, task, active group `Evidence`, visible count `1/5`, and visible group counts.
