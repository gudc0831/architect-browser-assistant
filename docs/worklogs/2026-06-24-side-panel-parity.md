# Side Panel Task Assistant Parity

Date: 2026-06-24

## Scope

- Aligned the Chrome side panel task assistant with the SaaS in-page AI review panel.
- Excluded file OCR and browser crop workflows by user request.
- Kept SaaS in-page panel code unchanged; work is limited to the extension side panel and SaaS client contract.

## Changes

- Added review-session list and external-evidence list API reads to the extension SaaS client.
- Changed `검토기록저장` to save through `/api/assistant/review-sessions` so records appear in the same recent review history as the SaaS panel.
- Added advanced-mode sections for recent review history, execution mode, existing external evidence, and default review instruction.
- Kept basic mode compact while still showing evidence count/readiness summary after retrieval.
- Added editable summary fields for conclusion, tags, scope, and follow-up action.
- Added the approval acknowledgement gate: `작업 기록 승인` stays disabled until the user checks `검토내용을 확인하고 승인해주세요.`
- Added `SaaS API` execution mode using `/api/assistant/task-review`.
- Propagated the default task assistant review instruction to both local/mock runtime and SaaS API generation.
- Synced `basic`/`advanced` mode from SaaS broadcasts when provided.
- Added approved-summary task update and follow-up task creation proposals.
- Added action-audit writes for task update and follow-up task creation.
- Added conflict/direct-write-block messages for task mutation failures.
- Added a `로컬 Codex 로그인` advanced-mode diagnostic section that checks the extension native runtime status and capabilities from the side panel.
- Changed the unset default execution mode to `Local Codex` to match the SaaS in-page panel while preserving any saved user choice.
- Passed retrieval detail into Local Codex generation, including legal evidence, project context chunks/trace, and evidence readiness warnings.
- Added review-session detail loading from `/api/assistant/review-sessions/:id`, including saved/latest evidence counts and full saved answer text.
- Added a separate advanced-mode `파일 근거` section for already-retrieved `project_document` evidence, limited to title/source display and excluding OCR/crop controls.

## Review

- `ch` design/UX review found approval gating, duplicate action placement, evidence summary visibility, and mode sync gaps.
- `ul` read-only audit found that generic `/api/assistant/records` saves would not populate SaaS recent review history. The save path was changed to `/api/assistant/review-sessions`.

## Failure Learning

- failure: `npm run lint` failed on synchronous `setState` inside the task-support-data `useEffect`.
- cause: loading/list reset state was being set directly in the effect body.
- fix: removed immediate loading/list state mutations and only update state from async API callbacks.
- evidence: `npm run lint` passed after the change.
- prevention: when adding side-panel data-loading effects, avoid direct synchronous state writes in the effect body; use initial state and async callback updates.

## Verification

- `npx vitest run src/side-panel/App.test.tsx` passed, 12 tests.
- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts src/side-panel/App.test.tsx` passed, 4 files / 50 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `dist/manifest.json` contains both `http://localhost:3000/*` and the configured Vercel Preview origin.

## Remaining Differences

- File OCR and browser crop workflows remain excluded by request. Non-OCR project document evidence returned by retrieval is displayed in the side panel.
- If SaaS cell-document mode blocks direct `decision` writes, the side panel reports that the user should apply the task record update in the in-page panel. The fallback cell-document update API requires Yjs update payloads and is intentionally not reimplemented inside the extension in this pass.
- The side panel still mirrors the SaaS panel through extension APIs/messages rather than directly rendering the SaaS React component, which is the expected Chrome extension boundary.
