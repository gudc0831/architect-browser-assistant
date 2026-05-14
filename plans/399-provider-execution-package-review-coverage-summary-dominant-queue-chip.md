# Slice 399: Provider execution package review coverage group summary dominant queue chip

## Product Context

Slice 398 added Markdown size chips for the compact group summary. Reviewers can now see summary size, but still need a quick read of which coverage queue dominates the visible package set before scanning grouped rows.

## Goal

Show the dominant provider execution package review coverage queue as a read-only chip.

## Scope

- Add a dominant queue chip near the grouped coverage summary status area.
- Derive the chip from the grouped queue rows already shown on screen.
- Show `Dominant queue none` when no visible rows exist.
- Preserve active filters, generated-at chip, size chips, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Compute the dominant queue from `providerExecutionPackageReviewCoverageGroups`.
- Use the existing group titles to avoid introducing a second naming scheme.
- Keep the chip read-only and updated with the current loaded report/filters.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the dominant queue chip in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 11:03 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:04 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 11:03 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 11:05 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:05 KST: Browser UI validation passed on desktop and mobile against `next start`; the dominant queue chip matched the group counts in the visible summary preview.

## Out of Scope

- Reordering queue groups.
- Changing coverage group definitions.
- Server-side dominant queue persistence.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary empty queue count chip.
