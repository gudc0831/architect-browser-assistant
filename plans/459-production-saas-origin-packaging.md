# 459. Production SaaS Origin Packaging

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `455-mvp-release-readiness-gate.md`
현재 상태: `implemented_verified`

## Goal

Browser Assistant extension manifest가 localhost에 고정되지 않고 production SaaS origin을 build-time 환경변수로 받을 수 있게 한다.

## Product Gap

공개 가능한 MVP 운영 준비도에서 release gate는 생겼지만, 실제 extension package가 `http://localhost:3000/*`에만 content script와 host permission을 부여하면 production SaaS에 로드할 수 없다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| `ARCHITECT_SAAS_ORIGIN` build-time manifest 설정 | 구현 완료 | `architect-browser-assistant` | `npm run release:check` 통과 |
| invalid/missing origin localhost fallback | 구현 완료 | `architect-browser-assistant` | `npm run release:check` 통과 |
| README packaging 안내 | 구현 완료 | `architect-browser-assistant` | 문서 갱신 |

## Scope

1. `src/manifest.ts`에서 `ARCHITECT_SAAS_ORIGIN`을 읽어 `host_permissions`와 `content_scripts.matches`를 생성한다.
2. `http`/`https` origin만 허용한다.
3. 값이 없거나 유효하지 않으면 기존 local 개발 origin을 유지한다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` 통과 |

## Residual Risks

- Chrome Web Store signing과 배포 채널 운영은 아직 별도 절차다.
- SaaS 쪽 `ARCHITECT_ASSISTANT_EXTENSION_ORIGINS` allowlist와 production extension ID 등록은 배포 환경에서 별도로 맞춰야 한다.
- native host installer signing은 아직 없다.

## 2026-05-14 Follow-up Status

- Slice 464 added a production readiness validator that fails promotion unless the built manifest uses a non-local SaaS origin and release metadata is configured.
- Required production metadata: `ARCHITECT_CHROME_EXTENSION_ID`, `ARCHITECT_NATIVE_HOST_SIGNING_SUBJECT`, and `ARCHITECT_RELEASE_OWNER`.
- Actual Chrome Web Store upload and native-host installer signing are still external operational release steps.
