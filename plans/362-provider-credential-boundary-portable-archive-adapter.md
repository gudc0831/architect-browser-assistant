# Slice 362: Provider credential boundary and portable archive adapter

## Product Context

Approved WIKI export and provider previews are now persisted through server audit records. The next step is to allow one guarded execution path without exposing provider secrets to browser code or skipping the dry-run preview boundary.

## Goal

Add provider credential boundaries and the first guarded external-write adapter for approved WIKI sync.

## Scope

- Store only a server-side credential reference in provider target config metadata.
- Reject raw-looking secret values from the browser-facing config API.
- Require a fresh provider preview audit id before execution.
- Add a server-side provider execution API with append-only audit records.
- Enable the first adapter only for `portable_archive`; keep Notion, Obsidian, and retrieval writes blocked for later slices.
- Update `/admin/knowledge` so admins can save credential references, create previews, execute the portable archive adapter, and copy execution reports.

## Implementation Decisions

- `PLAN.md` remains unchanged because the product direction already says SaaS owns credentials, audit logs, and sync governance.
- The first write adapter is `portable_archive` rather than Notion or Obsidian. This validates the execution contract and audit boundary without requiring third-party credential storage or remote side effects.
- Browser UI accepts `credentialRef` only as an opaque server secret reference. It never accepts or displays raw secrets.
- Provider execution requires `EXECUTE_APPROVED_WIKI_SYNC`, a fresh dry-run preview from the last 24 hours, a `provider_ready` export audit, enabled execution, and an append-only execution audit record.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added provider preview listing and provider execution GET/POST routes. |
| Provider config boundary | implemented | Added `credentialRef` and `credentialStatus`; raw-looking secrets are rejected. |
| Admin UI | implemented | Added credential reference, execution confirmation, execute archive, and copy execution controls. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | implemented | typecheck, lint, API validation, and Browser UI validation recorded in this slice. |

## Verification Log

- `architect-saas`: `npm run typecheck` passed.
- `architect-saas`: `npm run lint` passed with 7 pre-existing React Hook warnings in task components unrelated to this slice.
- `architect-browser-assistant`: `npm run typecheck` passed.
- `architect-browser-assistant`: `npm run lint` passed.
- `architect-saas`: API validation passed for sync target credential refs, raw-secret rejection, provider-ready export audit, preview creation, blocked execution confirmation, and successful portable archive execution.
- `architect-saas`: Browser UI validation passed for provider target controls, preview creation, portable archive execution, and provider panel overflow correction.

## Out of Scope

- Real Notion API writes.
- Real Obsidian vault file writes.
- Retrieval index mutation.
- Secret manager integration beyond the opaque `credentialRef` boundary.

## Next Candidate

Add provider-specific secret storage integration and enable the next guarded adapter only after the portable archive execution audit boundary is stable.
