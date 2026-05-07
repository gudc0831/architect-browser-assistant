# Slice Roadmap

작성일: 2026-05-07
상위 문서: `../PLAN.md`
현재 실행 목표: `03 File And Image Analysis` 상세 PRD를 작성하고 다음 구현 단위를 확정한다.

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
| 02 | `02-knowledge-admin-wiki.md` | `implemented` | task assistant 기록에서 생긴 후보를 Knowledge admin이 검토하고 WIKI 지식으로 승격하는 첫 관리자 루프 | `architect-saas` |
| 03 | `03-file-and-image-analysis.md` | `planned` | PDF/DOCX/XLSX/TXT/CSV와 PNG/JPG OCR 결과를 task assistant 근거로 저장 | `architect-saas`, `architect-browser-assistant` |
| 04 | `04-web-and-skill-expansion.md` | `planned` | 사용자가 허용한 웹/스킬 결과를 task 기록과 지식 후보로 연결 | `architect-browser-assistant`, `architect-saas` |
| 05 | `05-saas-api-mode.md` | `planned` | 조직 단위 SaaS API 실행 모드, 사용량, 감사, 관리자 정책 | `architect-saas` |

## 현재 Goal 기록

Codex goal 도구에는 완료된 01 goal이 남아 있어 새 goal 생성이 실패한다. 따라서 실행 목표는 이 roadmap과 각 slice 문서의 상태로 관리한다.

다음 실행 목표:

```text
Make 03 File And Image Analysis implementation-ready.
```

성공 기준:

1. 03 PRD에 파일 형식별 ingestion 범위가 정리된다.
2. OCR/이미지 분석의 신뢰도 제한과 사용자 확인 UX가 정리된다.
3. SaaS와 browser assistant의 책임 경계가 정리된다.
4. 첫 구현 단위와 검증 기준이 명확하다.
5. 03 문서와 worklog가 commit에 포함된다.
