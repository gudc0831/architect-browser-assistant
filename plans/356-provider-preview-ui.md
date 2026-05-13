# Slice 356: Provider preview UI

## Product Context

Slice 356 exposes provider dry-run preview creation in the Admin Knowledge export/sync panel.

## Goal

Let admins create a provider preview only after a provider-ready audit exists.

## Scope

- Add preview confirmation input.
- Disable preview action when there is no provider-ready audit.
- Show preview destination, operations, and warnings.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
