Req: 공개 가능한 MVP 운영 준비도 축을 release gate로 정리한다.
Diff: Browser Assistant repo에 `release:check` script와 GitHub Actions release gate를 추가하고 README, roadmap, slice 문서를 갱신했다.
Why: 최근 slice는 UI polish 중심으로 많았지만 public MVP 후보에는 반복 가능한 typecheck/lint/test/build/native-host self-test gate가 필요하다.
Verify/Time: 2026-05-14 17:10-17:30 KST, `npm run release:check` 통과: typecheck, lint, 14개 test, production build, native-host self-test.
