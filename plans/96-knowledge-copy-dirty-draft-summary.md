# Slice 96: Knowledge Copy Dirty Draft Summary

## Product Context

Dirty-state indicators and guardrails show changed draft fields on screen. Reviewers also need to copy that context for handoff before approval.

## Goal

Add a copy dirty-draft summary action to `/admin/knowledge`.

## Scope

- Add `Copy dirty draft summary` in the WIKI draft editor.
- Include selected candidate and task context.
- Include changed-field count and names.
- Include current scope and tags.
- Keep the action clipboard-only and read-only.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy dirty draft summary`.
2. Copied text includes selected candidate and task context.
3. Copied text includes changed-field count and field names.
4. Copied text includes current scope and tags.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy dirty draft summary.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
