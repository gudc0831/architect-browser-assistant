# 466. File Analysis Chunk Vector Rerank

Created: 2026-05-14
Parent: `../PLAN.md`
Related: `458-project-document-retrieval-ranking.md`, `461-postgres-hybrid-retrieval-indexing.md`, `465-pdf-raster-and-crop-ocr.md`
Status: `implemented_verified`

## Goal

Move project-document retrieval from metadata-only JSON scans toward a dedicated chunk index that supports Postgres FTS now and pgvector rerank when embeddings are populated.

## Why This Slice

Slice 461 improved ranking by using Postgres FTS over JSON metadata, but the remaining search-quality risk was scale and rerank precision. Long extracted documents, OCR text, and crop/PDF OCR outputs need chunk-level indexing so retrieval can rank relevant passages without loading or scanning entire file-analysis blobs.

## Scope

1. Add a `file_analysis_chunks` Postgres table.
2. Include `embedding vector(1536)` for pgvector-backed rerank.
3. Add chunk generation from file analysis summary/tags/text.
4. Sync chunks whenever Postgres file metadata analysis is updated.
5. Prefer chunk search in `FileRepository.searchFileAnalyses()` when the table exists.
6. Keep metadata JSON hybrid fallback when the table/migration is absent.
7. Extend retrieval validation to cover deterministic chunk generation.

## Out Of Scope

- Calling an embedding provider.
- Backfilling all existing production file analyses.
- UI for chunk inspection.
- Removing the JSON metadata fallback.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| Prisma schema model | implemented | `architect-saas` | `npm run db:generate` passed |
| SQL migration with pgvector column/index | implemented | `architect-saas` | schema generation passed |
| deterministic chunk builder | implemented | `architect-saas` | `npm run retrieval:hybrid:validate` passed |
| Postgres chunk sync on metadata update | implemented | `architect-saas` | `npm run typecheck` passed |
| chunk-first repository search | implemented | `architect-saas` | `npm run typecheck` passed |
| metadata fallback | implemented | `architect-saas` | existing retrieval validation passed |
| roadmap/worklogs | implemented | both | this document plus worklogs updated after full gates |

## Route / Service / Repository Check

- Domain: `architect-saas/src/domains/file/search.ts` now exposes `buildFileAnalysisChunks()`.
- Repository contract: `SearchFileAnalysesInput` accepts optional `queryEmbedding`.
- Postgres repository: `searchFileAnalyses()` tries `file_analysis_chunks` first, then falls back to JSON FTS/lexical search.
- Postgres repository: `updateFileMetadata()` calls `syncFileAnalysisChunks()` after saving metadata.
- Migration: `prisma/migrations/202605140001_add_file_analysis_chunks/migration.sql` creates pgvector extension, chunk table, FTS index, and vector index.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-14 | Prisma generation | `npm run db:generate` passed |
| 2026-05-14 | SaaS compile | `npm run typecheck` passed |
| 2026-05-14 | retrieval quality baseline | `npm run retrieval:hybrid:validate` passed: regulation 6/6, projectDocuments 6/6, chunks generated |
| 2026-05-14 | SaaS full gates | `npm run lint` passed with existing hook warnings; `npm run build` passed with one existing Turbopack trace warning |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` passed |

## Residual Risks

- Embedding generation/backfill is not implemented; the vector column is ready but will stay null until a provider/backfill slice populates it.
- Migration requires pgvector availability in the target Postgres environment.
- Existing metadata-only analyses need a backfill command or a metadata touch to populate chunks.
- Chunk inspection/admin tooling is still absent.

## Next Candidate Slice

1. Embedding provider/backfill for `file_analysis_chunks.embedding`.
2. Admin chunk inspection and retrieval debug panel.
3. Production migration dry-run against the target Postgres image with pgvector enabled.
