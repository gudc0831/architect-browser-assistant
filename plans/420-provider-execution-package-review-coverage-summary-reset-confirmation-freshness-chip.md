# Slice 420: Provider execution package review coverage group summary reset confirmation freshness chip

## Product Context

Slice 419 added a local copied-at timestamp for reset-confirmation copy handoff. After a new local reset creates a new reset confirmation timestamp, reviewers need a clear cue that the latest confirmation still needs to be copied.

## Goal

Show a local freshness chip for the provider execution package coverage group summary reset confirmation copy handoff.

## Scope

- Add a reset-confirmation freshness chip near the copied-at chip.
- Show a pending state before any local reset confirmation exists.
- After `Reset summary status`, show that a fresh reset-confirmation copy is needed.
- After `Copy reset confirmation`, show that the reset-confirmation copy is current.
- Preserve active filters, generated-at chip, next filename chip, filename copy action, filename copy status, reset explanation chip, reset confirmation chip, reset confirmation copy action, reset confirmation copy status, copied-at chip, size chips, stale priority chip, review-needed chip, local-only handoff chip, summary preview, copy/download actions, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Derive freshness from existing local reset timestamp and copied-at state.
- Keep the chip client-only and do not persist copy freshness.
- Keep the report API shape unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the reset-confirmation freshness chip in `architect-saas` commit `23eaa6f35ec0f90b7abe5b7d9c6751a38f3b026d`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI freshness checks passed. |

## Verification Log

- 2026-05-14 13:41 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 13:42 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 13:41 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 13:42 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 13:43 KST: Playwright desktop validation confirmed initial pending, refresh-needed after reset, and current after copying reset confirmation.
- 2026-05-14 13:43 KST: Playwright mobile validation found the freshness chip and pending state.

## Out of Scope

- Server-side freshness audit records.
- Persisted handoff history.
- Changing summary Markdown payload contents.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary reset confirmation freshness tooltip text.
