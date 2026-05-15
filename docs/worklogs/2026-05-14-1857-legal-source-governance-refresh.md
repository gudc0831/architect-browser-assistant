Req: Finish the remaining hardening candidate by adding production legal-source import governance and refresh validation.
Diff: Added slice 467 plan and roadmap updates; implementation lives in `architect-saas`.
Why: Regulation seeds needed executable offline governance controls for production import, official source verification, Knowledge admin review, and scheduled refresh due dates.
Verify/Time: 2026-05-14 18:57-19:05 KST. SaaS `npm run regulation:governance:validate`, `npm run typecheck`, `npm run lint`, `npm run build`, and Browser Assistant `npm run release:check` passed.
