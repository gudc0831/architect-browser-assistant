# Slice 391: Provider execution package review coverage group summary filter chips

## Product Context

Slice 390 added a read-only Markdown preview for the provider execution package coverage group summary. The filter scope is present in the Markdown body, but reviewers need the active scope visible as chips before reading the preview.

## Goal

Show active filter chips above the provider execution package coverage group summary preview.

## Scope

- Show active filter chips for review-state, digest, reviewer, note-type, execution, and stale-days scope where present.
- Keep chips in sync with the preview filter line.
- Preserve summary preview, copy action, grouped headings, density controls, empty-state guidance, row chips, and digest focus actions.
- Keep chips read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Reuse the active filter label list introduced for empty-state guidance and summary generation.
- Render chips client-side in `architect-saas` above the preview.
- Keep report API, CSV export, and full review handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added summary filter chips in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed the report still returns the filters and totals needed by the chips.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed filter chips match the summary preview filter line, update after `Focus reviewed`, and render at 1440x900 and 390x844.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the filter chip checks.

## Out of Scope

- Interactive filter chip removal.
- Saved summary filter scopes.
- Server-side summary generation.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary count chips.
