Req: Make the SaaS in-page popup the default assistant surface and keep Chrome side panel functionality hidden/manual.
Diff: Changed extension side panel behavior so the extension action no longer opens it by default, removed the content-script page marker used for SaaS popup hiding, and updated README/roadmap/slice 06 docs.
Why: The product default should be the `/daily` in-page `AI 검토` popup; Chrome side panel remains a secondary native bridge verification surface.
Verify/Time: `npm run typecheck`, `npm run test`, `npm run lint`, `npm run build` | 2026-05-11-1138
