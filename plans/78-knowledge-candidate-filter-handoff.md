# Slice 78: Knowledge Candidate Filter Handoff

## Product Context

Candidate queue review is now scoped by state, risk, sort, search, density, and selected candidate. Admins need a copyable summary for operational handoff.

## Goal

Add a candidate filter handoff copy action to `/admin/knowledge`.

## Scope

- Add `Copy filter handoff` near queue filter actions.
- Copy state, risk, sort, search, visible count, and selected candidate.
- Keep the action read-only and clipboard-based.
- Use existing active filter state without API changes.

## Acceptance Criteria

1. `/admin/knowledge` shows `Copy filter handoff`.
2. Copied text includes state, risk, sort, search, and visible count.
3. Copied text includes selected candidate title and id when available.
4. Status text confirms copy success or failure.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for copy filter handoff.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
