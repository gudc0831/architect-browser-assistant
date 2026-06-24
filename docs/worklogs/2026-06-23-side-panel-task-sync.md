# Side Panel Task Sync

## Extension Side

### Summary

- Extended `src/runtime/side-panel-contract.ts` with the live side-panel context event/message constants, snapshot types, strict snapshot normalization, broadcast guard, and launch/snapshot conversion helpers.
- Hardened side-panel contract record detection so throwing `getPrototypeOf` proxy traps fail closed instead of escaping from snapshot normalization or broadcast guards.
- Added `normalizeSidePanelContextBroadcastMessage()` and made the broadcast guard replace raw context with a normalized snapshot before returning true, so consumers do not accidentally trust the original unnormalized payload.
- Redacted sensitive URL query parameters during extension URL normalization: `token`, `access_token`, `code`, `refresh_token`, `id_token`, `auth`, and `session`.
- Cleared URL hash fragments during side-panel URL normalization and normalized routes to pathname-only values so route text cannot carry query or fragment tokens.
- Updated `src/content/content-script.ts` to listen for `architect:side-panel-context-updated` `CustomEvent`s and forward valid normalized snapshots to the background worker with `architect:update-side-panel-context`.
- Updated `src/background/service-worker.ts` to store side-panel context per source tab, convert launch requests into stored context snapshots, broadcast valid updates with `architect:side-panel-context-broadcast`, keep the legacy launch-context response path, avoid falling back to another tab's stale latest launch when the active tab has no mapped context, and clear stored tab context when tabs close.
- Added focused `src/background/service-worker.test.ts` coverage for launch storage/opening, passive update storage/broadcast, no passive side-panel opening, legacy launch-context projection, invalid update rejection, and tab-removal fallback.
- Added regression coverage for hash-token stripping, route query/hash stripping, case-insensitive sensitive query names, and multi-tab active-context isolation.
- Extension-side pass did not edit `src/side-panel/App.tsx`, `src/side-panel/styles.css`, or `architect-saas`.

### Verification

- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts`
  - Initial sandboxed attempts failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed after URL/route redaction and multi-tab isolation coverage: 3 test files passed, 38 tests passed.
- `npm run typecheck`
  - Passed: `tsc --noEmit`.

## Side Panel App/UI

### Summary

- Updated `src/side-panel/App.tsx` to subscribe to `chrome.runtime.onMessage` broadcasts for `architect:side-panel-context-broadcast`, normalize incoming payloads before use, and remove the listener on unmount.
- Added a shared side-panel context application path for launch, manual refresh, and live broadcasts.
- Different-task broadcasts now update the selected task identity, persist the last task id, reset task-specific retrieval/generation artifacts, reset the question dirty flag, and apply the incoming review question.
- Same-task broadcasts now update task identity and update the question only when the side-panel draft has not been manually edited; dirty drafts keep the local question and show `SaaS task context updated. Draft question kept.`
- Preserved explicit empty-string broadcast questions in the side-panel application path after shared contract normalization validates the message shape.
- Added a compact visible task identity block and tightened side-panel spacing, button sizing, four-step review row scale, and quiet secondary/advanced block styling in `src/side-panel/styles.css`.
- Updated `src/side-panel/App.test.tsx` Chrome mocks with `runtime.onMessage.addListener/removeListener` support and coverage for launch context, different-task reset, same-task dirty preservation, same-task clean/empty question updates, and manual refresh without broadcasts.
- Did not edit `architect-saas`, `src/runtime/side-panel-contract.ts`, `src/content/content-script.ts`, or `src/background/service-worker.ts`.

### Verification

- `npx vitest run src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 1 test file passed, 6 tests passed.
- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 4 test files passed, 44 tests passed.
- `npm run typecheck`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: `tsc --noEmit`.

## Side Panel App/UI Review Follow-up

### Summary

- Removed the App-local raw `message.context.review.question` reread from broadcast handling; the side panel now consumes the context returned by `normalizeSidePanelContextBroadcastMessage()` directly.
- Added regression coverage showing normalized same-task question text is used after null-byte stripping/length clamping and that raw whitespace-only question text dropped by normalization does not overwrite the existing UI question.
- Added external evidence draft reset on task switches from the shared context application path: collapse the external panel, revoke approval, restore default source/tool values, clear title/URL/excerpt, and show a draft-cleared status.
- Added regression coverage proving a task switch clears a stale approved external evidence draft and leaves the save action disabled for the newly selected task.
- Stayed within `src/side-panel/App.tsx`, `src/side-panel/App.test.tsx`, and this worklog.

### Verification

- `npx vitest run src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 1 test file passed, 7 tests passed.
- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 4 test files passed, 45 tests passed.
- `npm run typecheck`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: `tsc --noEmit`.

## Side Panel App/UI Re-review Follow-up

### Summary

- Added explicit App-level coverage for a clean same-task normalized broadcast context carrying `review.question: ""`.
- Kept the raw normalization/drop regression test in place and verified the new empty-string case clears the textarea after a prior same-task question sync.
- Stayed within `src/side-panel/App.test.tsx` and this worklog.

### Verification

- `npx vitest run src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 1 test file passed, 8 tests passed.
- `npx vitest run src/runtime/side-panel-contract.test.ts src/content/content-script.test.ts src/background/service-worker.test.ts src/side-panel/App.test.tsx`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: 4 test files passed, 46 tests passed.
- `npm run typecheck`
  - Initial sandboxed launch failed before execution with `CreateProcessAsUserW failed: 5`.
  - Unsandboxed rerun passed: `tsc --noEmit`.
