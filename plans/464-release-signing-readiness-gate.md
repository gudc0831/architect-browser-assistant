# 464. Release Signing Readiness Gate

Created: 2026-05-14
Parent: `../PLAN.md`
Related: `455-mvp-release-readiness-gate.md`, `459-production-saas-origin-packaging.md`, `463-browser-region-capture-handoff.md`
Status: `implemented_verified`

## Goal

Turn release/signing readiness from documentation into an automated gate. The local release gate should prove that an unpacked MVP candidate has the expected MV3 manifest, scoped permissions, SaaS origin alignment, native-host manifest template, installer guardrails, and a production-specific signing metadata gate before public promotion.

## Why This Slice

After slices 460-463, the remaining 90%+ blocker was public distribution confidence. Slice 455 had a broad `release:check`, and slice 459 made SaaS origin configurable. The missing part was a release-readiness validator that explicitly checks the Web Store/native-host signing boundary instead of relying on a human checklist.

## Product Gap Reassessment

| PLAN axis | Previous state | After this slice |
| --- | --- | --- |
| Regulation DB / official sources | foundation and eval seed implemented | unchanged |
| OCR / image analysis | provider contract plus browser region handoff | unchanged |
| Postgres text/vector/hybrid search | first text-hybrid implementation | unchanged |
| Knowledge admin authority model | explicit guard mapped to current RBAC | unchanged |
| Public release readiness | release check and production origin packaging existed | release/signing readiness validator added to `release:check` |

Overall completion moves from roughly 88-89% to roughly 90-91%. The project now has implemented slices across all five unfinished axes. Remaining work is still meaningful, but it is follow-on hardening rather than a missing core path.

## Scope

1. Add an offline release readiness validator.
2. Add it to `npm run release:check` after production build.
3. Validate MV3 identity, scoped extension permissions, host/content-script origin alignment, entrypoints, and non-broad URL match patterns.
4. Validate native-host template placeholders, installer guardrails, generated manifest shape, and extension id format.
5. Add a production-only strict gate that fails without production origin/signing/release-owner metadata.
6. Update README and slice roadmap so release promotion has a concrete command path.

## Out Of Scope

- Uploading to Chrome Web Store.
- Obtaining or storing signing certificates.
- Signing the native-host installer.
- Running real Local Codex generation through the user's external Codex CLI.
- SaaS production deployment signoff.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| `scripts/verify-release-readiness.mjs` | implemented | `architect-browser-assistant` | `npm run release:readiness -- --strict` passed |
| `release:check` includes readiness gate | implemented | `architect-browser-assistant` | validator checks script wiring |
| `release:readiness:production` strict gate | implemented | `architect-browser-assistant` | script present and validator checks it |
| README release/signing commands | implemented | `architect-browser-assistant` | document update |
| roadmap/worklog | implemented | `architect-browser-assistant` | this document plus worklog |

## Gate Definition

`npm run release:readiness -- --strict` validates the current built `dist/manifest.json` and native-host release assets. Warnings do not fail local readiness; failures do.

`npm run release:readiness:production` adds production constraints:

1. `ARCHITECT_SAAS_ORIGIN` must have been used to build a non-local manifest.
2. A Chrome extension id must be provided through `ARCHITECT_CHROME_EXTENSION_ID` or `--extension-id`.
3. `ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT` must identify the intended native-host signing certificate/subject.
4. `ARCHITECT_RELEASE_OWNER` must identify the human/accountable release owner.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-14 | Release readiness validator | `npm run release:readiness -- --strict` passed with 11 pass, 3 expected local-production warnings, 0 fail |
| 2026-05-14 | Full release gate | `npm run release:check` passed. Typecheck, lint, 6 test files / 14 tests, build, release readiness, and native-host self-test passed |

## Residual Risks

- Production Web Store upload and native-host installer signing are still operational release steps, not performed by this repo gate.
- The production readiness command requires real release metadata and a production-origin build; local `release:check` intentionally warns rather than failing on missing production metadata.
- `npm run extension:verify-chrome-profile` and `npm run native-host:verify:windows -- --strict` remain machine/profile-specific checks after installation.
- Real Local Codex generation verification still requires explicit external approval via `npm run native-host:verify-generation -- --json --allow-external --strict`.

## Next Candidate Slice

1. PDF rasterizer + Tesseract scanned PDF OCR provider.
2. Persist selected-region screenshot crop and run OCR over it.
3. Dedicated chunk table + pgvector/vector rerank.
4. Production legal-source import governance and scheduled refresh.
