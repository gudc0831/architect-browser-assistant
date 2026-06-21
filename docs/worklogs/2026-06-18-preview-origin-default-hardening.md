# 2026-06-18 - Preview Origin Default Hardening

Req: Prevent `/daily` Local Codex page-bridge disconnects caused by rebuilding the unpacked extension without the Preview SaaS origin.

Diff: Changed `src/manifest.ts` so missing or invalid `ARCHITECT_SAAS_ORIGIN` now falls back to the stable Preview alias `https://architect-start2-git-codex-multi-d1c003-chois-projects-7b2948cf.vercel.app` instead of `http://localhost:3000`. Updated README and Slice 459 docs to make localhost an explicit development override, then rebuilt `dist`.

Why: Chrome content scripts are registered per origin. If the unpacked extension rebuilds with localhost permissions, the deployed `/daily` page cannot see the content script, so the health checklist reports page connection, extension connection, and answer generation as unavailable even when native host and Codex are installed correctly.

Verify/Time: 2026-06-18 KST. `npm run build` passed with no `ARCHITECT_SAAS_ORIGIN` env, and `dist/manifest.json` now points host permissions, content-script matches, and web-accessible resources at the stable Preview alias. `npm run release:readiness -- --strict` passed with 16 pass, 2 expected production-promotion warnings, and 0 fail. Follow-up operator step remains: reload Architect Browser Assistant in `chrome://extensions`, refresh the canonical Preview `/daily`, then rerun `연결 상태 확인`.

Boundary: No Web Store upload, signed installer release, Vercel deployment, registry change, or native-host reinstall was performed.
