# 477 Source Review Coverage Export

Status: `implemented`

## Scope

Add stale/reviewed/unreviewed source-review coverage filters and export for legal-source governance.

## Implementation

| Item | Status | Repo | Notes |
| --- | --- | --- | --- |
| Coverage report | implemented | `architect-saas` | `getRegulationGovernanceSourceReviewCoverageReport()` preserves latest review, reviewer, and package digest. |
| CSV export | implemented | `architect-saas` | `GET /api/admin/knowledge/regulation-governance/source-review-coverage/export`. |
| Admin filters | implemented | `architect-saas` | `/admin/knowledge` can filter all/reviewed/unreviewed/stale and set stale days. |
| Audit UUID fix | implemented | `architect-saas` | Source review and acknowledgement audit events now keep package/source ids in metadata and avoid non-UUID `target_id` writes. |

## Verification Log

| Command | Result |
| --- | --- |
| `npm run typecheck` in `architect-saas` | passed |

## Blocked Operations

Authenticated browser export validation still needs a logged-in Knowledge admin session. Unauthenticated route checks are part of final validation.

