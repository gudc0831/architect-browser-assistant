# Slice 402: Provider execution package review coverage group summary stale priority chip

## Product Context

Slice 401 added a review-needed chip. Reviewers can now see the number of visible packages missing review notes, but still need to distinguish ordinary unreviewed packages from stale unreviewed packages that should be prioritized.

## Goal

Show provider execution package review coverage group summary stale priority status.

## Scope

- Add a stale priority chip near the grouped coverage summary status area.
- Derive stale count from `summary.coverageGroupTotals.staleUnreviewedCount`.
- Include the active stale-day threshold from the report filters.
- Preserve active filters, review-needed chip, empty queue count chip, dominant queue chip, generated-at chip, size chips, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Show a positive priority message when stale unreviewed count is greater than zero.
- Show a no-stale message with the active stale threshold when stale count is zero.
- Keep the chip read-only and updated with the current loaded report/filters.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the stale priority chip in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 11:14 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:15 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 11:14 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns filters and coverage group totals.
- 2026-05-14 11:16 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:16 KST: Browser UI validation passed on desktop and mobile against `next start`; the stale priority chip matched the stale count and stale-day threshold in the visible summary preview.

## Out of Scope

- Changing stale/unreviewed coverage semantics.
- Adding review-note creation shortcuts.
- Server-side queue state persistence.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary local-only handoff chip.
