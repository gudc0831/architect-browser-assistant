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
| Promotion dry-run packet | implemented | `architect-browser-assistant` | Slice 483 adds `npm run release:promotion:dry-run` for artifact fingerprint, readiness, and external-dependency review without mutating external systems. |
| Web Store ZIP packaging | implemented | `architect-browser-assistant` | Slice 484 adds deterministic `npm run release:package` output under ignored `release/`. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` in `architect-browser-assistant` | passed |
| `npm run release:readiness -- --json --strict` | passed with 12 pass, 6 warn, 0 fail; warnings are classified as 4 `local-dev` and 2 `production-promotion` |
| `npm run release:readiness:production -- --json --strict` | failed intentionally with production blockers for localhost origin patterns and missing Web Store/signing/install-root metadata |
| 2026-05-27 `npm run release:check` after main promotion | initially failed only because the repo-local generated native-host launcher was missing; validator now treats that ignored installer output as a warning while still requiring source script, manifest template, and installer |
| 2026-05-27 production readiness warning review | local strict readiness remains passable while warning metadata now reports `scope` and `resolution` for local/dev versus production promotion follow-up |

## Warning Policy

| Warning | Scope | Decision |
| --- | --- | --- |
| Localhost host permissions and content-script matches | `local-dev` | Expected for local builds; production must set `ARCHITECT_SAAS_ORIGIN` and rebuild. |
| Repo-local native-host launcher and generated manifest absence | `local-dev` | Expected because launcher and manifest are ignored installer output; do not commit them. |
| Missing extension id, signing subject, release owner, publisher, or install root | `production-promotion` | External production metadata is required before promotion. Store only examples in docs, not secrets. |
| Chrome Web Store upload boundary | `production-promotion` / `manual-release` | Upload is an operator action outside this validator and requires explicit approval. |

## Blocked Operations

Chrome Web Store upload, signed native-host installer production, and real installed profile verification require production SaaS origin, Web Store publisher, signing subject, release owner, install root, Chrome extension id, and operator approval.
