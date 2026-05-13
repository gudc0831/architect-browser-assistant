# Slice 115: Knowledge Approval Risk Summary

## Product Context

Approval guardrails now cover evidence, Markdown structure, tags, and publication scope. Reviewers need a consolidated summary of warning groups before approval.

## Goal

Add an approval risk summary to `/admin/knowledge`.

## Scope

- Group approval guardrails into scope, metadata, structure, evidence, and state categories.
- Show warning counts per category.
- Keep the summary read-only and client-side.
- Update as draft fields change.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge approval risk summary`.
2. Summary shows scope warning count.
3. Summary shows metadata warning count.
4. Summary shows structure/evidence/state warning counts.
5. Summary updates when guardrails change.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for approval risk summary.

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
- 2026-05-13: Browser UI verification confirmed `Knowledge approval risk summary` shows scope, metadata, structure, evidence, and state warning counts.
