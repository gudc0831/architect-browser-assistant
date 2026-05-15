Req: 핵심 미완성축 중 검색 품질과 Knowledge admin 권한 분리 축을 slice 문서에 반영한다.
Diff: `plans/456-approved-wiki-retrieval.md`, `plans/457-knowledge-admin-rbac-guard.md`를 추가하고, `plans/02-knowledge-admin-wiki.md`와 roadmap을 갱신했다. 구현 변경은 `architect-saas`에 있다.
Why: 승인 WIKI가 assistant retrieval에 들어오지 않고 Knowledge admin이 raw global admin check에 묶여 있으면 PLAN.md의 MVP 검색 우선순위와 역할 분리 기준을 충족하기 어렵다.
Verify/Time: 2026-05-14 17:10-17:35 KST, SaaS `npm run typecheck`, `npm run lint`, `npm run build` 통과. `/api/admin/knowledge/**` raw `requireRole` 직접 사용 없음.
