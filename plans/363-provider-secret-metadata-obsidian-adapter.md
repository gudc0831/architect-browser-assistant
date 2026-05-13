# Slice 363: Provider secret metadata and Obsidian adapter

## Product Context

Slice 362 proved that provider execution can be guarded by a provider preview audit id and recorded as an append-only server audit artifact. The next step is to make credential readiness provider-specific and open one additional adapter without exposing secret material to browser code.

## Goal

Add provider-specific server-side credential metadata and enable the next guarded provider adapter for Obsidian Markdown manifest execution.

## Scope

- Add provider credential source metadata to sync target config responses.
- Keep raw secret values out of Admin UI and API responses.
- Allow target-specific server environment credential references to satisfy credential readiness.
- Keep `credentialRef` as an opaque reference only when configured through the Admin UI.
- Enable Obsidian as the next guarded execution adapter after a fresh provider preview.
- Continue to block Notion and assistant retrieval execution until their adapters are explicitly implemented.
- Update `/admin/knowledge` labels so execution is adapter-specific rather than portable-archive-only.

## Implementation Decisions

- `PLAN.md` remains unchanged because this is implementation detail under the existing SaaS credential and audit governance direction.
- The next adapter is Obsidian because it maps naturally to existing Markdown package previews and can be represented as a server audit manifest before any real vault write is enabled.
- Server environment credentials are represented as opaque `env:<NAME>` references. The app reports the source and status, never the secret value.
- Admin-entered `credentialRef` remains an opaque pointer such as `server:obsidian/default`; values that look like raw keys/tokens are rejected.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added credential source/scope metadata and Obsidian execution artifact support. |
| Admin UI | implemented | Execution action now applies to the selected adapter and shows credential source chips. |
| Documentation | implemented | Updated user guide, roadmap, and worklogs. |
| Verification | implemented | typecheck, lint, API validation, and Browser UI validation completed on 2026-05-13. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed with 7 pre-existing React hook warnings in task components.
- API route validation passed for Obsidian target config metadata, raw-secret rejection, provider-ready audit, provider preview, and `obsidian_markdown_manifest` execution.
- Browser UI validation passed for `/admin/knowledge` provider target rendering with `Execute adapter`, credential status/source/scope chips, and Obsidian target selection.

## Out of Scope

- Writing files to a real Obsidian vault.
- Notion page creation.
- Assistant retrieval index mutation.
- Full external secret manager integration beyond opaque server-side references and target-specific env refs.

## Next Candidate

Add a real secret manager-backed credential store and enable remote provider execution only for adapters with deployment-ready rollback/audit controls.
