Req: 검색 품질 핵심축을 닫기 위해 프로젝트 기준 문서 retrieval ranking slice를 추가한다.
Diff: `plans/458-project-document-retrieval-ranking.md`를 작성하고 roadmap에 458 slice를 연결했다. 구현 변경은 `architect-saas`에 있다.
Why: 승인 WIKI retrieval만으로는 프로젝트 전체 업로드 문서 검색 품질이 충분하지 않다. 현재 task 밖의 분석 완료 문서도 assistant 근거로 들어와야 MVP 검색 축을 닫을 수 있다.
Verify/Time: 2026-05-14 17:35 KST, SaaS `npm run typecheck`, `npm run lint`, `npm run build` 통과.
