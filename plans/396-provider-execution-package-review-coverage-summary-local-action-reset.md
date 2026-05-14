# Slice 396: Provider execution package review coverage group summary local action reset

## Product Context

Slices 394 and 395 added local copy/download status chips for the provider execution package coverage group summary. Once reviewers test or repeat handoff actions, they need a way to clear only those local status chips without changing filters or review data.

## Goal

Add a client-side reset action for provider execution package review coverage group summary local action status.

## Scope

- Add `Reset summary status` beside the grouped coverage summary controls.
- Reset the local download status chip to `Download pending`.
- Reset the local copy status chip to `Copy pending`.
- Preserve active filters, summary preview, copy/download actions, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Clear the local React state used by the copy/download status chips.
- Keep reset feedback in the existing page status message.
- Do not reload the report or mutate coverage query state.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the local status reset action in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 10:53 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 10:53 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 10:53 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 10:54 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 10:55 KST: Browser UI validation passed on desktop and mobile against `next start`; after copy and download, `Reset summary status` returned the download chip to `Download pending` and the copy chip to `Copy pending`. The local auth-stub run still emitted the known unrelated `/api/project/changes` Prisma polling noise.

## Out of Scope

- Resetting active provider execution review filters.
- Clearing persisted review notes or provider execution packages.
- Server-side handoff audit state.
- Saved summary snapshots.

## Next Candidate

Add provider execution package review coverage group summary generated-at chip.
