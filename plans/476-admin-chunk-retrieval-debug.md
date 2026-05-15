# 476 Admin Chunk Retrieval Debug

Status: `implemented`

## Scope

Expose `file_analysis_chunks` coverage, missing embeddings, source/verification grouping, FTS debug hits, and vector readiness in Knowledge admin.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Read-only debug service | implemented | `architect-saas` | `getFileAnalysisChunkDebugReport()` reads coverage and optional FTS hits. |
| Admin API | implemented | `architect-saas` | `GET /api/admin/knowledge/file-analysis-chunks` returns `{ data }` for the admin shell. |
| Admin UI | implemented | `architect-saas` | `/admin/knowledge` shows chunk coverage, blockers, and retrieval debug rows. |
| CLI validation | implemented | `architect-saas` | `npm run file-analysis:chunks:debug` mirrors the API report. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` in `architect-saas` | passed |
| `npm run file-analysis:chunks:debug -- --json --sample-limit 0` | passed with `database unavailable` blocker because the configured DB is missing `file_analysis_chunks` |

## Blocked Operations

Live chunk counts and retrieval hits require the configured database to contain `file_analysis_chunks` and related file rows.
