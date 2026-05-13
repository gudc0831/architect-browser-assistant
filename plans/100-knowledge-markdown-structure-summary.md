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

- SaaS commit: pending
- Browser assistant planning commit: pending
