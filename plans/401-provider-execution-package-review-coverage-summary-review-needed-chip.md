# Slice 401: Provider execution package review coverage group summary review-needed chip

## Product Context

Slice 400 added an empty queue count chip. Reviewers can now see queue shape, but they still need a direct count of visible packages that need review notes.

## Goal

Show provider execution package review coverage group summary review-needed count.

## Scope

- Add a review-needed chip near the grouped coverage summary status area.
- Derive the chip from `summary.coverageGroupTotals.unreviewedCount`.
- Preserve active filters, empty queue count chip, dominant queue chip, generated-at chip, size chips, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use `unreviewedCount` as the review-needed count because stale unreviewed rows are a subset of unreviewed coverage.
- Keep the chip read-only and updated with the current loaded report/filters.
- Leave report API shape unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the review-needed chip in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 11:10 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:11 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 11:10 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 11:12 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:12 KST: Browser UI validation passed on desktop and mobile against `next start`; the review-needed chip matched the unreviewed count in the visible summary preview.

## Out of Scope

- Changing stale/unreviewed coverage semantics.
- Adding review-note creation shortcuts.
- Server-side queue state persistence.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary stale priority chip.
