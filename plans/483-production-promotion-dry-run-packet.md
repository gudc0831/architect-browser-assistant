# 483 Production Promotion Dry-Run Packet

Status: `implemented`

## Scope

Bundle the remaining pre-promotion checks that can run without Chrome Web Store upload, native-host signing, certificate issuance, or registry mutation.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Promotion dry-run script | implemented | `architect-browser-assistant` | `npm run release:promotion:dry-run` produces a non-secret operator packet. |
| Artifact fingerprint | implemented | `architect-browser-assistant` | The packet hashes the current `dist` file set and reports manifest SaaS origin alignment. |
| Metadata dependency split | implemented | `architect-browser-assistant` | The packet separates blocking production metadata from manual approval dependencies. |
| Package command handoff | implemented | `architect-browser-assistant` | Slice 484 adds `release:package`; the dry-run packet includes it in follow-up commands. |
| Test coverage | implemented | `architect-browser-assistant` | Node tests cover signed, unsigned-waiver, and missing-metadata classifications. |
| Operator docs | implemented | `architect-browser-assistant` | README documents the dry-run sequence and non-mutating boundary. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm test` | passed; Vitest suite plus native-host and promotion-packet Node tests pass |
| Synthetic production dry-run with `ARCHITECT_SAAS_ORIGIN=https://architect.example.com`, non-secret owner/publisher/install-root values, `--extension-id abcdefghijklmnopabcdefghijklmnop`, and `--allow-unsigned-native-host` | passed with `ok=true`, production artifact origin aligned, no failed checks, and only manual approval dependencies remaining |
| `npm run release:promotion:dry-run -- --json` after local release build | completed with `ok=false`, clearly reporting local origin and missing production metadata blockers without failing the local command |
| `npm run release:check` | passed; local readiness remains 12 pass, 6 warn, 0 fail |

## Boundaries

The dry-run packet does not upload to Chrome Web Store, sign binaries, issue a code-signing certificate, generate native-host launcher/manifest files, or update HKCU native-host registry entries. Those remain explicit operator-approval steps.

## Production Inputs

Required for a passing signed dry-run:

- `ARCHITECT_SAAS_ORIGIN`
- `ARCHITECT_CHROME_EXTENSION_ID` or `--extension-id`
- `ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT`
- `ARCHITECT_RELEASE_OWNER`
- `ARCHITECT_CHROME_WEB_STORE_PUBLISHER`
- `ARCHITECT_NATIVE_HOST_INSTALL_ROOT` or `--install-root`

For the operator-approved unsigned interim path, `--allow-unsigned-native-host` may replace only `ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT`; it does not remove the signed-release requirement.
