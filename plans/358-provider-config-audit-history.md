# Slice 358: Provider config audit history

## Product Context

Slice 358 keeps provider target configuration changes auditable.

## Goal

Record provider target configuration changes as append-only audit events.

## Scope

- Store target, enabled state, dry-run-only state, notes, actor, and timestamp.
- Read the latest config per target from audit events.
- Avoid mutable configuration tables in this slice.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
