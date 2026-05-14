# Slice 389: Provider execution package review coverage group summary copy

## Product Context

Slice 388 added active-filter guidance for empty provider execution package coverage queues. Reviewers can now understand the visible scope, but they still need a compact handoff that copies grouped coverage totals without including every row.

## Goal

Add a read-only copy action for the active provider execution package review coverage group summary.

## Scope

- Add `Copy group summary` to the grouped coverage queue controls.
- Copy active filters, visible package total, reviewed/unreviewed/stale counts, visible note count, and group counts as Markdown.
- Preserve grouped headings, density controls, empty-state guidance, row chips, and digest focus actions.
- Keep the action read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Build the copied Markdown client-side from the loaded review report and grouped coverage rows.
- Reuse the active filter labels from Slice 388.
- Keep report API, CSV export, and full review handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped coverage summary copy action in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed the report still returns the filters, totals, and coverage rows needed by the copied summary.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override and a clipboard stub confirmed `Copy group summary` copies filters, visible package totals, reviewed/unreviewed/stale counts, note count, and grouped queue counts at 1440x900 and 390x844.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the copy summary checks.

## Out of Scope

- Saved summary snapshots.
- Server-side summary generation.
- Changing the existing full review handoff copy.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary preview.
