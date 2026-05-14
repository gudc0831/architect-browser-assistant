# Slice 390: Provider execution package review coverage group summary preview

## Product Context

Slice 389 added `Copy group summary` for provider execution package review coverage queues. Reviewers can copy the compact grouped summary, but need to inspect the exact Markdown payload before using the clipboard action.

## Goal

Show a read-only preview of the provider execution package review coverage group summary before copy.

## Scope

- Show the compact grouped coverage summary Markdown in the Admin Knowledge provider execution package review area.
- Reuse the same generated summary text for preview and `Copy group summary`.
- Preserve grouped headings, density controls, empty-state guidance, row chips, and digest focus actions.
- Keep the preview read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Generate the grouped summary with a single `useMemo` in `architect-saas`.
- Render the summary in a bounded read-only `pre`.
- Keep report API, CSV export, and full review handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added grouped coverage summary preview in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed the report still returns the filters, totals, and coverage rows needed by the preview.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed the summary preview renders the filter line, package counts, and group counts at 1440x900 and 390x844.
- Browser UI validation with a clipboard stub confirmed `Copy group summary` copies the exact preview text.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the preview checks.

## Out of Scope

- Saved summary previews.
- Server-side summary generation.
- Changing the existing full review handoff copy.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary filter chips.
