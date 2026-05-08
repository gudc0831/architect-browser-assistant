# Slice Roadmap

작성일: 2026-05-07
상위 문서: `../PLAN.md`
현재 실행 목표: `05 SaaS API Mode`의 live provider adapter와 admin reporting까지 구현 완료했다.

## 운영 원칙

`PLAN.md`는 제품 방향과 cross-repo 책임 경계를 유지한다. 구현 단위, 검증 기준, commit/worklog 기록은 각 slice 문서에서 관리한다.

각 slice는 다음 상태 중 하나를 가진다.

- `planned`: 방향만 잡힌 상태
- `planning`: PRD 작성 중
- `approved`: 구현 시작 가능한 상태
- `in_progress`: 구현 중
- `implemented`: 검증과 worklog까지 완료
- `deferred`: 의도적으로 뒤로 미룸

## Slice 순서

| Slice | 문서 | 상태 | 목적 | 주요 repo |
| --- | --- | --- | --- | --- |
| 01 | `01-task-assistant-core-loop.md` | `implemented` | `/daily` task-reactive assistant core loop, retrieval, record save, summary approve foundation | `architect-saas`, `architect-browser-assistant` |
| 02 | `02-knowledge-admin-wiki.md` | `implemented` | task assistant 기록에서 생긴 후보를 Knowledge admin이 검토하고 WIKI 지식으로 승격하는 첫 관리자 루프 | `architect-saas` |
| 03 | `03-file-and-image-analysis.md` | `implemented` | PDF/DOCX/XLSX/TXT/CSV와 PNG/JPG OCR 결과를 task assistant 근거로 저장 | `architect-saas`, `architect-browser-assistant` |
| 04 | `04-web-and-skill-expansion.md` | `implemented` | 사용자가 허용한 웹/스킬 결과를 task 기록과 지식 후보로 연결 | `architect-browser-assistant`, `architect-saas` |
| 05 | `05-saas-api-mode.md` | `implemented` | 조직 단위 SaaS API 실행 모드, 사용량, 감사, 관리자 정책 | `architect-saas` |

## 현재 Goal 기록

Codex goal 도구의 01 objective는 `complete` 상태다. 새 goal 생성은 기존 goal record 유지로 실패할 수 있으므로, 이후 실행 목표는 이 roadmap과 각 slice 문서의 상태로 관리한다.

Goal 1 closeout:

```text
Implement and verify 01 Task Assistant Core Loop foundation across architect-browser-assistant and architect-saas.
```

상태:

1. `/daily` task-reactive assistant panel 구현/검증 완료.
2. SaaS assistant retrieval, record save, summary approve foundation 구현/검증 완료.
3. browser assistant runtime adapter와 mock runtime foundation 구현/검증 완료.
4. real local ChatGPT/Codex bridge는 후속 runtime goal로 defer. Goal 1 closeout blocker가 아니다.
5. Slice 04 SaaS 저장/retrieval과 browser assistant handoff goal은 `implemented` 상태로 닫았다.

완료된 실행 목표:

```text
Implement file analysis metadata storage and assistant evidence retrieval for the /daily PC popup.
```

성공 기준:

1. 선택 task의 assistant 팝업에서 첨부 파일 목록을 볼 수 있다. 완료.
2. 파일별 분석 텍스트와 요약을 저장할 수 있다. 완료.
3. 저장된 분석 결과가 다음 assistant 근거 조회에 `project_document` evidence로 나타난다. 완료.
4. 미확인 파일/OCR 근거의 낮은 confidence 정책이 코드에 반영된다. 완료.
5. typecheck/lint, 문서 worklog, commit까지 완료한다. 완료.

완료된 실행 goal:

```text
Implement and verify 04 external evidence storage and assistant retrieval for /daily.
```

완료된 실행 goal:

```text
Implement browser assistant external evidence handoff to the SaaS external-evidence API.
```

성공 기준:

1. extension side panel에서 사용자 승인 외부 근거를 입력할 수 있다. 완료.
2. 현재 활성 탭 title/URL을 외부 근거 source로 캡처할 수 있다. 완료.
3. 저장 요청이 SaaS `/api/assistant/external-evidence` API contract만 사용한다. 완료.
4. 저장된 response가 side panel evidence list에 `web_or_skill`로 반영된다. 완료.
5. typecheck/lint/test/build 검증이 완료된다. 완료.

완료된 실행 goal:

```text
Write and approve 05 SaaS API Mode PRD.
```

성공 기준:

1. SaaS API Mode의 목적, 범위, non-goals를 확정했다. 완료.
2. 기존 PC 팝업/daily task assistant UX와 실행 모드의 관계를 정리했다. 완료.
3. admin policy, usage ledger, audit trail, generate API contract를 정의했다. 완료.
4. 첫 구현을 provider 호출 없이 검증 가능한 foundation slice로 분리했다. 완료.
5. worklog와 slice 문서를 갱신했다. 완료.

다음 구현 goal 후보:

```text
Implement SaaS API Mode policy and usage ledger foundation without live provider calls.
```

완료된 실행 goal:

```text
Implement SaaS API Mode policy and usage ledger foundation without live provider calls.
```

성공 기준:

1. project-scoped SaaS API Mode policy를 저장/조회할 수 있다. 완료.
2. `POST /api/assistant/generate`가 provider 호출 없이 정책 판정, deterministic answer, usage event, audit event를 생성한다. 완료.
3. 예산, evidence kind, external evidence 정책 차단을 provider 호출 전에 기록한다. 완료.
4. `/daily` PC popup에서 `SaaS API foundation` 실행 모드와 enabled/disabled 상태를 볼 수 있다. 완료.
5. typecheck/lint/build, API 확인, in-app browser `/daily` 검증을 완료했다. 완료.

다음 구현 goal 후보:

```text
Implement SaaS API Mode live provider adapter and admin reporting.
```

완료된 실행 goal:

```text
Implement SaaS API Mode live provider adapter and admin reporting.
```

성공 기준:

1. server-only provider adapter가 `mock` deterministic 응답과 `openai` live Responses API 호출 경로를 분리한다. 완료.
2. `openai` provider 설정 누락/실패는 safe failure usage/audit event로 남긴다. 완료.
3. `/admin/assistant`에서 policy, 월별 usage summary, recent usage events, audit timeline을 확인한다. 완료.
4. `/daily` PC popup의 SaaS API 결과가 provider/model/call mode와 usage를 표시한다. 완료.
5. 사용자 가이드/API contract/worklog를 갱신한다. 완료.

다음 구현 goal 후보:

```text
Implement local ChatGPT/Codex bridge packaging and extension install verification.
```
