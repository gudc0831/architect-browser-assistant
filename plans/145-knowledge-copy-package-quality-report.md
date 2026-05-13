# Slice 145: Knowledge Copy Package Quality Report

## Product Context

When a package is incomplete, the reviewer needs to send a concise quality report without manually retyping each warning.

## Goal

Add a copy action for the approval package quality report.

## Scope

- Add `Copy package quality`.
- Include candidate, task, quality status, ready/missing counts, and check details.
- Confirm copy success through the existing status line.
- Keep the report deterministic and local to current UI state.

## Acceptance Criteria

1. The copy button is visible in the final action area.
2. Clipboard text starts with a package quality heading.
3. Clipboard text includes every quality check.
4. Copy failure falls back to a status message.

## Verification Plan

- `npm run typecheck`
- `npm run lint`
- Browser clipboard verification.

## Implementation Notes

- Status: implemented
- SaaS commit: pending
- Browser assistant planning commit: pending

## Verification Log

- 2026-05-13: `npm run typecheck` passed in `architect-saas`.
- 2026-05-13: `npm run lint` passed in `architect-saas` with 7 pre-existing task Hook warnings unrelated to Knowledge Admin.
- 2026-05-13: `npm run typecheck` passed in `architect-browser-assistant`.
- 2026-05-13: `npm run lint` passed in `architect-browser-assistant`.
- 2026-05-13: Browser clipboard verification clicked `Copy package quality` and confirmed `# Knowledge approval package quality`, `## Quality checks`, draft, decision, evidence, and source coverage rows.
