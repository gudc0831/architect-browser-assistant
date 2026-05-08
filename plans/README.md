# Slice Roadmap

작성일: 2026-05-07
상위 문서: `../PLAN.md`
현재 실행 목표: `04 Web And Skill Expansion`을 implementation-ready 상태로 만든다.

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
| 04 | `04-web-and-skill-expansion.md` | `approved` | 사용자가 허용한 웹/스킬 결과를 task 기록과 지식 후보로 연결 | `architect-browser-assistant`, `architect-saas` |
| 05 | `05-saas-api-mode.md` | `planned` | 조직 단위 SaaS API 실행 모드, 사용량, 감사, 관리자 정책 | `architect-saas` |

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
5. Slice 04 `approved` 상태와 현재 실행 goal은 유지한다.

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

현재 실행 goal:

```text
Make 04 Web And Skill Expansion implementation-ready.
```

성공 기준:

1. SaaS API contract와 evidence metadata schema가 확정된다. 완료.
2. assistant 팝업에서 웹/스킬 근거 사용 동의 UX가 정의된다. 완료.
3. browser assistant와 SaaS 책임 경계가 문서화된다. 완료.
4. 첫 구현 단위와 검증 기준이 확정된다. 완료.
5. PRD/worklog/commit이 완료된다. 진행 중.

다음 구현 goal 후보:

```text
Implement and verify 04 external evidence storage and assistant retrieval for /daily.
```
