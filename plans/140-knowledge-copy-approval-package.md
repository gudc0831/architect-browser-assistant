# Slice 140: Knowledge Copy Approval Package

## Product Context

Admins need a single handoff package containing draft, decision, blockers, and evidence context.

## Goal

Add `Copy approval package` to `/admin/knowledge`.

## Scope

- Add the action in the final action area.
- Copy candidate, task, project, review, confidence, readiness, warning group, and evidence kind context.
- Include Markdown sections suitable for ticket or chat handoff.
- Keep the action read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy approval package`.
2. Copied text includes candidate, task, project, and review context.
3. Copied text includes section headings.
4. Status text confirms copy success.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy approval package.

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
- 2026-05-13: Browser UI verification clicked `Copy approval package` and confirmed clipboard sections `# Knowledge approval package`, `## Draft`, `## Decision`, `## Blockers`, and `## Evidence`.
