# Slice 123: Knowledge Approval Risk Empty-State Guidance

## Product Context

Risk filters can focus a category that has no current warnings. Reviewers need that state to read as deliberate clearance rather than a missing panel.

## Goal

Show category-specific no-warning guidance in `/admin/knowledge` approval risk group details.

## Scope

- Add no-warning guidance for visible approval risk groups with zero warnings.
- Include the active group label in the guidance.
- Keep the guidance read-only and client-side.
- Preserve existing warning/ready counts.

## Acceptance Criteria

1. `/admin/knowledge` shows a no-warning message for ready risk groups.
2. The message names the selected risk category.
3. Warning groups still show warning detail instead of the empty state.
4. The UI remains stable when switching risk filters.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for ready-category risk empty states.

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
- 2026-05-13: Browser UI verification confirmed the State risk filter shows `No state warnings in the current draft.` plus ready-note guidance.
