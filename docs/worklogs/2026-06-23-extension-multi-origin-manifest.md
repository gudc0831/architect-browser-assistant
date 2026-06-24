# Browser Assistant multi-origin manifest

## Context

The SaaS `/daily` side-panel launch button can be used from different exact origins during development and Preview validation. A single-origin extension build caused the page bridge to work only on the origin baked into `dist/manifest.json`.

## Changes

- Updated `src/manifest.ts` so `ARCHITECT_SAAS_ORIGIN` accepts comma, semicolon, or whitespace separated exact origins.
- Kept the stable Preview alias as the fallback when no valid origin is supplied.
- Documented a local build that includes both `http://localhost:3000` and the stable Preview alias.
- Clarified readiness wording for multiple exact SaaS origins.

## Verification

- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `ARCHITECT_SAAS_ORIGIN=http://localhost:3000,https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app npm run build`: pass.
- Rebuilt `dist/manifest.json` includes both `http://localhost:3000/*` and `https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app/*` in `host_permissions` and `content_scripts.matches`.
- `npm run release:readiness -- --json --strict`: pass with `14 pass, 4 warn, 0 fail`. The localhost warnings are expected for this local development build.
