# Slice 211: Download approved WIKI JSON package

## Product Context

Slices 201-300 continue from the approved WIKI readback surface by making approved entries portable as JSON or Markdown packages. `PLAN.md` remains product direction only; this file records implementation detail for this slice.

## Goal

Download visible or selected approved items as a JSON package.

## Scope

- Approved WIKI export/sync readiness inside the admin readback surface.
- Browser-side JSON and Markdown package creation, copied manifests/checklists, and readiness checks as applicable to this slice.
- Documentation, worklog, API, typecheck, lint, and Browser UI verification for the completed batch.

## Acceptance Criteria

1. The approved WIKI export flow supports this slice without adding a new storage source or server-side sync mutation.
2. Packages preserve item ids, approval metadata, tags, scope, Markdown body, filter scope, and source lineage where relevant.
3. The user guide and worklogs capture the changed workflow.
4. Verification covers typecheck, lint, API status, and Browser UI behavior for the batch.

## Implementation Notes

- Status: implemented
- Main implementation repo: `architect-saas`
- Planning repo: `architect-browser-assistant`
- Decision: keep export generation browser-side from `/api/admin/knowledge/items`; defer external sync execution to a later slice.

## Verification Log

- 2026-05-13: Included in the Slice 201-300 approved WIKI export/sync readiness verification batch.
