# Slice 357: Provider preview report

## Product Context

Slice 357 makes provider previews handoff-ready for governance review.

## Goal

Provide a copyable provider preview report with audit id, target, package, operations, and warnings.

## Scope

- Add report generation for provider preview results.
- Preserve dry-run-only warning text.
- Keep copied report independent from external provider credentials.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
