# Slice 385: Provider execution package review coverage queue grouping

## Product Context

Slice 384 added shortcuts from provider execution package coverage totals into the matching review-state filter. Reviewers can focus a state quickly, but the coverage rows still need stable group headings so mixed scopes remain easy to scan.

## Goal

Group provider execution package review coverage rows into stale, unreviewed, and reviewed queues.

## Scope

- Show stale, unreviewed, and reviewed coverage row groups in the Admin Knowledge provider execution package review report.
- Include each group count and short read-only description.
- Reuse the already-filtered report coverage rows so active review-state, digest, reviewer, note-type, execution, and stale-days filters remain respected.
- Preserve row-level digest focus actions.
- Keep grouping read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Group rows client-side in `architect-saas` from `approvedProviderExecutionReviewReport.coverage`.
- Keep the report API unchanged because the server already returns the correct filtered coverage scope.
- Show all three group headings even when a group is empty so reviewers can see why the current filter scope has no rows for that state.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped coverage queue sections in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed coverage rows can be grouped into stale, unreviewed, and reviewed counts that add back to the active report row count.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed `Stale review queue`, `Unreviewed queue`, and `Reviewed queue` render at 1440x900 and 390x844.
- Browser UI validation confirmed grouped unreviewed rows preserve the row-level `Focus digest` action.

## Out of Scope

- Saved queue grouping preferences.
- Server-side group payload changes.
- New review-note categories.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group row chips.
