# 454. File Auto Text Extraction

작성일: 2026-05-14
상위 문서: `../PLAN.md`
관련 문서: `03-file-and-image-analysis.md`
현재 상태: `implemented_verified`

## Goal

파일/OCR 자동 추출 축의 첫 실제 구현으로, task 첨부 TXT/CSV/XLSX/DOCX/텍스트 PDF 파일을 서버에서 자동 추출해 기존 file analysis evidence에 저장하고 assistant retrieval에 반영한다.

## Product Gap Reassessment

| PLAN.md 기준 축 | 상태 | 판단 |
| --- | --- | --- |
| 관리자 업로드 법규/프로젝트 기준 문서 | 부분완료 | 파일 업로드와 수동 분석 저장은 있으나 업로드 문서의 자동 추출/인덱싱은 부족하다. |
| MVP 파일 형식 텍스트 추출 | 부분완료 -> 이번 slice에서 개선 | TXT/CSV/XLSX/DOCX/텍스트 PDF 자동 추출을 먼저 닫고, 스캔 PDF/이미지 OCR provider는 후속 slice로 남긴다. |
| PNG/JPG OCR과 선택 영역 이미지 분석 | 미완료 | provider 선택, 비용/보안 경계, 사용자 확인 UI가 필요하다. |
| 검색 우선순위와 retrieval 품질 | 부분완료 | file analysis가 `project_document` evidence로 연결되지만 ranking은 단순하고 text/vector/hybrid 결정이 남아 있다. |
| Knowledge admin 권한 분리 | 부분완료 | Admin WIKI는 구현되어 있으나 현재 SaaS global admin 중심이고 별도 Knowledge admin capability 매핑은 남아 있다. |
| 공개 MVP 운영 준비도 | 부분완료 | SaaS readiness 문서는 있으나 browser assistant 통합 release gate는 별도 정리가 필요하다. |

제품 기능 축 기준 재평가: slice 개수 기준으로는 구현률이 매우 높지만, MVP 포함 항목 중 자동 문서 추출, 법규/기준 문서 검색 품질, Knowledge admin 권한 분리, 공개 운영 gate가 남아 있어 착수 시점 전체 제품 완성도는 약 78%로 재산정했다. 이번 slice와 455-457 batch가 검증되면 핵심 MVP 축은 약 88~90% 수준으로 올라간다.

## Implementation Status

| 항목 | 상태 | repo | 검증 |
| --- | --- | --- | --- |
| TXT/CSV 서버 자동 텍스트 추출 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| XLSX 서버 자동 텍스트 추출 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| DOCX 서버 자동 텍스트 추출 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| 텍스트 PDF 서버 자동 텍스트 추출 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| `/api/files/:fileId/analysis` 자동 추출 모드 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| `/daily` assistant 파일 근거 자동 추출 버튼 | 구현 완료 | `architect-saas` | `npm run typecheck`, `npm run lint` 통과 |
| 03 문서와 roadmap/worklog 갱신 | 구현 완료 | `architect-browser-assistant` | `npm run release:check` 통과 |

## Scope

1. 기존 file analysis 저장 API에 `mode: "auto_extract"`를 추가한다.
2. TXT/CSV는 UTF-8 텍스트로 추출한다.
3. XLSX는 `exceljs`로 sheet/row/cell 텍스트를 추출한다.
4. DOCX는 OOXML archive의 WordprocessingML 본문/주석/각주/머리말/꼬리말 텍스트를 추출한다.
5. 텍스트 PDF는 uncompressed/FlateDecode stream의 PDF text operator를 best-effort로 추출한다.
6. 추출 결과는 `document_text`, `unverified`, 낮은 confidence로 저장한다.
7. 스캔 PDF와 이미지 OCR은 같은 API 경계에서 명시적인 empty/unsupported 응답을 반환하고 후속 provider slice로 남긴다.

## Out Of Scope

- 이미지 OCR provider 연동
- vector index 또는 Postgres FTS migration
- 법규 문서 세트 seed/import
- 스캔 PDF OCR, 레이아웃 복원, 표/도면 의미 해석

## Verification Log

| 날짜 | 범위 | 결과 |
| --- | --- | --- |
| 2026-05-14 | 계획 작성 | 완료 |
| 2026-05-14 | SaaS 타입 검사 | `npm run typecheck` 통과 |
| 2026-05-14 | SaaS 린트 | `npm run lint` 통과. 기존 React Hook warning 7개만 남음 |
| 2026-05-14 | SaaS production build | `npm run build` 통과 |
| 2026-05-14 | Browser Assistant release gate | `npm run release:check` 통과 |

## Residual Risks

- 스캔 PDF와 이미지 파일은 아직 OCR되지 않아 도면/캡처 실사용 품질은 다음 slice에 의존한다.
- 텍스트 PDF 추출은 PDF text operator 기반 best-effort이며 복잡한 인코딩/레이아웃은 완전 복원하지 않는다.
- DOCX 추출은 WordprocessingML 텍스트 중심이며 embedded image, tracked change 의미, 복잡한 표 레이아웃은 해석하지 않는다.
- XLSX 추출은 sheet/row text 중심이며 수식, 병합 셀, 스타일 의미 해석은 하지 않는다.
- 추출 텍스트는 기존 metadata JSON에 저장되므로 대량 문서 검색 품질 개선에는 별도 검색 인덱스 slice가 필요하다.

## Next Slice Candidates

1. OCR provider와 선택 영역 이미지 분석 연결
2. Postgres text/vector/hybrid search decision 및 retrieval ranking 개선
3. 법규 문서 세트 seed/import와 검색 품질 평가 세트
4. Knowledge admin RBAC capability 분리
5. Chrome/native-host signing과 배포 채널 검증
