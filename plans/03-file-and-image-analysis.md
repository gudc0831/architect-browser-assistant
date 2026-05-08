# 03. File And Image Analysis PRD

작성일: 2026-05-08
상위 문서: `../PLAN.md`
현재 상태: `implemented`

## Goal

`/daily`에서 선택한 건축 task의 첨부 파일 분석 결과를 Task Assistant 근거로 저장하고 검색한다. 첫 구현은 PC 팝업 assistant 안에서 사람이 확인한 파일 텍스트/요약을 저장하는 vertical slice로 제한한다.

## Implementation Status

현재 구현 상태: `first_vertical_slice_implemented`

| 항목 | 상태 | 관련 commit | worklog | 검증 |
| --- | --- | --- | --- | --- |
| 03 PRD/roadmap goal 정리 | 완료 | Browser `20d06e5` | `docs/worklogs/2026-05-08-0914-file-analysis-slice-prd.md` | 문서 검토 |
| 파일 analysis metadata 모델 | 구현 완료 | SaaS `1dea2d0` | SaaS `docs/worklogs/2026-05-08-0914-file-analysis-evidence.md` | `npm run db:generate`, `npm run typecheck` |
| 파일 analysis 저장/조회 API | 구현 완료 | SaaS `1dea2d0` | SaaS worklog | `npm run typecheck`, `npm run build` |
| `/daily` PC 팝업 파일 근거 입력 UI | 구현 완료 | SaaS `1dea2d0` | SaaS worklog | in-app browser `/daily` 검증 |
| assistant retrieval `project_document` evidence 연결 | 구현 완료 | SaaS `1dea2d0` | SaaS worklog | 파일 근거 저장 후 assistant 답변 반영 확인 |
| OCR/image 미확인 근거 confidence 제한 | 구현 완료 | SaaS `1dea2d0` | SaaS worklog | typecheck/build, 코드 검토 |
| 자동 PDF/DOCX/XLSX/OCR 추출기 | 후속 slice | - | - | 03 first slice 비범위 |

## 사용자 문제

건축 task 검토는 도면, PDF, 회의록, 이미지 캡처 같은 첨부 파일 근거가 핵심이다. 현재 assistant는 task 본문과 이전 assistant 기록은 볼 수 있지만, 첨부 파일에서 확인한 내용은 근거로 연결되지 않는다. 사용자는 일일목록을 보면서 task를 클릭하고, 같은 화면의 팝업 assistant가 해당 task 첨부 파일 근거를 반영해 의견을 내길 원한다.

## 범위

1. PC `/daily` task assistant 팝업에서 task에 연결된 파일 목록을 조회한다.
2. 사용자가 파일에서 확인한 텍스트, OCR 결과, 이미지 영역 메모, 요약을 파일 분석 근거로 저장한다.
3. 저장된 파일 분석 근거는 `project_document` evidence로 assistant retrieval에 포함된다.
4. 사용자 미확인 OCR/이미지 근거는 낮은 confidence로 취급하고, 최종 공식 판단에는 사용자 확인이 필요하다는 문구를 포함한다.
5. 브라우저 확장/캡처 자동화와 모바일 UX는 후속 slice로 남긴다.

## 비범위

- 전체 PDF/DOCX/XLSX 자동 파싱 엔진 완성
- CAD/BIM 파일 파싱
- 도면 스케일 기반 법규 적합성 자동 판정
- 이미지 하나만으로 최종 법적/실무 판단 생성
- 모바일 assistant 팝업

## SaaS 책임

- 파일 레코드에 분석 메타데이터를 저장한다.
- `GET /api/files?taskId=...`로 파일 목록과 분석 개수를 제공한다.
- `POST /api/files/:fileId/analysis`로 분석 근거를 저장한다.
- `GET /api/files/:fileId/analysis`로 저장된 분석 근거를 조회한다.
- `/api/assistant/retrieve`에서 파일 분석 근거를 evidence로 반환한다.

