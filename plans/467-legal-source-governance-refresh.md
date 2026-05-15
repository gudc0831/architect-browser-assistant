# 467. Legal Source Governance Refresh

Created: 2026-05-14
Parent: `../PLAN.md`
Related: `460-regulation-knowledge-foundation.md`, `466-file-analysis-chunk-vector-rerank.md`
Status: `implemented_verified`

## Goal

Close the production legal-source import risk by adding an offline governance manifest and refresh validation gate for regulation seed packages.

## Why This Slice

Slice 460 created regulation seed/evaluation data, but production readiness still needed governance controls around official URLs, Knowledge admin review, promotion blocking, source refresh due dates, and non-network validation. This slice makes those controls executable without crawling official sites.

## Scope

1. Add a governance manifest schema for regulation seed packages.
2. Require production import to declare Knowledge admin review.
3. Block production promotion while seed documents remain unapproved.
4. Require every official source to have an HTTPS URL, refresh due date, and verification checklist.
5. Add a fixed refresh cadence/staleness policy.
6. Add `npm run regulation:governance:validate`.
7. Keep validation offline-only and deterministic.

## Out Of Scope

- Crawling law.go.kr, ELIS, MOLIT, or any external site.
- Automatically updating legal text.
- Promoting seed documents to approved production legal answers.
- Admin UI for governance review.

## Implementation Status

| Item | Status | Repo | Verification |
| --- | --- | --- | --- |
| governance domain validator | implemented | `architect-saas` | `npm run typecheck` passed |
| foundation governance manifest | implemented | `architect-saas` | `npm run regulation:governance:validate` passed |
| offline validation script | implemented | `architect-saas` | `npm run regulation:governance:validate` passed |
| package script | implemented | `architect-saas` | script executed |
| roadmap/worklogs | implemented | both | this document plus worklogs updated after full gates |

## Governance Gate

The governance validator checks manifest/package match, Knowledge admin production review, promotion blocking while documents remain unapproved, official source URL coverage, source verification checklists, and refresh due dates.

## Verification Log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-05-14 | Governance validator | `npm run regulation:governance:validate` passed, 6/6 sources scheduled |
| 2026-05-14 | SaaS compile | `npm run typecheck` passed |
| 2026-05-14 | SaaS full gates | `npm run lint` passed with existing hook warnings; `npm run build` passed with one existing Turbopack trace warning |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` passed |

## Residual Risks

- This is a governance gate, not an external legal-data crawler.
- Production approval still requires Knowledge admin review of official text and effective dates.
- Refresh execution is represented as deterministic due-date validation; a deployed scheduler/automation can call this command later.
- Admin UI for legal-source governance is still a future slice.

## Next Candidate Slice

1. Embedding provider/backfill for `file_analysis_chunks.embedding`.
2. Admin legal-source governance UI.
3. Scheduled job/automation wrapper around `regulation:governance:validate`.
