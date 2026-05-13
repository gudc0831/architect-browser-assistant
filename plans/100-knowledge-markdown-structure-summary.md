# Slice 100: Knowledge Markdown Structure Summary

## Product Context

Markdown outline preview focuses on headings. Reviewers also need a broader structural summary of the draft body before approval.

## Goal

Add a Markdown structure summary to `/admin/knowledge`.

## Scope

- Count Markdown headings.
- Count paragraph-like non-heading, non-list lines.
- Count Markdown list items.
- Count non-empty lines.
- Keep the summary read-only and client-side.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge Markdown structure summary`.
2. Summary shows heading count.
3. Summary shows paragraph count.
4. Summary shows list item count.
5. Summary updates as the draft Markdown body changes.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for Markdown structure summary.

## Implementation Notes

- Status: implemented
- SaaS commit: `441ecca`
- Browser assistant planning commit: `a410958`

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: `GET /api/admin/knowledge/candidates` returned 200.
- 2026-05-13: Browser UI verification confirmed the Markdown summary updates to headings 1, paragraphs 1, list items 1, and lines 3 after editing the draft body.
