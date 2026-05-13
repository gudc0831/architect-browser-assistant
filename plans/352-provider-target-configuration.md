# Slice 352: Provider target configuration

## Product Context

Slice 352 follows persisted Knowledge export audit. `PLAN.md` remains product direction only; this slice records the concrete provider target configuration step.

## Goal

Allow admins to configure approved WIKI sync targets before provider adapters can be previewed.

## Scope

- Add server-side target configuration using append-only audit events.
- Support portable archive, Obsidian, Notion, and assistant retrieval targets.
- Keep defaults disabled and dry-run only.
- Expose config read/write through admin Knowledge APIs.

## Status

Implemented as part of the Slice 352-361 provider target and preview batch.

## Verification

Covered by the batch typecheck, lint, API, and Browser UI validation.
