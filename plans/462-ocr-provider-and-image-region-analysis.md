# 462. OCR Provider And Image Region Analysis

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `03-file-and-image-analysis.md`, `454-file-auto-text-extraction.md`, `461-postgres-hybrid-retrieval-indexing.md`
현재 상태: `implemented_verified`

## Goal

PNG/JPG/스캔 PDF/선택 영역 이미지 분석 축의 첫 실제 구현으로, 기존 file analysis evidence 경계에 OCR provider contract, 사용자 검토 OCR 텍스트, 선택 영역 metadata, provider 실행 gate를 연결한다.

## 선택한 Slice와 이유

이번 slice는 `OCR provider contract + user-reviewed OCR/region evidence + optional Tesseract provider gate`다.

선택 이유:

1. 454에서 문서 텍스트 자동 추출, 461에서 project document 검색 품질이 연결됐지만 이미지/스캔 문서는 여전히 corpus로 들어오지 못한다.
2. 실제 운영 OCR provider는 비용, 배포 환경, 언어 pack, PDF rasterizer 결정이 필요하므로 provider contract와 사용자 검토 경계를 먼저 닫는 것이 안전하다.
3. 기존 file analysis API가 이미 `ocr_text`와 `image_region` source type을 지원하므로 데이터 모델 blast radius가 작다.
4. 가짜 OCR 결과를 만들지 않고, provider가 없으면 명시적으로 실패시키고 사용자가 검토한 OCR/영역 텍스트만 저장한다.

## Product Gap Reassessment

| PLAN.md 기준 축 | 이전 상태 | 이번 slice 후 판단 |
| --- | --- | --- |
| 법규 DB/공식 출처 실체화 | foundation 완료 | 460 유지 |
| OCR/이미지 분석 | 미완료 | 사용자 검토 OCR/영역 evidence와 provider gate 구현 |
| Postgres text/vector/hybrid 검색 | text-hybrid 첫 구현 | 461 유지, OCR evidence가 검색 corpus로 합류 가능 |
| Knowledge admin 권한 모델 | 부분완료 | 457 guard 유지 |
| 공개 배포 readiness | 부분완료 | 455/459 유지, OCR provider 운영 env는 residual risk |

전체 기획서 기준 제품 완성도는 461 기준 약 82%에서 약 86%로 재평가한다. OCR 축은 file evidence로 들어갈 수 있게 됐지만, 스캔 PDF 자동 rasterize/OCR, production OCR provider 운영, vector/chunk index, signing이 남아 있어 90% 이상은 아직 아니다.

## Scope

1. file analysis metadata에 OCR provider/status와 선택 영역 좌표를 저장할 수 있게 한다.
2. `/api/files/:fileId/analysis`에 `mode: "ocr_extract"`를 추가한다.
3. 사용자 검토 OCR 텍스트 또는 선택 영역 텍스트는 `ocr_text`/`image_region` evidence로 저장한다.
4. `FILE_OCR_PROVIDER=tesseract_cli`가 구성된 경우 PNG/JPG 파일을 Tesseract CLI로 OCR한다.
5. provider가 없거나 스캔 PDF rasterizer가 없으면 명시적 error code로 실패한다.
6. `/daily` task assistant file evidence UI에서 manual/OCR/selected-region 모드와 region 좌표를 입력할 수 있게 한다.
7. OCR contract validator를 추가한다.

## Out Of Scope

- cloud OCR SaaS provider 연동
- 스캔 PDF 자동 rasterize 후 OCR
- 이미지 crop/region OCR 자동화
- 도면 치수/면적/거리 자동 판정
- OCR 결과의 법규 적합/부적합 자동 판정
- vector embedding/chunk table

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| OCR metadata/provider/status/region model | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| OCR provider domain contract | 구현 완료 | `architect-saas` | `npm run ocr:provider:validate` 통과 |
| optional Tesseract CLI provider gate | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| scanned PDF rasterizer-required gate | 구현 완료 | `architect-saas` | 코드 경로 확인 |
| `/api/files/:fileId/analysis` `ocr_extract` mode | 구현 완료 | `architect-saas` | `npm run typecheck` 통과 |
| `/daily` file evidence OCR/region UI | 구현 완료 | `architect-saas` | `npm run lint`, `npm run build` 통과 |
| slice 문서와 cross-repo worklog | 구현 완료 | 양 repo | 문서 갱신 |

## Route / Service / Repository 확인

- Route: `architect-saas/src/app/api/files/[fileId]/analysis/route.ts`는 `mode: "ocr_extract"` 요청을 `runOcrFileAnalysis()`로 보낸다.
- Service: `architect-saas/src/use-cases/file-service.ts`는 사용자 검토 OCR 텍스트와 provider OCR 결과를 기존 `saveFileAnalysis()` 경계로 저장한다.
- Domain: `architect-saas/src/domains/file/ocr.ts`는 `client_supplied`와 `tesseract_cli` provider contract를 제공한다.
- Metadata: `architect-saas/src/domains/file/analysis.ts`는 `provider`, `providerStatus`, `region`을 보존한다.
- Retrieval: 저장된 OCR/region analysis는 기존 `project_document` evidence 및 461 `searchFileAnalyses()` 검색 경로를 그대로 탄다.

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | OCR provider contract | `npm run ocr:provider:validate` 통과 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` 통과. 6 test files / 14 tests 통과, native-host self-test ok |

## Residual Risks

- Tesseract CLI는 배포 환경에 설치되어 있어야 하며 언어 pack도 운영 env에서 별도 관리해야 한다.
- 스캔 PDF 자동 OCR은 아직 PDF rasterizer가 없어 provider gate에서 막힌다.
- 선택 영역 자동 crop/OCR은 아직 없다. 이번 slice는 좌표 metadata와 사용자 검토 텍스트 저장을 먼저 닫았다.
- OCR confidence는 낮게 제한되며, 사용자 확인 전에는 최종 판단 근거가 아니라 review lead로만 취급한다.
- OCR UI는 `/daily` assistant panel 중심이며 Chrome extension 영역 선택 capture는 후속 구현이다.

## 다음 후보 Slice

1. Browser selected-region capture handoff was implemented in slice 463.
2. PDF rasterizer + Tesseract scanned PDF OCR provider
3. Dedicated searchable chunk table + pgvector/vector rerank
4. Chrome Web Store/native-host signing readiness gate
