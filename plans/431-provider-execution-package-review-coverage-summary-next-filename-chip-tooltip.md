# Slice 431: Provider execution package review coverage summary next filename chip tooltip

## Product Context

Slice 430 added a tooltip to the generated-at chip. The next filename chip already previews the Markdown filename, but it needs tooltip context tying that filename to download and copy-filename handoffs.

## Goal

Add a tooltip to the provider execution package coverage summary next filename chip.

## Scope

- Add a static title tooltip to the existing next filename chip.
- Explain that the filename is used by `Download group summary` and `Copy filename` local handoffs.
- Preserve filename text, generated-at chip, reset chips, summary preview, copy/download actions, grouped queues, density controls, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static `title` on the existing chip-style next filename container.
- Keep the tooltip local-only and focused on handoff filename semantics.
- Keep filename generation and local state behavior unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the next filename chip tooltip in `architect-saas` commit `1412bac9fe2216e6d034d577a73a32dadc13abfa`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI filename tooltip checks passed. |

## Verification Log

- 2026-05-14 14:39 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 14:39 KST: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-14 14:40 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 14:40 KST: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-14 14:41 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 14:41 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 14:42 KST: Playwright desktop and mobile validation confirmed the next filename title and `Copy filename` action.

## Out of Scope

- Changing filename generation.
- Server-side archive records.
- New action buttons or status chips.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary Markdown size chip tooltip.
