# Slice 137: Knowledge Copy Approval Blockers

## Product Context

Before submitting approval or rejection, reviewers may need to share the current blocker list with another admin.

## Goal

Add `Copy approval blockers` to `/admin/knowledge`.

## Scope

- Add a copy action in the final action area.
- Copy candidate and task context.
- Copy active warning count and warning group count.
- Copy active warning labels and details.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy approval blockers`.
2. The action is enabled when blockers exist.
3. Copied text includes candidate and task context.
4. Copied text includes blocker labels and details.
5. Status text confirms copy success.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copying approval blockers.

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
- 2026-05-13: Browser UI verification confirmed `Copy approval blockers` copies candidate, task, warning counts, and blocker details.
