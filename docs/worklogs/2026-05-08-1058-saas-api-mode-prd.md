# 2026-05-08 10:58 - SaaS API Mode PRD

Req: plan.md/PLAN 기반 후속 내용을 goal로 설정하고, 05 SaaS API Mode를 구현 가능한 PRD로 구체화한다.

Diff: `plans/05-saas-api-mode.md`를 승인 상태 PRD로 확장했다. PC daily task assistant popup 흐름을 유지하면서 `saas-api` 실행 모드, admin policy, usage ledger, audit trail, generate API contract, data model proposal, security/privacy 요구사항, first implementation acceptance criteria를 정의했다. `plans/README.md`에는 완료 goal과 다음 구현 goal을 갱신했다.

Why: 로컬 ChatGPT/Codex 실행이 어려운 조직을 지원하려면 실제 provider 호출보다 먼저 서버 측 정책, 비용 추적, 감사 로그, 차단 기준이 확정되어야 한다. 이 문서는 다음 구현 slice가 provider secret을 노출하지 않고 deterministic foundation부터 검증하도록 범위를 고정한다.

Verify/Time: 문서 변경 검토 완료. 다음 goal은 `Implement SaaS API Mode policy and usage ledger foundation without live provider calls`.
