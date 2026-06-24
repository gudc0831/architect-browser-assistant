# Extension context invalidated handling

## Context

After rebuilding or reloading the unpacked Chrome extension, already-open `/daily` tabs can retain a stale content script. Calling `chrome.runtime.sendMessage` from that stale context can throw or report `Extension context invalidated.`

## Changes

- Added an optional `errorCode` field to the extension response contract.
- Wrapped content-script background messaging in `try/catch`.
- Normalized the stale-extension case to `extension_context_invalidated`.
- Returned a refresh-focused Korean message instead of surfacing the raw Chrome runtime error.
- Added content-script test coverage for side-panel launch requests when the extension context is invalidated.

## Verification

- `npx vitest run src/content/content-script.test.ts`: pass, 14 tests.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `ARCHITECT_SAAS_ORIGIN=http://localhost:3000,https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app npm run build`: pass.
- Rebuilt `dist/manifest.json` still includes both localhost and the stable Preview alias.
- `npm run release:readiness -- --json --strict`: pass with `14 pass, 4 warn, 0 fail`; the localhost warnings are expected for this local development build.
