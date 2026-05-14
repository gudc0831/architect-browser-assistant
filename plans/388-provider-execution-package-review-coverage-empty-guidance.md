# Slice 388: Provider execution package review coverage empty-state guidance

## Product Context

Slice 387 added comfortable and compact density controls for grouped provider execution package coverage queues. Empty groups can now appear in more focused views, so reviewers need to see which active filters caused a queue or group to be empty.

## Goal

Add active-filter guidance to empty provider execution package review coverage queue states.

## Scope

- Show active filter context when the full coverage queue has no rows.
- Show active filter context when an individual stale, unreviewed, or reviewed group has no rows.
- Include review-state, digest, reviewer, note-type, execution, and stale-days context where present.
- Preserve grouped headings, density controls, row chips, and digest focus actions.
- Keep guidance read-only with no saved views, provider writes, package mutations, or review-note mutations.

## Implementation Decisions

- Build the active filter labels client-side from the loaded review report filters.
- Reuse the grouped queue layout from Slice 385 and density styles from Slice 387.
- Keep report API, CSV export, and handoff payload unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added empty-state guidance in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | completed | Typecheck, lint, API/service validation, build, and Browser UI validation completed. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed in `architect-saas`; remaining warnings are pre-existing task hook dependency warnings outside this slice.
- Direct `getKnowledgeProviderExecutionPackageReviewNoteReport` validation confirmed empty filtered reports preserve review-state, reviewer, note-type, and stale-days filter context.
- `npm run build` passed in `architect-saas`.
- Browser UI validation on `next start -p 3001` with local auth override confirmed default empty group guidance and full empty coverage guidance after `Focus reviewed` at 1440x900 and 390x844.
- Known unrelated local `/api/project/changes` Prisma error appeared during Browser UI verification and did not block the empty-state checks.

## Out of Scope

- Persisted empty-state dismissals.
- Server-side empty-state payload changes.
- New review-note categories.
- Mutating retained provider execution packages or package review notes.
- Changing CSV export columns or handoff payload format.

## Next Candidate

Add provider execution package review coverage group summary copy.
