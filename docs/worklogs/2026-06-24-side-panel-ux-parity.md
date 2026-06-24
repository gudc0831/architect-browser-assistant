# Side Panel UX Parity

Date: 2026-06-24

## Scope

- Reviewed the Chrome side panel against the in-page SaaS assistant panel from a UX and functional-parity perspective.
- Kept excluded areas out of scope: file OCR/crop workflows and heavy cell-document fallback behavior.
- Focused on issues that made the side panel feel inconsistent, misleading, or harder to operate than the in-page assistant.

## Findings

- Basic and advanced mode behavior was not persisted, so returning to the side panel could reset the user's preferred density.
- Several advanced hints relied on hover-only text, which is weak for keyboard and touch users.
- Some user-facing strings exposed implementation terms such as mock fallback, extension origins, and development host details.
- Evidence in basic mode was too hidden after prior simplification; users still need title and source-open affordances without seeing full diagnostic detail.
- Approval/defer and task mutation actions could be clicked repeatedly while pending, increasing duplicate-save risk.
- Raw audit text and high-impact task mutation controls were too prominent for normal review flow.

## Changes

- Persisted the basic/advanced display mode with safe extension storage.
- Replaced hover-only explanatory hints with accessible expandable help controls.
- Reworded runtime and connection messages into user-facing language while keeping technical detail available only where useful.
- Restored compact basic-mode evidence visibility with title and source link only; detailed evidence diagnostics remain advanced-only.
- Added pending guards for summary approval, defer save, task field update, and follow-up task creation.
- Moved raw audit text behind an explicit details control and separated optional post-approval task actions from the main approval flow.
- Reduced duplicated task identity in the side-panel header and kept extra project/page context in advanced mode.
- Added visual differentiation for advanced sections so advanced-only controls do not read as the same layer as basic review controls.

## Verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npx vitest run src/side-panel/App.test.tsx src/background/service-worker.test.ts src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts` passed, 4 files / 52 tests.
- `npm run build` passed.
- `git diff --check -- src\side-panel\App.tsx src\side-panel\App.test.tsx src\side-panel\styles.css src\storage\safe-storage.ts dist\manifest.json` passed with only existing line-ending warnings.

## Push Status

- Local commit is prepared separately from push.
- Push target must be confirmed by the user before pushing.
