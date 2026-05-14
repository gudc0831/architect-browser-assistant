# Slice 383: Provider execution package review coverage group totals

## Product Context

Slice 382 added a read-only preview of the active provider execution package review handoff. Reviewers can inspect the copied payload, but the package coverage queue still needs immediate group totals for the currently active review scope before scanning individual rows.

## Goal

Add read-only coverage queue group totals for provider execution package review rows.

## Scope

- Show all visible, reviewed, unreviewed, and stale provider execution package counts beside the coverage queue.
- Include the active visible note count in the queue totals.
- Ensure totals update with review-state, reviewer, note-type, digest, execution, and stale-days filters.
- Keep totals read-only and avoid saved views, server persistence, or package/review-note mutation.

## Implementation Decisions

- The server report exposes `summary.coverageGroupTotals` derived from the filtered coverage queue.
- Reviewer and note-type filters also narrow coverage rows to packages with matching notes.
- Existing global summary, reviewer counts, category counts, CSV export, copy handoff, and package evidence remain unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin API | implemented | Added filtered coverage group totals in `architect-saas`. |
| Admin UI | implemented | Added group total cards beside provider execution package coverage rows. |
| Documentation | implemented | User guide, roadmap, and worklogs updated during the slice. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed `summary.coverageGroupTotals.totalCount` matches filtered coverage rows for all, note-type, and reviewer scopes.
- `npm run build` passed in `architect-saas`.
- Browser UI validation confirmed the coverage queue group totals render at 1440x900 and 390x844 in the Admin Knowledge page.
- Known unrelated production auth-stub polling noise remains: `/api/project/changes` logs Prisma EACCES errors during local Browser UI verification.

## Out of Scope

- Saved coverage queue group views.
- New provider execution package review-note categories.
- Mutating retained provider execution packages or review notes.
- Changing CSV export columns.

## Next Candidate

Add provider execution package review coverage group shortcuts.
