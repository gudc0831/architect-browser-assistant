# Slice 414: Provider execution package review coverage group summary next download filename chip

## Product Context

Slice 403 left the next roadmap candidate as a provider execution package review coverage group summary download filename chip. The current operating baseline treats Slice 413 as complete, so this slice resumes the roadmap at Slice 414 while preserving the existing provider review summary flow.

## Goal

Show the provider execution package review coverage group summary Markdown filename before `Download group summary` is clicked.

## Scope

- Add a read-only next download filename chip near the provider execution package coverage group summary status area.
- Derive the displayed filename from the same generated date used by the actual Markdown download.
- Preserve active filters, generated-at chip, size chips, stale priority chip, review-needed chip, local-only handoff chip, copy/download actions, local status chips, reset action, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Use a shared filename helper so the chip and download action cannot drift.
- Keep the report API shape unchanged.
- Keep the chip read-only because it describes a local browser download target.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the next download filename chip in `architect-saas` commit `35acf3ce2329a6b85cf8752e2029d399822d9c20`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, Chrome desktop/mobile DOM checks, and CDP download filename validation passed. |

## Verification Log

- 2026-05-14 11:32 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 11:32 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 11:33 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` and derived `provider-execution-package-coverage-summary-2026-05-14.md` from `generatedAt`.
- 2026-05-14 11:35 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 11:42 KST: Chrome headless desktop and mobile DOM validation against auth-stub `next start` found the next filename chip beside the summary status controls.
- 2026-05-14 11:44 KST: Chrome DevTools Protocol download validation clicked `Download group summary` and confirmed the downloaded Markdown filename matched the visible next filename chip.
- 2026-05-14 11:46 KST: `npm run typecheck` and `npm run lint` passed in `architect-browser-assistant`.

## Out of Scope

- Server-side summary archive records.
- Persisted handoff audit history.
- Changing summary Markdown payload contents.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary filename copy action.
