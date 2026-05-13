# Slice 117: Knowledge Copy Approval Risk Summary

## Product Context

Reviewers need to share warning categories with other admins without copying the full approval checklist.

## Goal

Add a copy approval risk summary action to `/admin/knowledge`.

## Scope

- Add `Copy risk summary` in the WIKI draft editor.
- Include selected candidate and task context.
- Include warning group totals.
- Include warning and ready counts by group.
- Include warning details under each group.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy risk summary`.
2. Copied text includes candidate and task context.
3. Copied text includes warning group totals.
4. Copied text includes risk group warning counts.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy approval risk summary.

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
- 2026-05-13: Browser UI verification confirmed `Copy risk summary` copies candidate, task, warning groups, per-group counts, and warning details.
