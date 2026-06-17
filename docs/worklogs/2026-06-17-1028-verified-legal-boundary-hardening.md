Req: Align Browser Assistant with the workspace legal corpus boundary.

Diff:
- Removed direct `law.go.kr` extension host permission.
- Removed `lawOpenDataOc` from extension safe storage and blocked that setting key.
- Changed browser-side official-law verification to use SaaS/verified-legal returned `verificationStatus=verified` regulation evidence metadata only.
- Changed generation preflight to fail closed for unverified regulation seeds.
- Removed `--oc` from the manual task-flow verifier.
- Changed the manual task-flow verifier to call SaaS `/api/assistant/task-review` instead of browser-side official API verification plus assistant-record candidate creation.
- Refreshed README and slice 486 so the documented operating path matches the server-owned verified legal boundary.

Why:
- `LAW_OPEN_DATA_OC` belongs only in `verified-legal-evidence-api`.
- Browser Assistant must not access R2, Supabase DB, LAW OPEN DATA credentials, or verified legal server secrets directly.
- Legal verification must arrive through Architect SaaS server-to-server calls to verified-legal evidence, not browser credentials or direct official API calls.

Verify/Time:
- 2026-06-17 10:27 KST `npm run typecheck` passed.
- 2026-06-17 10:27 KST `npm run test` passed: 8 Vitest files, 31 Vitest tests, 27 Node tests.
- 2026-06-17 10:25 KST `npm run build` passed.
- 2026-06-17 10:27 KST `npm run release:readiness -- --strict` passed with 0 failures and expected local/prod metadata warnings.
- 2026-06-17 10:28 KST `npm run lint` passed.
- 2026-06-17 closeout rerun `npm run typecheck` passed.
- 2026-06-17 closeout rerun `npm run test` passed: 8 Vitest files, 31 Vitest tests, 27 Node tests.
- 2026-06-17 closeout rerun `npm run build` passed.
- 2026-06-17 closeout rerun `npm run lint` passed.
- 2026-06-17 closeout rerun `npm run release:readiness -- --strict` passed with 14 pass, 4 warn, 0 fail for local-origin build.
- 2026-06-17 closeout Preview-origin build with `ARCHITECT_SAAS_ORIGIN=https://architect-start2-c9erggsl2-chois-projects-7b2948cf.vercel.app` passed.
- 2026-06-17 closeout Preview-origin `npm run release:readiness -- --strict` passed with 16 pass, 2 warn, 0 fail and exact SaaS Preview host permissions.
