# 474. Source Legal Governance Review Workflow

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `470-legal-source-governance-admin-ui.md`, `471-legal-source-governance-acknowledgement-records.md`
Status: `implemented_verified`

## Goal

Let Knowledge admins record source-by-source legal-source governance review decisions against the current offline regulation governance package.

## Why This Slice

Slice 470 exposed source refresh rows and Slice 471 added package-level acknowledgements, but reviewers still had no durable way to record per-source findings. That left all sources under one package note even when only one official source needed follow-up or blocking context.

## Scope

1. Add append-only source review records for each regulation governance source.
2. Persist source id, source name, package id, package digest, `asOf`, review state, reviewer note, reviewer id, refresh status, document count, admin-review-required count, and checklist count.
3. Expose a Knowledge admin API for listing and creating source review records.
4. Extend the regulation governance report with source review summary metrics and per-source latest review context.
5. Extend `/admin/knowledge` with source-row review controls, latest source review display, and copyable report content.
6. Record paired SaaS and planning worklogs.

## Out Of Scope

- External legal-source crawling.
- Production legal-source import execution.
- Mutating the offline governance manifest.
- Scheduled refresh automation.
- Embedding execution/backfill.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Source review audit records | implemented | `architect-saas` | `typecheck`, direct service check passed |
| Source review API | implemented | `architect-saas` | `build` included route; unauthenticated GET/POST returned 401 |
| Governance report source summary | implemented | `architect-saas` | direct `getRegulationGovernanceReport()` returned source review summary |
| Knowledge admin source review UI | implemented | `architect-saas` | `typecheck`, `lint`, `build` passed |
| Roadmap/worklog | implemented | `architect-browser-assistant`, `architect-saas` | `release:check` passed |

## Route / Service / UI Check

- Service: `architect-saas/src/use-cases/admin/knowledge-service.ts` keeps the package digest stable and appends source review context after digest calculation.
- Route: `architect-saas/src/app/api/admin/knowledge/regulation-governance/sources/[sourceId]/reviews/route.ts` lists and creates source review records for Knowledge admins.
- UI: `architect-saas/src/components/admin/knowledge-admin-shell.tsx` adds source review state/note controls and latest review records inside the existing legal-source governance source rows.
- Styling: `architect-saas/src/components/admin/knowledge-admin-shell.module.css` keeps the source review controls compact within the existing admin panel layout.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | Final verification | Passed `npm run typecheck`, `npm run lint`, `npm run regulation:governance:validate`, and `NEXT_DIST_DIR=.next-build npm run build` in `architect-saas`; direct `getRegulationGovernanceReport()` returned package `kr-architecture-foundation-2026-05-14`, 6 sources, 0 source review records, 0 reviewed sources, and stable digest prefix `1aab2da2a27704da`; local HTTP GET/POST to `/api/admin/knowledge/regulation-governance/sources/kr-building-act/reviews` returned 401 without auth; passed `npm run release:check` in `architect-browser-assistant` with existing local-origin/signing metadata warnings only. |

## Residual Risks

- Source reviews are governance evidence only; they do not enable production import or alter the offline manifest.
- Authenticated manual review submission depends on a live Knowledge admin session; this slice verified service/report shape, route protection, and compiled UI.
- This slice does not add bulk source-review reporting exports beyond the existing copyable governance report.

## Next Candidate Slice

1. Embedding execution worker once provider and database credentials are approved.
2. Admin chunk inspection and retrieval debug view for file-analysis evidence.
3. Source-review coverage export and stale-source-review filters.
