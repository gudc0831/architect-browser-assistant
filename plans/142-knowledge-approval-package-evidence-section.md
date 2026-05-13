# Slice 142: Knowledge Approval Package Evidence Section

## Product Context

The approval package should carry evidence row context so reviewers can validate source support without reopening the evidence panel.

## Goal

Include evidence rows in copied approval packages.

## Scope

- Include evidence kind.
- Include priority.
- Include evidence title.
- Include source URL when available.

## Acceptance Criteria

1. Copied approval package includes an `Evidence` section.
2. Evidence rows include kind and priority.
3. Evidence rows include title.
4. Source URL is included when present.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval package evidence section.

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
- 2026-05-13: Browser clipboard verification confirmed the approval package includes evidence kind, priority, title, excerpt, and source URL placeholder handling; the first `networkidle` attempt timed out, then the `domcontentloaded` rerun passed.
