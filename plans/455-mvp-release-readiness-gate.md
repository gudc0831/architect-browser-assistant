# 455. MVP Release Readiness Gate

작성일: 2026-05-14
상위 문서: `../PLAN.md`
현재 상태: `implemented_verified`

## Goal

공개 가능한 MVP 운영 준비도 축을 최소 gate로 닫는다. Browser Assistant repo가 SaaS 수준의 모든 배포 보호를 갖추지는 않았지만, 적어도 typecheck, lint, unit test, production build, native-host self-test를 하나의 release gate로 실행할 수 있어야 한다.

## Implementation Status

| 항목 | 상태 | 검증 |
| --- | --- | --- |
| `npm run release:check` 추가 | 구현 완료 | `npm run release:check` 통과 |
| GitHub Actions release gate 추가 | 구현 완료 | workflow 파일 추가, local gate 통과 |
| README release gate 안내 | 구현 완료 | 문서 갱신 |
| roadmap/worklog 갱신 | 구현 완료 | 문서 갱신 |

## Gate Definition

`release:check`는 다음을 순서대로 실행한다.

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
5. `npm run release:readiness -- --strict`
6. `npm run native-host:self-test`

이 gate는 public MVP 후보를 만들기 전 local/CI에서 모두 통과해야 한다. 실제 Chrome Web Store 서명, Windows installer signing, production SaaS origin 설정은 후속 slice다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | release gate 정의 | 완료 |
| 2026-05-14 | local release gate | `npm run release:check` 통과: typecheck, lint, 14개 test, production build, native-host self-test |

## Residual Risks

- CI는 native host registry 설치나 실제 Codex authenticated generation을 검증하지 않는다.
- extension manifest는 `ARCHITECT_SAAS_ORIGIN` build-time 설정을 지원하지만 Chrome Web Store signing과 배포 채널 검증은 별도다.
- production promotion은 `architect-saas` release signoff와 별도로 완료되어야 한다.

## 2026-05-14 Follow-up Status

- Slice 464 added `npm run release:readiness -- --strict` to the local release gate.
- Slice 464 added `npm run release:readiness:production` for production-origin and signing metadata enforcement.
- Chrome Web Store upload and actual native-host installer signing remain operational release steps outside the local repository gate.
