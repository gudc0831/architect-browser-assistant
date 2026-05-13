# Slice 108: Knowledge Copy Draft Tag Handoff

## Product Context

Reviewers may need to hand off draft tags to taxonomy or WIKI curators before approval.

## Goal

Add a copy draft tag handoff action to `/admin/knowledge`.

## Scope

- Add `Copy draft tags` in the WIKI draft editor.
- Include selected candidate and task context.
- Include tag count and tag rows.
- Include duplicate tag summary.
- Include an explicit empty-tag row when no tags exist.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy draft tags`.
2. Copied text includes candidate and task context.
3. Copied text includes tag count.
4. Copied text includes duplicate tag summary.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy draft tags.

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
- 2026-05-13: Browser UI verification confirmed `Copy draft tags` copies candidate, task, tag count, duplicate summary, and tag rows.
