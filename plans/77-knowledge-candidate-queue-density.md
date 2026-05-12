# Slice 77: Knowledge Candidate Queue Density

## Product Context

The candidate queue now carries more controls and context. Reviewers need a compact row mode for scanning more candidates without losing core risk signals.

## Goal

Add candidate queue density controls to `/admin/knowledge`.

## Scope

- Add `Detailed queue` and `Compact queue` controls.
- Preserve candidate state, title, and risk chips in compact mode.
- Hide secondary project/task metadata in compact mode.
- Keep detail panel behavior unchanged.

## Acceptance Criteria

1. `/admin/knowledge` exposes `Knowledge candidate queue density controls`.
2. `Detailed queue` shows project/task metadata.
3. `Compact queue` hides project/task metadata.
4. Compact rows retain state, title, confidence/review/cleanup chips.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- `GET /api/admin/knowledge/candidates`
- Browser UI verification for candidate queue density controls.

## Implementation Notes

- SaaS commit: pending
- Browser assistant planning commit: pending
