Req: 법규 DB/공식 출처 실체화와 검색 품질 평가 기반을 첫 안전 slice로 구현/검증 가능한 상태까지 끌어올린다.
Diff: `plans/460-regulation-knowledge-foundation.md`를 작성하고 `plans/README.md`에 460 slice를 연결했다. 구현 변경은 `architect-saas`의 local regulation seed, validator, assistant retrieval 연결에 있다.
Why: 전체 기획서 기준 가장 큰 남은 검색 축은 `regulation` evidence가 실체 없이 unavailable로 남는 문제이며, 로컬 seed/fixture 중심 foundation은 외부 크롤링과 DB migration 없이 안전하게 닫을 수 있다.
Verify/Time: 2026-05-14 17:41 KST, SaaS `npm run regulation:seed:validate`, `npm run typecheck`, `npm run lint`, `npm run build` 통과.
