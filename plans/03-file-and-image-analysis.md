# 03. File And Image Analysis PRD

작성일: 2026-05-08
상위 문서: `../PLAN.md`
현재 상태: `in_progress`

## Goal

`/daily`에서 선택한 건축 task의 첨부 파일 분석 결과를 Task Assistant 근거로 저장하고 검색한다. 첫 구현은 PC 팝업 assistant 안에서 사람이 확인한 파일 텍스트/요약을 저장하는 vertical slice로 제한한다.

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

1. 선택 task의 assistant 팝업에서 첨부 파일 목록을 볼 수 있다.
2. 파일별 분석 텍스트와 요약을 저장할 수 있다.
3. 저장된 분석 결과가 다음 assistant 근거 조회에 `project_document` evidence로 나타난다.
4. 미확인 파일/OCR 근거의 낮은 confidence 정책이 코드에 반영된다.
5. TypeScript typecheck와 lint를 통과한다.

## 후속 Slice 후보

1. 텍스트 파일/TXT/CSV 직접 추출 및 자동 저장
2. PDF/DOCX/XLSX 서버 추출기 추가
3. 이미지 OCR provider 연동
4. Chrome extension 캡처 영역 분석
5. 사용자 확인/반려 UI와 confidence 승격
