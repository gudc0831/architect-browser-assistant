# Slice 365: Obsidian reconciliation package

## Product Context

Slice 364 made provider credential registry and remote write readiness visible without enabling live provider writes. The next safe step is a provider-specific dry-run reconciliation package that shows the exact Obsidian Markdown file plan before any vault mutation exists.

## Goal

Add an Obsidian live-write dry-run reconciliation package to provider previews and executions, while keeping real vault writes disabled.

## Scope

- Add structured reconciliation package metadata to provider previews and executions.
- For Obsidian, list deterministic Markdown file paths, item ids, source task ids, create intent, and content digests.
- Summarize create/update/delete/noop counts even though this slice only plans create operations because there is no remote vault inventory yet.
- Include a copyable reconciliation section in the Admin UI provider preview/execution reports.
- Keep live Obsidian vault writes disabled.
- Update user guide, roadmap, and worklogs.

## Implementation Decisions

- `PLAN.md` remains unchanged because this is implementation detail under the provider audit and sync governance direction.
- Obsidian paths are derived from approved WIKI titles and item ids for stable, reviewable filenames.
- The package uses `create` intent for selected approved WIKI items because no remote inventory comparison is available yet.
- Update/delete reconciliation is represented in summary counts and warnings as unavailable until a future remote inventory slice.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added reconciliation package metadata to provider preview and execution records. |
| Admin UI | implemented | Shows reconciliation rows and includes them in copied reports. |
| Documentation | implemented | Updated guide, roadmap, and worklogs. |
| Verification | implemented | typecheck, lint, API validation, and Browser UI validation completed on 2026-05-13. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed with 7 pre-existing React hook warnings in task components.
- API route validation passed for Obsidian reconciliation package name, create count, planned path, source task id, content digest, and execution package copy.
- Browser UI validation passed for provider preview rendering of reconciliation package name, create/update counts, planned path intent, and dry-run warning.

## Out of Scope

- Reading a real Obsidian vault inventory.
- Updating, deleting, or writing files in a vault.
- Enabling live provider writes.
- Notion or assistant retrieval reconciliation packages.

## Next Candidate

Add a read-only Obsidian remote inventory import contract so future reconciliation can distinguish creates, updates, deletes, and noops before live writes.
