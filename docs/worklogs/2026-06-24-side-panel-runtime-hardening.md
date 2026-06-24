# Side Panel Runtime Hardening

Date: 2026-06-24

## Scope

- Reviewed side-panel assistant behavior against the SaaS in-page assistant.
- Excluded file OCR/crop and Yjs cell-document fallback by request and prior scope decision.
- Focused on failures that made side-panel actions behave differently from the in-page panel.

## Findings

- The side panel directly calls SaaS APIs from the extension context. SaaS routes require request integrity and project/user guards, so local or Preview environments must allow the extension origin or these calls can fail while the in-page panel works same-origin.
- Mock mode previously used a fallback evidence path after SaaS retrieval failure, but the generated fallback result could still proceed toward record save/approval.
- Review session detail could open a saved answer without restoring task context, which could break approval/defer controls.
- Manual context refresh used the active browser tab first, which could read `/board` after the side panel was launched from `/daily`.

## Changes

- Kept Mock fallback for development verification, but marked it as fallback-only and disabled review record save, approval/defer, task update, and follow-up task actions for that generated result.
- Added a persistent warning message when Mock fallback is used so generation success does not hide the SaaS retrieval/origin problem.
- Added try/catch around summary approval/defer save so API failures surface in the panel.
- Restored task context when opening review-session detail if current task context is absent.
- Changed task-context refresh to prefer the stored `sourceTabId` before falling back to the active tab.
- Hardened SaaS client response parsing for non-JSON, HTML, 401, and 403 responses.

## Remaining Boundaries

- Full in-page-equivalent same-origin API bridging from side panel to page context is not implemented in this pass. The practical contract remains: configure `ARCHITECT_ASSISTANT_EXTENSION_ORIGINS` for direct extension API access, or use the in-page panel for blocked guarded writes.
- File OCR/crop remains excluded.
- Yjs cell-document mutation fallback remains excluded.

## Verification

- `npx vitest run src/side-panel/App.test.tsx` passed, 13 tests.
- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts src/side-panel/App.test.tsx` passed, 4 files / 51 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
