# Slice 392: Provider execution package review coverage group summary count chips

## Product Context

Slice 391 added active filter chips above the provider execution package coverage group summary preview. Reviewers also need the core visible, reviewed, unreviewed, stale, and note counts available as compact chips before reading or copying the Markdown summary.

## Goal

Show compact count chips above the provider execution package review coverage group summary preview.

## Scope

- Show visible package, reviewed, unreviewed, stale, and visible note count chips.
- Keep count chips in sync with the copied summary count lines.
- Preserve summary filter chips, summary preview, copy action, grouped headings, density controls, empty-state guidance, row chips, and digest focus actions.
- Keep chips read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Build count chips client-side from `summary.coverageGroupTotals`.
- Render chips beside the existing summary filter chip area.
- Keep report API, CSV export, and full review handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added summary count chips in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed the report still returns the summary totals needed by the count chips.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed visible, reviewed, unreviewed, stale, and note count chips match the preview counts, update after `Focus reviewed`, and render at 1440x900 and 390x844.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the count chip checks.

## Out of Scope

- Interactive count chip filters.
- Saved summary count snapshots.
- Server-side summary generation.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary Markdown download.
