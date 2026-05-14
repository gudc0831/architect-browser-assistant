# Slice 432: Provider execution package review coverage summary Markdown size chip tooltip

## Product Context

Slice 431 added a tooltip to the next filename chip. The Markdown size chips already show line and character counts, but they need tooltip context explaining that counts are computed from the exact preview text used for copy and download.

## Goal

Add a tooltip to the provider execution package coverage summary Markdown size chips.

## Scope

- Add a static title tooltip to the existing Markdown size chip group.
- Explain that line and character counts come from the exact preview text used for copy/download.
- Preserve size chip values, generated-at chip, next filename chip, summary preview, copy/download actions, grouped queues, density controls, and report API.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a static `title` on the existing chip-style size group container.
- Keep the tooltip read-only and focused on preview-derived counts.
- Keep Markdown generation and local state behavior unchanged.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the Markdown size chip tooltip in `architect-saas` commit `ee45380b11f322a8a5619bf006771ad4120fbf54`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, and Playwright Browser UI size-tooltip checks passed. |

## Verification Log

- 2026-05-14 14:44 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 14:44 KST: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-14 14:45 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 14:45 KST: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-14 14:46 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })`, filename `provider-execution-package-coverage-summary-2026-05-14.md`, and totals.
- 2026-05-14 14:46 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 14:47 KST: Playwright desktop and mobile validation confirmed the Markdown size title and summary preview.

## Out of Scope

- Changing Markdown preview generation.
- Changing line or character count formulas.
- New action buttons or status chips.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary dominant queue chip tooltip.
