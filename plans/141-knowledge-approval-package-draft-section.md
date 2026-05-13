# Slice 141: Knowledge Approval Package Draft Section

## Product Context

The final approval package should preserve the exact draft content under review, not only metadata.

## Goal

Include WIKI draft details in copied approval packages.

## Scope

- Include draft title.
- Include draft summary.
- Include publication scope and tags.
- Include current Markdown body.

## Acceptance Criteria

1. Copied approval package includes a `Draft` section.
2. The section includes title, summary, scope, and tags.
3. The section includes current Markdown body.
4. Empty Markdown body is handled explicitly.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval package draft section.

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
- 2026-05-13: Browser clipboard verification confirmed the approval package includes title, summary, scope, tags, and the current Markdown body in the draft section.
