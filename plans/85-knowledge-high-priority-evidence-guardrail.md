# Slice 85: Knowledge High-Priority Evidence Guardrail

## Product Context

Evidence priority tiers are visible in the draft review surface. Approval guardrails should warn reviewers when evidence exists but none of it is high priority.

## Goal

Add a high-priority evidence approval guardrail to `/admin/knowledge`.

## Scope

- Count evidence rows with priority 1-3 as high priority.
- Add a ready note when high-priority evidence exists.
- Add a warning when evidence exists but no high-priority evidence exists.
- Include the guardrail in approval checklist copy.

## Acceptance Criteria

1. `Knowledge approval guardrail notes` shows high-priority evidence coverage.
2. A ready note appears when at least one evidence row is high priority.
3. A warning appears when evidence exists but no high-priority evidence exists.
4. `Copy approval checklist` includes the new guardrail text.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for high-priority evidence guardrail.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
