# Slice 94: Knowledge Dirty Draft Reset Warning

## Product Context

Draft dirty-state indicators show which fields changed. Reviewers also need an explicit warning near the editor flow before using reset.

## Goal

Add a dirty-draft reset warning to `/admin/knowledge`.

## Scope

- Show a reset-impact banner in the WIKI draft editor.
- Warn when reset would discard changed fields.
- Show a ready state when the draft matches the selected candidate.
- Reuse the dirty-field count from Slice 93.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge dirty draft reset warning`.
2. Warning appears when one or more draft fields changed.
3. Warning shows changed-field count.
4. Ready state appears when no draft fields changed.
5. Resetting the draft clears the warning.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for dirty-draft reset warning.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
