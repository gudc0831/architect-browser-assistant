Req: Set the next goal and implement the provider-specific secret metadata plus next guarded adapter slice.
Diff: Added Slice 363 PRD for provider credential source metadata and the Obsidian guarded adapter.
Why: Slice 362 established the execution audit boundary; the next step is provider-specific credential readiness and a second adapter without exposing raw secrets.
Verify/Time: Implementation verified with SaaS typecheck, lint, API route validation, and Browser UI validation on 2026-05-13 13:29 KST.
