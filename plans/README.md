# Slice Roadmap

작성일: 2026-05-07
상위 문서: `../PLAN.md`
현재 실행 목표: `02 Knowledge Admin WIKI`를 구현 가능한 PRD 상태로 확정하고, 이후 구현은 이 slice 안에서 진행한다.

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
| 01 | `01-task-assistant-core-loop.md` | `in_progress` | `/daily` task-reactive assistant core loop, retrieval, record save, summary approve foundation | `architect-saas`, `architect-browser-assistant` |
| 02 | `02-knowledge-admin-wiki.md` | `approved` | task assistant 기록에서 생긴 후보를 Knowledge admin이 검토하고 WIKI 지식으로 승격하는 첫 관리자 루프 | `architect-saas` |
| 03 | `03-file-and-image-analysis.md` | `planned` | PDF/DOCX/XLSX/TXT/CSV와 PNG/JPG OCR 결과를 task assistant 근거로 저장 | `architect-saas`, `architect-browser-assistant` |
| 04 | `04-web-and-skill-expansion.md` | `planned` | 사용자가 허용한 웹/스킬 결과를 task 기록과 지식 후보로 연결 | `architect-browser-assistant`, `architect-saas` |
| 05 | `05-saas-api-mode.md` | `planned` | 조직 단위 SaaS API 실행 모드, 사용량, 감사, 관리자 정책 | `architect-saas` |

## 현재 Goal 기록

Codex goal 도구에는 완료된 01 goal이 남아 있어 새 goal 생성이 실패한다. 따라서 실행 목표는 이 roadmap과 각 slice 문서의 상태로 관리한다.

현재 실행 목표:

```text
Implement and verify 02 Knowledge Admin WIKI candidate review loop.
```

성공 기준:

1. `/admin/knowledge`에서 assistant 후보 목록을 볼 수 있다.
2. 후보 상세에서 원문, 정리 초안, task/project 근거, 신뢰도, 출처를 확인할 수 있다.
3. Knowledge admin은 후보를 승인, 수정, 반려할 수 있다.
4. 승인된 항목은 중앙 공식 지식/WIKI 항목의 최소 데이터 구조로 저장된다.
5. 02 문서와 worklog에 commit, 검증, 남은 제한 사항이 기록된다.
