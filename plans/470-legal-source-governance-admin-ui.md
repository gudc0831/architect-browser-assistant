# 470. Legal Source Governance Admin UI

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `460-regulation-knowledge-foundation.md`, `467-legal-source-governance-refresh.md`
Status: `implemented_verified`

## Goal

Expose the offline regulation governance manifest in Knowledge admin so admins can inspect legal-source refresh status, production-import blocking context, validation errors, and per-source review checklists without running a CLI script.

## Scope

1. Add a read-only Knowledge admin API for the regulation governance report.
2. Reuse the existing offline seed and governance manifest validators.
3. Show source refresh status, due dates, document counts, admin-review counts, and checklist counts in `/admin/knowledge`.
4. Add a copyable Markdown governance report for handoff/review.
5. Record paired SaaS and planning worklogs.

## Out Of Scope

- External legal-source crawling.
- Deployed scheduler or automation.
- Mutating governance manifest dates from the UI.
- Production import execution.
- Embedding provider/backfill work.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Regulation governance report service | implemented | `architect-saas` | `npm run typecheck`, `npx tsx -e ...getRegulationGovernanceReport()` passed |
| `/api/admin/knowledge/regulation-governance` | implemented | `architect-saas` | `npm run build` includes route; unauthenticated HTTP returns 401 |
| Knowledge admin governance panel | implemented | `architect-saas` | `npm run typecheck`, `npm run lint`, `npm run build` passed |
| Copyable governance report | implemented | `architect-saas` | `npm run typecheck`, `npm run lint` passed |
| Roadmap/worklog | implemented | both repos | `npm run release:check` passed in browser-assistant |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | SaaS typecheck | `npm run typecheck` passed after API/UI implementation. |
| 2026-05-15 | SaaS lint | `npm run lint` passed. |
| 2026-05-15 | Governance validator | `npm run regulation:governance:validate` passed; 6 sources scheduled, 0 fail. |
| 2026-05-15 | SaaS production build | `NEXT_DIST_DIR=.next-build npm run build` passed and included `/api/admin/knowledge/regulation-governance`. |
| 2026-05-15 | Governance report service | Direct `getRegulationGovernanceReport()` check returned package `kr-architecture-foundation-2026-05-14`, 6 sources, 7 documents, 0 errors, 0 warnings. |
| 2026-05-15 | Local HTTP auth boundary | `next start` on port 3010 returned 307 from `/admin/knowledge` to `/login?next=%2Fadmin%2Fknowledge`; unauthenticated API returned 401. |
| 2026-05-15 | Browser assistant release gate | `npm run release:check` passed with expected local-origin/signing metadata warnings only. |

## Decision Notes

- The API is read-only and uses the existing offline seed package plus governance manifest. It does not fetch official sites.
- The admin UI deliberately keeps production import blocked unless the manifest enables it; this slice surfaces the blocker instead of bypassing it.
- Source rows show review/checklist readiness so the next UI slice can add reviewer workflow without changing the report shape.

## Residual Risks

- The authenticated rendered panel was not browser-validated because local `/admin/knowledge` redirects to login without an admin session; build, service, route, and unauthenticated auth-boundary validation were recorded instead.
- No persisted admin acknowledgement is stored; this is a read-only visibility slice.
- Refresh execution remains deterministic manifest validation, not a deployed scheduler.

## Next Candidate Slice

1. Embedding provider/backfill plan for `file_analysis_chunks`.
2. Crop artifact retention/delete controls.
3. Legal-source governance reviewer acknowledgement records.
