# 480 Production Extension Packaging Readiness

Status: `implemented`

## Scope

Strengthen Chrome Web Store, signing, installer, and native-host production-readiness validation without uploading to the store.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Production build command | implemented | `architect-browser-assistant` | `npm run release:build:production` runs build plus production readiness. |
| Release validator | implemented | `architect-browser-assistant` | Checks Web Store publisher and native-host install-root metadata in production mode. |
| Installer path | implemented | `architect-browser-assistant` | Windows native-host installer supports `-InstallRoot` for stable production-style install paths. |
| Production install verifier | implemented | `architect-browser-assistant` | `npm run native-host:verify-production-install` checks repo-local path avoidance. |
| Web Store profile guard | implemented | `architect-browser-assistant` | Chrome profile verifier supports `--require-webstore`. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` in `architect-browser-assistant` | passed |
| `npm run release:readiness -- --json --strict` | passed with 13 pass, 4 expected local-production warnings, 0 fail |
| `npm run release:readiness:production -- --json --strict` | failed intentionally with production blockers for localhost origin patterns and missing Web Store/signing/install-root metadata |
| 2026-05-27 `npm run release:check` after main promotion | initially failed only because the repo-local generated native-host launcher was missing; validator now treats that ignored installer output as a warning while still requiring source script, manifest template, and installer |

## Blocked Operations

Chrome Web Store upload, signed native-host installer production, and real installed profile verification require production SaaS origin, Web Store publisher, signing subject, release owner, install root, and operator approval.
