# Slice 111: Knowledge Publication Scope Preview

## Product Context

The scope select is a key governance control. Reviewers need a concise preview of the current scope and whether it changed from the selected candidate draft.

## Goal

Add a publication scope preview to `/admin/knowledge`.

## Scope

- Show the current edited publication scope.
- Show a scope risk label.
- Show whether scope changed from the original draft.
- Keep the preview read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge publication scope preview`.
2. Preview shows the current scope label.
3. Preview marks broad organization-wide scope.
4. Preview marks restricted/admin-only scope.
5. Preview updates when the scope select changes.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for publication scope preview.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge publication scope preview` updates from organization-wide unchanged scope to restricted changed scope.
