# Slice 351: Persisted Knowledge export audit

## Product Context

Slice 351 continues from the approved WIKI guarded local sync history work. `PLAN.md` remains product direction only; this document records the implementation detail for the next concrete slice.

## Goal

Persist approved WIKI export/sync attempts as server-side admin audit events and keep provider execution guarded by confirmation, lineage, readiness, and target configuration.

## Scope

- Add a Knowledge export audit API under the SaaS admin boundary.
- Store export/sync dry-run and guarded execution attempts in existing `assistant_audit_events`.
- Validate that requested item ids are approved WIKI items before writing audit metadata.
- Recompute readiness and source lineage server-side rather than trusting browser-only state.
- Keep provider execution blocked unless target configuration and explicit execution enablement exist.
- Update Admin Knowledge UI to load/copy persisted audit history.
- Update user guide, slice roadmap, and worklogs.

## Acceptance Criteria

1. `GET /api/admin/knowledge/export-audits` returns persisted Knowledge export/sync audit records.
2. `POST /api/admin/knowledge/export-audits` persists dry-run, blocked, provider-blocked, or provider-ready audit state.
3. The POST path rejects unapproved item ids and records only approved WIKI lineage metadata.
4. `Run guarded sync` still requires `SYNC_APPROVED_WIKI` and all readiness checks before provider state can advance.
5. Provider execution does not run unless target configuration and explicit execution enablement are present.
6. Browser UI shows persisted server audit history and still supports copy/clear-local-view review workflows.
7. Typecheck, lint, API validation, and Browser UI validation are completed before commit.

## Implementation Status

Current implementation status: `implemented`

| Item | Status | Related commit | Worklog | Verification |
| --- | --- | --- | --- | --- |
| Slice 351 PRD | complete | pending | pending | document created |
| Server export audit API | complete | pending | pending | `GET/POST /api/admin/knowledge/export-audits` verified |
| Admin UI persisted audit integration | complete | pending | pending | Browser UI and Playwright validation passed |
| User guide/worklogs | complete | pending | pending | user guide/worklogs updated |
| Verification | complete | pending | pending | typecheck, lint, API, Browser UI |

## Implementation Decisions

- Reuse `assistant_audit_events` rather than adding a new table because this is append-only admin audit metadata.
- Add event type and target type filters to repository list calls so Knowledge export audit records do not mix with assistant action governance records.
- Store `provider_blocked` when target configuration is absent; this keeps the sync path provider-aware without making unsafe external writes.
- Treat `Clear local history` as a view-level action only; server audit remains append-only.

## Testing Decisions

- API validation covers list and POST dry-run/provider-blocked paths.
- Browser UI validation covers persisted dry-run creation, guarded sync provider-blocked creation, copy history, clear-local-view, and mobile presence.

## Out of Scope

- Actual Notion, Obsidian, assistant retrieval, or archive file delivery providers.
- Provider credential management UI.
- Deleting server-side Knowledge export audit events.

## Further Notes

- The next slice should add explicit provider target configuration and a minimal provider adapter once this persisted audit contract is stable.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-13 | SaaS typecheck | `npm run typecheck` passed. |
| 2026-05-13 | Browser assistant typecheck | `npm run typecheck` passed. |
| 2026-05-13 | SaaS lint | `npm run lint` passed with 7 pre-existing React Hook warnings in task components. |
| 2026-05-13 | Browser assistant lint | `npm run lint` passed. |
| 2026-05-13 | API validation | `/api/admin/knowledge/export-audits` GET passed; POST dry-run passed; POST execute returned `provider_blocked`; unapproved item id returned 400. |
| 2026-05-13 | Browser UI validation | Admin Knowledge loaded persisted server audit history, created dry-run/provider-blocked audit records through UI, copied history report, and rendered desktop/mobile guarded sync history without overflow. |