## Browser Assistant 책임

- 현재 slice에서는 문서와 계획 책임만 가진다.
- 후속 slice에서 Chrome extension 또는 PC 전용 팝업이 화면 선택 영역 캡처, OCR 호출, SaaS 저장 API 호출을 담당한다.

## 데이터 정책

- `manual_text`, `document_text`, `ocr_text`, `image_region` source type을 구분한다.
- `unverified`, `user_confirmed`, `rejected` verification state를 둔다.
- `ocr_text`와 `image_region`이 `unverified`이면 confidence 상한을 낮게 둔다.
- 사용자가 확인하지 않은 파일 분석 결과는 “검토 단서”로만 사용한다.

## First Vertical Slice

실행 목표:

```text
Implement file analysis metadata storage and assistant evidence retrieval for the /daily PC popup.
```

성공 기준:

1. 선택 task의 assistant 팝업에서 첨부 파일 목록을 볼 수 있다. 완료.
2. 파일별 분석 텍스트와 요약을 저장할 수 있다. 완료.
3. 저장된 분석 결과가 다음 assistant 근거 조회에 `project_document` evidence로 나타난다. 완료.
4. 미확인 파일/OCR 근거의 낮은 confidence 정책이 코드에 반영된다. 완료.
5. TypeScript typecheck와 lint를 통과한다. 완료.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-08 | Prisma client 생성 | `npm run db:generate` 통과 |
| 2026-05-08 | TypeScript 검증 | `npm run typecheck` 통과 |
| 2026-05-08 | ESLint 검증 | `npm run lint` 통과. 기존 react-hooks warning 7개만 남음 |
| 2026-05-08 | Production build | `npm run build` 통과. 기존 data-guard broad pattern warning 2개만 남음 |
| 2026-05-08 | Browser 검증 | in-app browser `http://localhost:3000/daily`에서 AS-001 task 선택, `AI 검토` 팝업 열기, `250910.jpg` 파일 근거 저장, assistant 답변 반영 확인 |

## Implementation Notes

SaaS 구현 내용:

- `File.metadata.analysis`에 파일 분석 결과를 저장한다.
- `sourceType`은 `manual_text`, `document_text`, `ocr_text`, `image_region`을 지원한다.
- `verificationState`는 `unverified`, `user_confirmed`, `rejected`를 지원한다.
- `/api/files/[fileId]/analysis`에서 파일 분석 결과를 저장/조회한다.
- `/daily` assistant 팝업에서 첨부 파일 목록, 분석 텍스트, 요약을 입력할 수 있다.
- assistant retrieval은 저장된 파일 analysis를 `project_document` evidence로 반환한다.
- 사용자 미확인 OCR/image 계열 근거는 낮은 confidence 상한을 적용하고 최종 판단 전 사용자 확인이 필요하다는 문구를 붙인다.

Browser assistant 구현 내용:

- 현재 slice에서는 extension code 변경 없이 cross-repo PRD/roadmap만 갱신했다.
- 화면 캡처, 선택 영역 OCR, Chrome extension API 호출은 04 이후 확장 slice에서 다룬다.

## Residual Risks

- 현재 first slice는 사용자가 확인한 텍스트/요약을 저장하는 방식이다. 서버 자동 추출, OCR provider, 이미지 영역 선택은 아직 없다.
- cloud DB에는 migration 적용이 필요하다.
- 파일 evidence가 많아질 경우 relevance ranking과 사용자 확인/반려 UI를 별도 개선해야 한다.

## 후속 Slice 후보

1. 텍스트 파일/TXT/CSV 직접 추출 및 자동 저장
2. PDF/DOCX/XLSX 서버 추출기 추가
3. 이미지 OCR provider 연동
4. Chrome extension 캡처 영역 분석
5. 사용자 확인/반려 UI와 confidence 승격
