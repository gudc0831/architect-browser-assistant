# Slice 99: Knowledge Markdown Heading Guardrail

## Product Context

Markdown outline preview shows heading structure. Approval guardrails should also warn reviewers when a draft body has content but no Markdown headings.

## Goal

Add a Markdown heading guardrail to `/admin/knowledge`.

## Scope

- Add a ready guardrail when Markdown headings are present.
- Add a warning guardrail when body content exists but no headings exist.
- Avoid duplicate missing-body warnings when the body is empty.
- Include the guardrail in `Copy approval checklist`.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` mentions Markdown heading coverage.
2. Ready state appears when headings exist.
3. Warning appears when body content exists with no headings.
4. Empty body continues to rely on the existing readiness warning.
5. `Copy approval checklist` includes the heading guardrail.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for Markdown heading guardrail.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
