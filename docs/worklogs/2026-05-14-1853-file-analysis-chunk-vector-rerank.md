Req: Continue the hardening goal by implementing the dedicated chunk table + pgvector/vector rerank candidate slice.
Diff: Added slice 466 plan and updated roadmap; implementation lives in `architect-saas`.
Why: Project-document retrieval needed a scalable chunk index beyond JSON metadata scans while preserving fallback behavior.
Verify/Time: 2026-05-14 18:53-19:05 KST. SaaS `npm run db:generate`, `npm run typecheck`, `npm run retrieval:hybrid:validate`, `npm run lint`, `npm run build`, and Browser Assistant `npm run release:check` passed.
