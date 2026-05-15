# 472. File Analysis Embedding Backfill Plan

Created: 2026-05-15
Parent: `../PLAN.md`
Related: `466-file-analysis-chunk-vector-rerank.md`, `471-legal-source-governance-acknowledgement-records.md`
Status: `implemented_verified`

## Goal

Provide a safe dry-run planning surface for populating `file_analysis_chunks.embedding` without calling an embedding provider or mutating production data.

## Scope

1. Add a read-only SaaS CLI that reports `file_analysis_chunks` embedding coverage.
2. Report provider/model/dimension/batch configuration from environment variables.
3. Count total chunks, embedded chunks, missing embeddings, project/file/analysis coverage, source/verification groups, and sample missing chunks when the database is available.
4. Fall back to the regulation fixture chunk baseline when the database is unavailable.
5. Keep future execution gated by explicit blockers for missing database, missing provider, or non-1536 dimensions.
6. Record paired SaaS and planning worklogs.

## Out Of Scope

- Calling OpenAI or another embedding provider.
- Writing embeddings into `file_analysis_chunks`.
- Scheduling a production job.
- Changing retrieval scoring or removing text-hybrid fallback.
- Adding admin UI for chunk inspection.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Dry-run backfill planning CLI | implemented | `architect-saas` | `npm run file-analysis:embedding:plan -- --sample-limit 2` passed |
| JSON plan output | implemented | `architect-saas` | `npm run file-analysis:embedding:plan -- --json --sample-limit 0` passed |
| Provider/dimension gates | implemented | `architect-saas` | local run reported disabled provider and 1536 dimensions |
| DB unavailable blocker | implemented | `architect-saas` | local run reported missing `DATABASE_URL` as a blocker without mutation |
| Retrieval baseline unchanged | implemented | `architect-saas` | `npm run retrieval:hybrid:validate` passed |
| Roadmap/worklog | implemented | both repos | `npm run release:check` passed in browser-assistant after rerun |

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-15 | Dry-run text output | `npm run file-analysis:embedding:plan -- --sample-limit 2` passed; local environment reported `DATABASE_URL` missing and provider disabled as blockers. |
| 2026-05-15 | Dry-run JSON output | `npm run file-analysis:embedding:plan -- --json --sample-limit 0` passed; fixture baseline returned 7 chunks. |
| 2026-05-15 | SaaS typecheck | `npm run typecheck` passed. |
| 2026-05-15 | SaaS lint | `npm run lint` passed. |
| 2026-05-15 | Retrieval baseline | `npm run retrieval:hybrid:validate` passed: regulation 6/6, projectDocuments 6/6. |
| 2026-05-15 | SaaS production build | `NEXT_DIST_DIR=.next-build npm run build` passed. |
| 2026-05-15 | Browser assistant release gate | First run hit the known Vitest `/@fs/D:/...` sandbox path issue; standalone `npm run test` then `npm run release:check` passed with expected local-origin/signing metadata warnings only. |

## Decision Notes

- The first embedding slice is deliberately dry-run only because provider cost, key ownership, production DB target, and replay policy must be confirmed before mutation.
- The plan enforces `vector(1536)` compatibility before a future backfill can execute.
- `--strict` is available for future CI/ops use when blockers should fail the command, while the default planning command exits successfully with blockers listed.

## Residual Risks

- No embeddings are generated or stored yet.
- Local validation could not count production chunks because `DATABASE_URL` is not configured in this sandbox.
- Future execution still needs provider key handling, rate limits, retry policy, and write audit records.

## Next Candidate Slice

1. Crop artifact retention/delete controls.
2. Source-by-source legal-source governance review workflow.
3. Embedding execution worker for `file_analysis_chunks.embedding` after provider/DB credentials are approved.
