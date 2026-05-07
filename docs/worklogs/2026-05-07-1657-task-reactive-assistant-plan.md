Req: 전환된 제품 방향을 반영해 assistant를 별도 테스트 페이지가 아니라 기존 task 화면에 종속된 PC 전용 task-reactive panel로 구체화한다.
Diff: `PLAN.md`의 브라우저 assistant UX와 동작 범위를 PC 전용 task-reactive assistant panel 우선으로 수정했다. `plans/01-task-assistant-core-loop.md`에 `/daily` task 클릭 반응, `/assistant-test` harness 격하, 모바일 후속 확장, Chrome action popup 비우선 결정을 추가했다.
Why: 제품 가치는 일일목록/보드에서 선택한 건축 task에 반응하는 검토 assistant이며, 별도 페이지 테스트 harness는 실제 사용자 흐름을 대표하지 않는다.
Verify/Time: 2026-05-07 16:57 KST. 문서 변경 후 SaaS에서 `/daily` assistant panel 구현과 browser-use 수동 검증으로 방향 일치 확인.
