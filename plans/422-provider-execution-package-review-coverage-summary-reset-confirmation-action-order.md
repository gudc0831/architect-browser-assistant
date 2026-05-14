# Slice 422: Provider execution package review coverage group summary reset confirmation action order

## Product Context

Slice 421 added tooltip text for reset-confirmation freshness. The local handoff actions now include multiple copy/reset controls, so the order should match the status flow: copy the current reset confirmation before creating a new reset state.

## Goal

Move `Copy reset confirmation` before `Reset summary status` in the provider execution package coverage group summary action row.

## Scope

- Reorder the local handoff buttons so `Copy reset confirmation` appears before `Reset summary status`.
- Preserve button labels and behavior.
- Preserve active filters, generated-at chip, next filename chip, filename copy action, filename copy status, reset explanation chip, reset confirmation chip, reset confirmation copy status, copied-at chip, freshness chip, tooltip text, size chips, stale priority chip, review-needed chip, local-only handoff chip, summary preview, copy/download actions, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Keep this slice as visual/action-order polish only.
- Do not change report API shape or local state semantics.
- Keep `Reset summary status` available in the same action row.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Reordered the reset-confirmation copy and reset buttons in `architect-saas` commit `28700d0f3526add6f9fb9164bc3a3a2e4bb58ffd`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI action order checks passed. |

## Verification Log

- 2026-05-14 13:48 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 13:48 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 13:48 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 13:49 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 13:50 KST: Playwright desktop and mobile validation confirmed `Copy reset confirmation` appears before `Reset summary status` while copy, download, filename, and reset actions remain visible.

## Out of Scope

- New actions or status chips.
- Server-side copy audit records.
- Persisted handoff history.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary reset confirmation action grouping label.
