# Slice 84: Knowledge Unsourced Evidence Guardrail

## Product Context

Evidence source coverage is visible, but approval guardrails should also warn reviewers when selected evidence lacks source URLs.

## Goal

Add an unsourced evidence approval guardrail to `/admin/knowledge`.

## Scope

- Add a warning when one or more evidence rows lack source URLs.
- Add a ready note when every evidence row has a source URL.
- Leave no additional source guardrail when there is no evidence, because the readiness guardrail already covers missing evidence.
- Include the guardrail in the existing approval checklist copy path.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` warns for unsourced evidence.
2. The warning shows unsourced count against total evidence count.
3. All-sourced evidence shows a ready guardrail note.
4. `Copy approval checklist` includes the new guardrail text.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for unsourced evidence guardrail.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
