# Slice 364: Provider credential registry readiness

## Product Context

Slice 363 added provider-specific credential metadata and enabled an Obsidian guarded execution adapter that writes only an append-only server audit manifest. Before any live remote provider write is enabled, admins need a server-side readiness view that distinguishes UI-entered opaque pointers from deployment-managed secret-manager credentials and checks rollback/reconciliation controls.

## Goal

Add provider credential registry metadata and remote write readiness controls without enabling live external provider writes.

## Scope

- Read provider credential registry metadata from server-side configuration.
- Expose only opaque credential refs, store kind, validation timestamp, rotation due timestamp, rollback plan ref, reconciliation plan ref, readiness status, and blockers.
- Treat secret-manager backed entries as stronger readiness than UI-entered target config refs.
- Add remote write readiness chips to `/admin/knowledge` provider target configuration.
- Keep provider execution as append-only audit manifest only.
- Update user guide, roadmap, and worklogs.

## Implementation Decisions

- `PLAN.md` remains unchanged because this is implementation detail under the existing credential and audit governance direction.
- The registry is represented by server-only metadata in `KNOWLEDGE_SYNC_CREDENTIAL_REGISTRY_JSON`; the field must not carry raw secret material.
- Remote write readiness requires enabled target, execution allowed, configured credential, `secret_manager` store, rollback plan ref, and reconciliation plan ref.
- Passing readiness does not enable live writes in this slice. It only records whether the deployment prerequisites are satisfied.

## Implementation Status

| Area | Status | Notes |
| --- | --- | --- |
| SaaS service/API | implemented | Added registry parsing and readiness fields to sync target config responses. |
| Admin UI | implemented | Shows store kind, remote write readiness, control-plan refs, and blockers. |
| Documentation | implemented | Updated guide, roadmap, and worklogs. |
| Verification | implemented | typecheck, lint, API validation, and Browser UI validation completed on 2026-05-13. |

## Verification Log

- `npm run typecheck` passed in `architect-saas`.
- `npm run lint` passed with 7 pre-existing React hook warnings in task components.
- API route validation passed for `secret_manager` registry precedence, rollback/reconciliation readiness, provider preview warnings, and audit-manifest execution warnings.
- Browser UI validation passed for `/admin/knowledge` provider target rendering with `Store secret_manager`, `Remote write ready`, rollback/reconciliation chips, validation timestamp, and the live-write-disabled notice.

## Out of Scope

- Storing actual secret values.
- Connecting to an external secret manager SDK.
- Writing to live Obsidian vaults, Notion pages, or retrieval indexes.
- Changing the existing confirmation phrases.

## Next Candidate

Add a live-write adapter dry-run reconciliation package for one provider, still gated behind explicit deployment flags and rollback metadata.
