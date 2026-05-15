Req: 공개 MVP 운영 준비도 축에서 extension manifest의 production SaaS origin packaging 경계를 닫는다.
Diff: `src/manifest.ts`가 `ARCHITECT_SAAS_ORIGIN` build-time 환경변수를 읽어 MV3 `host_permissions`와 content-script `matches`를 생성하도록 바꾸고 README와 slice 문서를 추가했다.
Why: release gate가 있어도 manifest가 localhost에 고정되어 있으면 production SaaS에 올릴 수 있는 extension package가 아니다.
Verify/Time: 2026-05-14 17:45 KST, `npm run release:check` 통과: typecheck, lint, 14개 test, production build, native-host self-test.
