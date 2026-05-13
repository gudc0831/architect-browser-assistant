# Slice 354: Provider-ready audit status

## Product Context

Slice 354 connects provider target configuration to persisted Knowledge export audits.

## Goal

Allow guarded sync audit state to advance to provider-ready only when the selected target is configured and execution is not dry-run only.

## Scope

- Re-read provider target configuration on server-side export audit creation.
- Keep blocked/provider-blocked states when confirmation, readiness, or config is missing.
- Preserve no-external-write behavior.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
