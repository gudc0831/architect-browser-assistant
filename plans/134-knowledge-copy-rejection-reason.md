# Slice 134: Knowledge Copy Rejection Reason

## Product Context

Reviewers sometimes need to share the final rejection reason before submitting the actual rejection.

## Goal

Add a `Copy rejection reason` action to `/admin/knowledge`.

## Scope

- Copy candidate, task, review status, and current rejection reason.
- Disable the action when the reason is empty.
- Confirm copy success or failure in status text.
- Keep the action read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy rejection reason`.
2. The action is disabled when the rejection reason is empty.
3. Applying a preset enables the action.
4. Copied text includes candidate, task, review status, and reason body.
5. Status text confirms copy success.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for rejection reason copy.

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
- 2026-05-13: Browser UI verification confirmed `Copy rejection reason` copies candidate, task, review status, and rejection reason; `/api/project/changes` returned the known unrelated 500 during page load.
