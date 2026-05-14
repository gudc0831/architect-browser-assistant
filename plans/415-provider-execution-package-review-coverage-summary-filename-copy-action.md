# Slice 415: Provider execution package review coverage group summary filename copy action

## Product Context

Slice 414 made the next provider execution package review coverage group summary Markdown filename visible before download. Reviewers can now see the local handoff filename, but still need a direct way to copy only that filename when preparing external handoff notes.

## Goal

Allow reviewers to copy the visible provider execution package coverage group summary download filename without copying the full Markdown summary.

## Scope

- Add a local `Copy filename` action near the provider execution package coverage group summary copy/download controls.
- Copy the same filename shown in the next download filename chip.
- Add a read-only filename copy status chip that records the last copied filename in the current browser session.
- Ensure `Reset summary status` clears the filename-copy status together with the existing local copy/download status.
- Preserve active filters, generated-at chip, next filename chip, size chips, stale priority chip, review-needed chip, local-only handoff chip, summary preview, copy/download actions, grouped queues, density controls, and digest focus actions.
- Avoid server writes, provider writes, package mutations, and review-note mutations.

## Implementation Decisions

- Reuse the Slice 414 filename helper as the single filename source.
- Keep filename copying in browser clipboard state only.
- Store the copied filename string rather than only a boolean so reviewers can see exactly what was copied.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| Admin UI | implemented | Added the filename copy action and copied filename status chip in `architect-saas` commit `1e440a51e45aa4867c7113e617730f0b71f07108`. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs without adding implementation detail to `PLAN.md`. |
| Verification | completed | Typecheck, lint, service validation, build, Chrome CDP clipboard/download validation, and mobile DOM checks passed. |

## Verification Log

- 2026-05-14 12:35 KST: `npm run typecheck` passed in `architect-saas`.
- 2026-05-14 12:35 KST: `npm run lint` passed in `architect-saas` with the pre-existing task hook warnings.
- 2026-05-14 12:36 KST: `npx tsx -e "..."` validated `getKnowledgeProviderExecutionPackageReviewNoteReport({ coveragePreset: "all", staleDays: "7" })` and derived `provider-execution-package-coverage-summary-2026-05-14.md` from `generatedAt`.
- 2026-05-14 12:37 KST: `npm run build` passed in `architect-saas`.
- 2026-05-14 12:38 KST: Chrome CDP validation clicked `Copy filename`, confirmed clipboard text matched the next filename chip, clicked `Download group summary`, and confirmed the downloaded Markdown filename matched the same chip.
- 2026-05-14 12:38 KST: Chrome headless mobile DOM validation found `Copy filename`, `Filename copy pending`, and the next filename chip.

## Out of Scope

- Server-side summary archive records.
- Persisted handoff audit history.
- Changing summary Markdown payload contents.
- Mutating retained provider execution packages or package review notes.

## Next Candidate

Add provider execution package review coverage group summary filename/download reset explanation chip.
