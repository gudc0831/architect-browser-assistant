# Slice 416: Provider execution package review coverage group summary reset explanation chip

## Product Context

Slice 415 added a local filename copy action and status chip for the provider execution package coverage group summary. The summary status area now has multiple local statuses, so reviewers need a persistent explanation that `Reset summary status` clears only local browser status and does not mutate provider evidence or review state.

## Goal

Show a read-only reset explanation chip beside the provider execution package coverage group summary status chips.

## Scope

- Add a read-only reset explanation chip near the provider execution package coverage group summary local status chips.
- Explain that `Reset summary status` clears local summary copy, filename copy, and download status only.
- Preserve active filters, generated-at chip, next filename chip, filename copy action, filename copy status, size chips, stale priority chip, review-needed chip, local-only handoff chip, summary preview, copy/download actions, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static read-only chip because the reset boundary is invariant.
- Keep reset behavior unchanged except for the Slice 415 filename-copy status that it already clears.
- Keep the report API shape unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the reset explanation chip in `architect-saas` commit `a0a54706f07281396adf8973651a99a23a86512c`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, Chrome CDP reset-flow validation, and mobile DOM checks passed. |

## Verification Log

- 2026-05-14 12:42 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 12:42 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 12:43 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` and derived `provider-execution-package-coverage-summary-2026-05-14.md` from `generatedAt`.
- 2026-05-14 12:44 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 12:45 KST: Chrome CDP validation confirmed the reset explanation chip remained present before and after copying filename, copying summary, downloading summary, and resetting local status.
- 2026-05-14 12:45 KST: Chrome headless mobile DOM validation found the reset explanation chip.

## Out of Scope

- Server-side summary archive records.
- Persisted handoff audit history.
- Changing summary Markdown payload contents.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary status reset confirmation chip.
