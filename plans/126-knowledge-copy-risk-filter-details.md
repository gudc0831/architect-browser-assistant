# Slice 126: Knowledge Copy Risk Filter Details

## Product Context

The risk filter handoff should carry the actual visible warning and ready context, not just group counts, so another admin can continue review without reconstructing the screen.

## Goal

Include visible risk group warning and ready details in the `Copy risk filter` handoff.

## Scope

- Add per-group Markdown sections to the copied risk filter handoff.
- Include visible warning labels and details.
- Include no-warning guidance for ready groups.
- Include compact ready-note labels for the visible groups.

## Acceptance Criteria

1. `Copy risk filter` includes candidate and task context.
2. Copied text includes the active risk group and visible/total group count.
3. Copied text includes warning labels and details for visible warning groups.
4. Copied text includes no-warning guidance and ready labels for visible ready groups.
5. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copied risk filter detail content.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: `GET /api/admin/knowledge/candidates` returned 200.
- 2026-05-13: Browser UI verification confirmed `Copy risk filter` includes Evidence warning details and ready-note labels; `/api/project/changes` returned the known unrelated 500 during page load.
