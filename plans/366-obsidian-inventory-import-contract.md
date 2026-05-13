# Slice 366: Obsidian inventory import contract

## Product Context

Slice 365 added an Obsidian reconciliation package, but without a remote inventory every selected WIKI item is planned as a create. Before live writes can be considered, admins need a sanitized read-only inventory contract that lets reconciliation compare planned paths and digests against existing remote files.

## Goal

Add a read-only Obsidian remote inventory import contract so reconciliation can distinguish create, update, delete, and noop without enabling live vault writes.

## Scope

- Accept sanitized Obsidian inventory manifest metadata in provider target configuration.
- Store only path, optional item id/source task id, digest, and updated timestamp.
- Ignore file contents, raw text, credentials, and unsupported manifest fields.
- Compare approved WIKI reconciliation paths/digests against inventory entries.
- Produce create/update/delete/noop summary counts and operations.
- Show inventory status and warnings in `/admin/knowledge`.
- Keep live vault writes disabled.

## Implementation Decisions

- `PLAN.md` remains unchanged because this is implementation detail under the existing provider sync governance direction.
- Inventory input is a JSON manifest in Admin UI/API, not a live vault connector.
- Delete intents are limited to inventory entries that declare `managedBy: "approved_wiki"` or live under the managed `approved-wiki/` prefix, so unrelated vault files are not treated as deletion candidates.
- File content fields are ignored and never returned in API responses.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Sanitized inventory manifest metadata is stored in target config and used for path/digest comparison. |
| Admin UI | implemented | Provider target controls show inventory status/warnings and accept a JSON manifest textarea. |
| Documentation | implemented | User guide, roadmap, and worklogs document the inventory contract. |
| Verification | completed | typecheck passed, lint passed with pre-existing warnings, API validation passed, and Browser UI validation passed. |

## Verification Log

- API validation passed for inventory sanitization, readback, and create/update/delete/noop reconciliation on 2026-05-13 14:25 KST.
- Browser UI validation passed for `/admin/knowledge` inventory status, manifest textarea, and provider preview reconciliation counts on 2026-05-13 14:25 KST.
- `npm run typecheck` passed.
- `npm run lint` passed with 7 pre-existing React hook warnings outside this slice.

## Out of Scope

- Connecting directly to an Obsidian vault.
- Reading or storing Markdown file contents.
- Executing live create/update/delete operations.
- Inventory contracts for Notion or assistant retrieval.

## Next Candidate

Add a guarded Obsidian live-write feature flag and rollback execution preflight, still disabled by default.
