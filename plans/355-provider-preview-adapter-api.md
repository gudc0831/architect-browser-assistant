# Slice 355: Provider preview adapter API

## Product Context

Slice 355 introduces minimal provider adapters after export audits can become provider-ready.

## Goal

Create dry-run provider previews using a persisted export audit id as the execution boundary.

## Scope

- Add provider preview API under admin Knowledge.
- Require provider-ready audit id and preview confirmation.
- Generate adapter-specific operations without external writes.
- Persist preview attempts in audit history.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
