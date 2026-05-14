# Slice 400: Provider execution package review coverage group summary empty queue count chip

## Product Context

Slice 399 added a dominant queue chip. Reviewers can now see which queue is largest, but they also need a compact signal for how many queues are empty under the active filters.

## Goal

Show provider execution package review coverage group summary empty queue count.

## Scope

- Add an empty queue count chip near the grouped coverage summary status area.
- Derive the chip from the grouped queue rows already shown on screen.
- Show the empty queue count as `Empty queues N/3`.
- Preserve active filters, dominant queue chip, generated-at chip, size chips, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Compute empty queue count from `providerExecutionPackageReviewCoverageGroups`.
- Use the existing group count as the denominator so the chip follows grouped queue definitions.
- Keep the chip read-only and updated with the current loaded report/filters.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the empty queue count chip in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 11:07 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:07 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 11:07 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 11:08 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:09 KST: Browser UI validation passed on desktop and mobile against `next start`; the empty queue count chip matched the group counts in the visible summary preview.

## Out of Scope

- Reordering queue groups.
- Changing coverage group definitions.
- Server-side queue state persistence.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary review-needed chip.
