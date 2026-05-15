# 471. Legal Source Governance Acknowledgement Records

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `470-legal-source-governance-admin-ui.md`
Status: `implemented_verified`

## Goal

Let Knowledge admins persist reviewer acknowledgement records for the offline legal-source governance package so the governance panel is no longer read-only-only handoff evidence.

## Scope

1. Add append-only acknowledgement records for the current regulation governance package.
2. Store reviewer id, package id, package digest, `asOf`, note, validation status, source/document counts, status counts, and production-import status.
3. Expose a Knowledge admin API for listing and creating acknowledgement records.
4. Extend `/admin/knowledge` legal-source governance panel with acknowledgement summary, note form, saved records, and copyable report content.
5. Record paired SaaS and planning worklogs.

## Out Of Scope

- Enabling production legal-source import.
- Mutating the governance manifest or source refresh dates.
- External legal-source crawling.
- Source-by-source approval workflow.
- Database schema changes; this slice uses the existing append-only assistant audit event store.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Governance package digest | implemented | `architect-saas` | direct `getRegulationGovernanceReport()` returned digest and acknowledgement summary |
| Acknowledgement audit records | implemented | `architect-saas` | `npm run typecheck`, `npm run lint` passed |
| `/api/admin/knowledge/regulation-governance/acknowledgements` | implemented | `architect-saas` | `npm run build` includes route; unauthenticated GET/POST return 401 |
| Admin acknowledgement UI | implemented | `architect-saas` | `npm run typecheck`, `npm run lint`, `npm run build` passed |
| Roadmap/worklog | implemented | both repos | `npm run release:check` passed in browser-assistant |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | SaaS typecheck | `npm run typecheck` passed. |
| 2026-05-15 | SaaS lint | `npm run lint` passed. |
| 2026-05-15 | Governance validator | `npm run regulation:governance:validate` passed; 6 sources scheduled, 0 fail. |
| 2026-05-15 | Governance report service | Direct `getRegulationGovernanceReport()` check returned package `kr-architecture-foundation-2026-05-14`, digest prefix `1aab2da2a27704da`, 6 sources, 7 documents, 0 acknowledgements, 0 errors, and 0 warnings. |
| 2026-05-15 | SaaS production build | `NEXT_DIST_DIR=.next-build npm run build` passed and included `/api/admin/knowledge/regulation-governance/acknowledgements`. |
| 2026-05-15 | Local HTTP auth boundary | `next start` on port 3011 returned 401 for unauthenticated GET and POST to the acknowledgement API. |
| 2026-05-15 | Browser assistant release gate | `npm run release:check` passed with expected local-origin/signing metadata warnings only. |

## Decision Notes

- Acknowledgements are append-only audit events, matching the provider execution package review-note pattern.
- A package digest is computed from the current governance snapshot so the UI can record exactly what validation state was reviewed.
- The POST route returns a refreshed governance report so the panel can update acknowledgement count and latest-review state immediately.

## Residual Risks

- Authenticated browser rendering was not exercised because local `/admin/knowledge` requires an admin session; build, service, route, and auth-boundary checks were recorded.
- Acknowledgement records do not yet change production-import gating; they are review evidence only.
- Source-by-source reviewer workflow remains a future slice.

## Next Candidate Slice

1. Embedding provider/backfill plan for `file_analysis_chunks`.
2. Crop artifact retention/delete controls.
3. Source-by-source legal-source governance review workflow.
