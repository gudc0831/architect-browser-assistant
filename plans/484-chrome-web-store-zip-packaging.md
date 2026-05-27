# 484 Chrome Web Store ZIP Packaging

Status: `implemented`

## Scope

Add a deterministic, local-only extension ZIP packaging command for Chrome Web Store upload preparation without uploading anything or committing generated artifacts.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| `release:package` command | implemented | `architect-browser-assistant` | Packages the current `dist` folder into ignored `release/architect-browser-assistant-<version>.zip`. |
| Deterministic ZIP writer | implemented | `architect-browser-assistant` | Uses stable file ordering, fixed timestamps, stored entries, and SHA-256 report output. |
| Production manifest guard | implemented | `architect-browser-assistant` | `--production` rejects localhost URL patterns before writing the ZIP. |
| Test coverage | implemented | `architect-browser-assistant` | Node tests cover deterministic output, local-origin production rejection, CRC32, and URL-scope validation. |
| Dry-run packet command handoff | implemented | `architect-browser-assistant` | `release:promotion:dry-run` now emits `releasePackage` as a follow-up command. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm test` | passed; Vitest suite plus native-host, promotion-packet, and package-extension Node tests pass |
| Synthetic production build plus `npm run release:package -- --json --strict --production` | passed; generated ignored `release/architect-browser-assistant-0.1.0.zip` with 7 files and SHA-256 report |
| `npm run release:promotion:dry-run -- --json` | completed with expected local blockers and now includes the `releasePackage` follow-up command |
| `npm run release:check` | passed; local readiness remains 12 pass, 6 warn, 0 fail |

## Boundaries

The ZIP package is generated output under ignored `release/` and must not be committed. Packaging does not upload to Chrome Web Store, sign binaries, issue certificates, generate native-host files, or update registry state.
