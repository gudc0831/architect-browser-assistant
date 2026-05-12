# Slice 95: Knowledge Dirty Draft Approval Guardrail

## Product Context

Reviewers can now see draft dirty-state indicators and reset impact. Approval guardrails should also call out when approval will use edited fields instead of the original candidate draft.

## Goal

Add a dirty-draft approval guardrail to `/admin/knowledge`.

## Scope

- Add an approval guardrail for edited draft fields.
- List changed draft fields in the guardrail detail.
- Show a ready guardrail when the draft is unchanged.
- Include the guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions changed draft fields when present.
2. Changed-field guardrail lists field names.
3. Unchanged drafts show a ready guardrail.
4. `Copy approval checklist` includes the dirty-draft guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for dirty-draft approval guardrail.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
