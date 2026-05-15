Req: 핵심 미완성축을 모두 닫아 제품 완성도를 90% 이상으로 높이는 goal의 첫 core slice로 파일/OCR 자동 추출 축을 진행한다.
Diff: `plans/454-file-auto-text-extraction.md`를 추가하고, `plans/03-file-and-image-analysis.md`와 `plans/README.md`를 자동 TXT/CSV/XLSX/DOCX/텍스트 PDF 추출 slice 중심으로 갱신했다. 구현 변경은 `architect-saas`에 있다.
Why: 기존 03 slice는 사용자가 붙여 넣은 파일 근거만 저장했으므로 MVP 포함 항목인 파일 텍스트 자동 추출과 프로젝트 기준 문서 검색 품질을 끌어올리기 어렵다.
Verify/Time: 2026-05-14 17:10-17:35 KST, SaaS `npm run typecheck`, `npm run lint`, `npm run build` 통과. Browser Assistant `npm run release:check` 통과.
