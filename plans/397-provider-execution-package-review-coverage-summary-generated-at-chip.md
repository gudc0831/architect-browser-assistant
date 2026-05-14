# Slice 397: Provider execution package review coverage group summary generated-at chip

## Product Context

Slice 396 added a reset action for local summary handoff status. Reviewers can now copy, download, and clear local status, but the summary controls do not show which report snapshot timestamp the preview and handoff actions are based on.

## Goal

Show the provider execution package review coverage group summary generated-at timestamp as a read-only chip.

## Scope

- Add a generated-at chip near the grouped coverage summary status area.
- Source the timestamp from `approvedProviderExecutionReviewReport.generatedAt`.
- Preserve active filters, summary preview, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Display the existing report `generatedAt` value directly so the chip reflects report data rather than local browser clock state.
- Keep the chip read-only and local to the current loaded report.
- Leave report API shape unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the generated-at chip in `architect-saas`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Browser UI validation passed. |

## Verification Log

- 2026-05-14 10:56 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 10:56 KST: `npm run lint` passed in `architect-saas` with the pre-existing hook dependency warnings.
- 2026-05-14 10:56 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` still returns coverage group totals.
- 2026-05-14 10:57 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 10:58 KST: Browser UI validation passed on desktop and mobile against `next start`; the generated-at chip showed the current report timestamp from `approvedProviderExecutionReviewReport.generatedAt`.

## Out of Scope

- Timestamp formatting preferences or timezone conversion.
- Report refresh controls.
- Server-side summary archive records.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary Markdown size chip.
