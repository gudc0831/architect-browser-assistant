# Slice 353: Provider target config UI

## Product Context

Slice 353 makes provider target configuration visible in Admin Knowledge without splitting it from the server config contract.

## Goal

Let admins save selected sync target enablement, dry-run-only state, and notes from the export/sync panel.

## Scope

- Show selected target configuration state.
- Add target enabled and dry-run-only controls.
- Save configuration to server audit history.
- Keep the UI responsive on desktop and mobile.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
