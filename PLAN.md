# Architect Browser Assistant 기획서

작성일: 2026-05-07
작업 위치: `D:\architect-workspace\architect-browser-assistant`
연동 대상 SaaS: `D:\architect-workspace\architect-saas`

## 1. 제품 방향

Architect Browser Assistant는 건축 업무 task 검토에 특화된 Chromex 참고 구조 기반 브라우저 어시스턴트다.

이 제품은 일반 챗봇이 아니다. 사용자가 SaaS의 task를 중심으로 질문하면, 중앙 공식 지식 DB, 법규 DB, 프로젝트 업무 데이터, 첨부파일 분석 결과, 웹/스킬 결과를 근거로 검토 의견을 제공하고, 그 결과를 다시 조직 지식으로 축적하는 서비스다.

추천 제품 방향은 다음과 같다.

```text
SaaS DB 우선 참조
  + Chromex-inspired 로컬 브라우저 도구
  + 사용자 로컬 ChatGPT/Codex 실행
  + 관리자 승인 기반 지식 축적 루프
```

참고 방향:

- Chromex: <https://github.com/GENEXIS-AI/chromex>
- Karpathy LLM Wiki 패턴: <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>

Chromex는 reference implementation이자 필요 시 코드 출처로 참고하는 대상이다. Architect Browser Assistant는 Chromex와 런타임 연동되는 서비스가 아니며, live Chromex service나 upstream Chromex repo에 의존하지 않는다.

Chromex 코드를 가져오는 경우 MIT license와 attribution을 보존하고, 이 repo의 아키텍처에 맞게 별도 코드로 편입한다. local bridge/runtime도 Architect Browser Assistant 전용으로 설계한다.

## 2. repo와 책임 경계

워크스페이스는 기존대로 multi-repo 구조를 유지한다.

```text
D:\architect-workspace\
  architect-saas\
  architect-browser-assistant\
```

`architect-browser-assistant`가 맡는 범위:

- Chrome extension UI
- task 중심 side panel
- 브라우저 컨텍스트 수집
- local bridge / local ChatGPT 또는 Codex 연결
- 웹/스킬 사용 제어
- SaaS API 호출
- extension 진단과 패키징

`architect-saas`가 맡는 범위:

- SaaS 인증
- 조직, 프로젝트, 역할 권한
- task 데이터
- 파일과 추출 텍스트
- 검색/retrieval API
- assistant 기록 저장
- 지식 후보 관리
- 중앙 공식 지식 DB
- 관리자 WIKI
- 감사 로그

extension은 production DB에 직접 접속하지 않는다.

## 3. MVP 제품 가설

MVP는 다음 흐름이 실제 건축 task 검토 품질을 올리는지 검증한다.

1. 조직의 승인된 중앙 공식 지식을 먼저 검색한다.
2. 법규 DB와 공식 출처를 확인한다.
3. 현재 task와 프로젝트 맥락을 연결한다.
4. 기본 답변 생성은 사용자 로컬 ChatGPT/Codex 로그인으로 수행한다.
5. assistant 답변 원문과 근거는 task assistant 기록에 자동 저장한다.
6. AI가 결론, 태그, 적용 범위, 신뢰도, 후속 조치 초안을 제안하고 사용자가 승인/수정한다.
7. 관리자는 반복 가치가 있는 내용을 중앙 공식 지식 DB와 WIKI로 승격한다.

지식 축적 루프:

```text
task 업무
  -> assistant 질문/답변
  -> task assistant 기록 자동 저장
  -> 사용자 작업 기록 정리
  -> 관리자 AI 분류
  -> Knowledge admin 승인/수정/반려
  -> 중앙 공식 지식 DB/WIKI 반영
  -> 이후 답변 품질 향상
```

## 4. 실행 모드

### 4.1 기본 실행: 사용자 로컬 ChatGPT/Codex 로그인

MVP 기본 실행은 사용자의 로컬 ChatGPT/Codex 로그인 기반이다.

SaaS는 사용자의 ChatGPT/Codex 인증 정보나 세션 토큰을 저장하지 않는다.

local 실행 경로는 답변 생성과 로컬 도구 사용을 담당한다. SaaS는 검색, 권한 확인, 근거 데이터 제공, task 기록 저장, 지식 관리와 감사 로그를 담당한다.

### 4.2 SaaS API 모드

SaaS API 모드는 MVP에서 실제 구현하지 않는다.

다만 조직/관리자가 원할 때 후속 단계에서 켤 수 있도록 아키텍처와 데이터 모델에는 확장 가능성을 남긴다.

후속 SaaS API 모드에는 다음이 필요하다.

- 조직 단위 활성화
- 사용자/프로젝트별 사용량 제한
- 비용 추적
- 감사 로그
- 관리자 정책
- local ChatGPT/Codex 실행과 구분되는 실행 모드 기록

### 4.3 GPT/Codex 계정이 없는 사용자

GPT/Codex 계정이 없거나 무료/제한 계정인 사용자도 SaaS 업무 기능에서 배제되지 않아야 한다.

가능한 기능:

- SaaS 로그인
- task 열람
- 기존 assistant 기록 열람
- 권한이 허용된 WIKI와 공식 지식 열람
- 법규/근거 검색 결과 열람
- task 기록 관리

새 AI 답변 생성은 다음 중 하나가 가능할 때만 제공한다.

- 사용자의 local ChatGPT/Codex 연결이 가능함
- 후속 단계에서 조직 SaaS API 모드가 활성화됨

## 5. 데이터 구조

MVP에서는 물리 DB를 3개로 나누지 않는다.

기존 `architect-saas`의 하나의 Supabase Postgres 안에서 데이터 영역을 논리적으로 분리한다.

```text
Supabase Postgres
  1. 프로젝트 업무 데이터
     - projects
     - tasks
     - files
     - task assistant threads
     - task assistant messages
     - user-approved work summaries

  2. 지식 후보 데이터
     - knowledge candidates
     - candidate sources
     - candidate review logs
     - AI classification suggestions

  3. 중앙 공식 지식 데이터
     - knowledge items
     - knowledge sources
     - WIKI pages
     - tags/categories
     - publication scope
     - approval history
```

Supabase Storage는 다음 원본 파일을 보관한다.

- 프로젝트 첨부파일
- 법규 문서
- 프로젝트 기준 문서
- task 관련 분석 대상 파일

파일에서 추출한 텍스트와 검색 메타데이터는 Postgres에 저장한다.

중앙 공식 지식 영역은 향후 규모가 커질 경우 전용 검색 엔진이나 별도 지식 저장소로 분리할 수 있도록 테이블과 API 경계를 독립적으로 설계한다.

## 6. 지식 범위와 공개 범위

MVP의 중앙 공식 지식 DB는 조직 단위로 운영한다.

같은 조직 안의 여러 프로젝트에서 얻은 답변, 검토 결과, 실무 인사이트는 관리자 승인 후 조직 공통 지식으로 통합할 수 있다.

고객/조직 간 프로젝트 데이터 공유는 MVP 범위에서 제외한다.

지원할 공개 범위 모델:

- `admin_only`: 관리자만 열람
- `organization`: 같은 조직 사용자 전체
- `project_members`: 특정 프로젝트 멤버만
- `role_restricted`: manager/editor/viewer 등 역할별 제한
- `project`: 특정 프로젝트 전용 지식
- `global_template`: 후속 단계에서 서비스 운영자가 제공하는 공통 템플릿/기본 법규 지식

초기 WIKI와 중앙 공식 지식은 관리자에게만 노출한다.

향후 사용자용 WIKI가 필요해질 때 항목별 공개 범위 설정으로 확장한다.

## 7. 검색 우선순위

assistant는 다음 순서로 근거를 검색한다.

1. 중앙 공식 지식 DB
   - 실시단계 반복 검토사항
   - 과거 승인 인사이트
   - Knowledge admin이 승인한 WIKI 지식
   - 조직 공통 기준

2. 법규 DB와 공식 출처
   - 한국 건축 관련 법령, 시행령, 시행규칙
   - 고시, 국토교통부 자료
   - 지자체 조례, 심의 기준, 인허가 기준
   - 관리자가 허용한 공식 출처 도메인

3. 현재 task와 같은 프로젝트의 업무 데이터
   - 현재 task
   - 같은 프로젝트의 관련 task
   - 과거 assistant 질문/답변
   - 댓글, 검토 결과, decision, status history

4. 해당 프로젝트 기준 문서와 첨부파일 추출 텍스트
   - 프로젝트 특수 기준
   - 회의록, 검토서, 도면 관련 문서
   - 첨부파일에서 추출한 텍스트
   - 프로젝트별 승인 문서

5. 사용자 요청 기반 웹/스킬 사용
   - 사용자가 웹 검색이나 스킬 사용을 요청한 경우
   - DB 근거가 부족해 assistant가 추가 확인을 제안하고 사용자가 허용한 경우

6. 웹/스킬 결과의 근거 후보 저장
   - 웹/스킬 결과는 즉시 공식 지식으로 쓰지 않는다.
   - 출처, 요약, 사용 맥락을 task assistant 기록에 남긴다.
   - 관리자 AI가 나중에 중앙 지식 후보로 분류할 수 있다.
   - Knowledge admin 승인 후에만 중앙 공식 지식 DB에 반영한다.

## 8. 웹/스킬 사용 정책

웹/스킬 사용 권한은 혼합 방식으로 설계한다.

기본 원칙:

- 사용자가 요청할 때 웹/스킬을 사용한다.
- DB 근거가 부족하면 assistant가 추가 웹/스킬 사용을 제안할 수 있다.

관리자 통제:

- 법규/업무 검토용 공식 출처는 관리자가 허용 목록으로 관리한다.
- 필수 스킬이나 허용 스킬도 관리자가 설정할 수 있다.
- 외부 웹 결과는 관리자 승인 전까지 공식 지식이 아니다.

assistant는 open web보다 SaaS DB, 중앙 공식 지식, 공식 출처를 우선한다.

## 9. extension API 보안 경계

extension은 SaaS API를 호출하지만, production DB나 Supabase service role credential에 직접 접근하지 않는다.

MVP API 보안 원칙:

- SaaS session과 기존 SaaS 인증 체계를 사용한다.
- SaaS API는 서버 측에서 사용자, 조직, 프로젝트 권한을 다시 검증한다.
- extension origin과 호출 경로를 명확히 제한한다.
- request integrity, CSRF, allowed origin 정책은 `architect-saas` 기존 보안 패턴을 따른다.
- ChatGPT/Codex credential, SaaS service role key, OpenAI API key는 extension storage에 저장하지 않는다.
- extension storage에는 최소 설정과 비민감 상태만 저장한다.
- task context, 검색 근거, assistant 기록 저장은 항상 SaaS API를 통해 수행한다.
- 권한 실패, 세션 만료, runtime unavailable 상태를 UI에서 명확히 표시한다.

이 보안 경계의 세부 구현은 첫 하위 계획 문서와 `architect-saas` API contract 문서에서 구체화한다.

## 10. task assistant 기록

assistant 질의/답변은 일반 task 댓글과 분리된 전용 대화 스레드로 저장한다.

사용자는 task 화면에서 자연스럽게 확인하지만, 데이터 모델은 일반 댓글과 분리한다.

각 assistant thread/message는 다음 메타데이터를 가진다.

- task ID
- 사용자 ID
- 질문
- 답변
- 사용 근거
- 검색 우선순위와 검색 결과
- 웹/스킬 사용 여부
- local login 또는 후속 SaaS API 실행 모드
- 신뢰도 점수
- 생성 시간
- 사용자 작업 기록 정리 상태
- 관리자 AI 분류 상태

## 11. 답변 자동 저장과 작업 기록 정리 UX

assistant 답변 원문과 근거는 자동으로 task assistant 기록에 저장한다.

사용자에게 "중앙 지식 후보로 제출하시겠습니까?"라고 묻지 않는다.

사용자 경험은 "내 프로젝트와 task 기록을 더 잘 정리한다"는 방향이어야 한다.

흐름:

```text
assistant 답변 생성
  -> 답변 원문과 근거 자동 저장
  -> AI가 결론/태그/적용 범위/신뢰도/후속 조치 초안 생성
  -> 사용자가 승인/수정/나중에 처리
  -> 승인된 정리본은 task와 프로젝트 DB 품질을 높임
  -> 관리자 AI가 나중에 중앙 지식 후보 여부를 분류
```

자동 저장 대상:

- 질문
- 답변 원문
- 사용 근거
- 사용된 DB/웹/스킬 출처
- 사용자, task, 생성 시간
- 실행 모드

사용자 확인 후 저장 대상:

- 결론 요약
- 태그
- 적용 범위
- 신뢰도 설명
- 후속 조치
- 프로젝트 기록용 정리본

권장 UX 문구:

- "이 검토 내용을 저장해 작업 기록을 정리할까요?"
- "AI가 정리한 결론을 확인해 주세요."
- "저장하면 이 task의 검토 이력이 더 명확해집니다."
- "태그와 결론은 나중에 수정할 수 있습니다."
- "법규 근거는 검토 기록에 함께 남습니다."

## 12. Review Closure Gate

Review Closure Gate는 모든 task에 적용하지 않는다.

assistant가 개입한 task에만 적용한다.

적용 대상:

- 해당 task에서 assistant 질의를 실행한 경우
- assistant 답변을 task 공식 기록으로 저장하려는 경우
- assistant 답변을 바탕으로 task를 완료하려는 경우
- 법규 체크/실무 검토/첨부파일 분석 결과가 생성된 경우
- 이미지/OCR 분석 결과가 답변 근거로 사용된 경우

적용하지 않는 대상:

- assistant를 사용하지 않은 일반 task
- 단순 task 생성/수정/정렬
- 임시 대화 후 업무 기록으로 저장하지 않은 경우
- 단순 검색만 하고 답변을 저장하지 않은 경우

task 완료 또는 공식 정리본 저장 시 요구할 필드:

- 결론
- 신뢰도와 산정 사유
- 적용 범위
- 근거 확인 여부
- 후속 조치

AI가 먼저 초안을 만들고, 사용자는 승인하거나 수정한다.

## 13. 법규 체크 답변 정책

법규 체크는 최종 법적 판정이 아니라 업무 검토 의견이다.

허용되는 표현:

- "현재 근거 기준으로는 적합 가능성이 높습니다."
- "다음 조항 확인이 필요합니다."
- "지자체 기준 확인 전에는 확정할 수 없습니다."
- "추가 검토가 필요한 리스크가 있습니다."

금지되는 표현:

- "무조건 적법합니다."
- "인허가 통과됩니다."
- "이대로 진행해도 문제 없습니다."

모든 법규 답변에는 다음이 포함되어야 한다.

- 사용한 법규/문서 출처
- 조항, 페이지, 섹션
- 기준일 또는 문서 버전
- 불확실한 부분
- 추가 확인이 필요한 기관/자료
- 최종 실무 검토 필요 표시

## 14. 신뢰도 점수

assistant 답변은 0-100% 신뢰도 점수를 표시한다.

이 점수는 법적 확정이나 인허가 가능성 보장이 아니다.

신뢰도는 다음 요소를 기반으로 한 검토 보조 지표다.

- 근거 충실도
- 출처 신뢰도
- 출처 최신성
- 프로젝트 조건 일치도
- 근거 간 충돌 여부
- 공식 법규 근거 존재 여부
- 이미지/OCR 결과의 사용자 확인 여부

표시 예시:

- `신뢰도 88%`: 중앙 공식 지식, 공식 법규 출처, 프로젝트 기준이 일치함
- `신뢰도 64%`: 공식 법규 근거는 있으나 프로젝트 조건 확인 필요
- `신뢰도 42%`: 웹/스킬 참고 결과 중심이며 공식 근거 부족

답변 화면에는 점수뿐 아니라 다음을 함께 표시한다.

- 점수 산정 이유
- 점수를 제한한 조건
- 신뢰도를 높이기 위해 추가 확인할 근거

## 15. 법규 DB 구축

MVP 법규 DB는 관리자 업로드와 공식 출처 링크 기반으로 시작한다.

MVP 포함 범위:

- 관리자 업로드 법규 PDF
- 지자체 기준
- 심의 기준
- 인허가 기준
- 프로젝트 기준 문서
- 문서 텍스트 추출과 검색 인덱스
- 출처 URL
- 문서명
- 기준일
- 버전
- 업로드자
- 승인 상태

자동 크롤링/정기 업데이트는 MVP에서 사용자 기능으로 열지 않는다.

다만 이후 확장 가능하도록 데이터 모델에는 다음을 고려한다.

- source type: `uploaded`, `official_url`, `crawler`
- source URL
- collected at
- effective date
- version
- superseded by
- freshness status
- review status

자동 수집 문서는 관리자 검토 전까지 공식 지식으로 반영하지 않는다.

## 16. 파일과 이미지 분석

MVP 파일 분석 범위:

- PDF
- DOCX
- XLSX
- TXT
- CSV
- PNG/JPG 이미지 OCR
- 스크린샷/도면 일부 캡처 텍스트 추출
- 치수, 실명, 표기, 메모, 주요 키워드 감지
- 사용자가 선택한 영역 중심 분석

MVP 이미지 분석 제한:

- 전체 도면 자동 판독 제외
- CAD/BIM 직접 해석 제외
- 축척 기반 면적/거리 계산 자동 판정 제외
- 이미지 분석만으로 법규 적합/부적합 확정 금지
- 사람 확인 전 이미지/OCR 근거는 낮은 신뢰도 가중치 적용

이미지 분석 결과는 task assistant 기록의 근거로 저장하고, 사용자 또는 관리자의 확인을 거친다.

## 17. 관리자 WIKI

관리자 WIKI는 별도 repo가 아니라 `architect-saas`의 관리자 모듈로 시작한다.

공유하는 범위:

- SaaS 인증
- 조직/프로젝트 권한
- task와 assistant 기록
- 중앙 지식 DB
- 감사 로그

MVP route 개념:

```text
/admin/knowledge
```

관리자 WIKI MVP 범위:

1. 지식 후보 목록 보기
2. AI 분류/요약/중복 후보/관련 링크 제안 보기
3. 승인/수정/반려
4. 중앙 공식 지식 WIKI 검색/열람
5. 항목별 출처와 승인 이력 확인
6. Obsidian/Notion export 또는 sync를 위한 내부 Markdown 구조 보존

초기에는 관리자에게만 노출한다.

향후 사용자에게도 공개할 수 있도록 항목별 공개 범위 모델을 유지한다.

## 18. LLM WIKI 패턴

Karpathy LLM Wiki 방식은 다음 구조로 반영한다.

```text
raw source
  -> AI compile
  -> structured Markdown WIKI
  -> human review
  -> approved official knowledge
```

raw source:

- task assistant 답변
- 사용자 승인 작업 정리본
- 댓글
- 검토 결과
- 첨부파일 분석
- 이미지/OCR 분석
- 법규 문서
- 프로젝트 기준 문서

AI compile:

- 요약
- 태그
- 중복 후보 탐지
- 상충 지식 탐지
- 관련 WIKI 링크 제안
- WIKI 페이지 초안 생성
- 출처 연결

structured WIKI:

- Markdown body
- WIKI links
- tags
- source references
- approval state
- publication scope

human review:

- Knowledge admin이 승인/수정/반려
- 승인된 항목만 중앙 공식 지식 DB에 반영

SaaS DB가 source of truth다.

Obsidian/Notion은 후속 export, sync, view 대상이며 MVP 원본 저장소가 아니다.

## 19. Obsidian/Notion 방향

MVP에서는 Markdown 호환 내부 구조를 보존한다.

MVP에 포함하지 않는 것:

- Obsidian vault export
- Notion database/page sync
- graph view
- Obsidian/Notion에서 공식 지식 직접 편집

후속 확장:

- 승인된 WIKI를 Obsidian vault로 export
- 승인된 WIKI를 Notion database/page로 sync
- SaaS 안에서 WIKI graph view 제공
- 사용자용 읽기 WIKI 제공

별도 정책이 생기기 전까지 공식 원본은 SaaS DB다.

## 20. 역할과 권한

관리자 역할은 분리한다.

### Project manager

- 특정 프로젝트 멤버/업무 관리
- 프로젝트 기준 문서 관리
- 프로젝트 내 task와 검토 기록 확인

### Knowledge admin

- 중앙 공식 지식 승인/수정/반려
- 관리자 WIKI 관리
- AI 분류/요약/중복 제안 검토
- 지식 공개 범위 설정
- Obsidian/Notion export/sync 설정 관리

### System admin

- 조직 전체 사용자/권한/설정 관리
- SaaS API 모드 활성화 여부 관리
- 사용량/감사 로그/보안 정책 관리

MVP에서 기존 SaaS 권한 체계에 임시 매핑할 수는 있지만, 제품 설계상 Knowledge admin 권한은 Project manager와 분리한다.

## 21. 브라우저 assistant UX

MVP 기본 화면은 PC 전용 task 중심 assistant panel이다.

제품 검증 기준은 별도 assistant 테스트 페이지가 아니라 기존 SaaS 업무 화면과 함께 쓰는 흐름이다. 사용자는 `/daily` 또는 `/board`에서 task를 클릭하고, 같은 화면 안에서 assistant를 켜고 끄며, 선택된 task에 반응하는 답변과 검토 의견을 받아야 한다.

구현 우선순위:

1. SaaS 화면 안의 PC 전용 floating/docked assistant panel
2. Chrome MV3 side panel
3. Chrome action popup은 보조 진입점으로만 사용

Chrome action popup은 포커스를 잃으면 닫히는 UX 특성 때문에 장시간 task 검토용 기본 화면으로 쓰지 않는다. 구현 난이도나 배포 제약이 있을 경우 MVP는 Chrome 전용으로 제한해도 되지만, 사용 흐름은 항상 "task 클릭에 반응하는 assistant"여야 한다.

side panel 중심 정보:

- 현재 선택된 task
- task 제목과 설명
- 관련 첨부파일
- 이전 assistant 기록
- 검색된 근거
- 사용자 질문 입력
- 생성 답변
- 신뢰도 점수
- 출처
- 작업 기록 정리 초안

세부 UI, 정보 밀도, 시각 디자인, 답변/근거/정리 영역 배치는 후속 디자인 검토와 UI/UX 테스트를 통해 수정 가능하게 둔다.

이 문서는 흐름과 정보 구조를 정의하고, 최종 화면 디자인을 확정하지 않는다.

## 22. 브라우저 동작 범위

MVP는 `architect-saas` task 화면 중심으로 동작하며, 모바일 구현은 후속 확장으로 둔다.

MVP:

- SaaS task 컨텍스트 자동 인식
- `/daily` task row/card 클릭에 반응
- 현재 task 기준 PC 전용 assistant panel 사용
- task, 첨부파일, 선택 영역, 프로젝트 컨텍스트 기반 분석
- assistant 기록을 SaaS task에 저장

후속:

- 모바일 assistant UX
- Chrome extension side panel의 production-grade 배포
- 외부 법규/지자체/자료 사이트에서 선택 텍스트 분석
- 외부 페이지 내용을 task 기록에 연결
- 관리자가 허용한 도메인에서만 업무 기록 저장
- 외부 웹/스킬 결과는 관리자 승인 전 공식 지식으로 사용하지 않음

## 23. assistant 실행 범위

MVP assistant는 답변과 제안 중심으로 동작한다.

가능한 것:

- task 관련 질의 답변
- 법규/실무 검토 의견 제시
- 첨부파일/이미지 분석 결과 요약
- 후속 task 생성 제안
- task 제목/내용/담당자/기한 초안 생성
- 작업 기록 정리 초안 생성
- 관리자 AI 분류 영역으로 후보성 자료 전달

자동으로 하지 않는 것:

- task 자동 수정
- task 자동 완료 처리
- 중앙 지식 자동 승인
- 법규 적합성 확정 판정
- 권한/공개 범위 자동 변경

실제 task 생성/수정/완료는 사용자 확인 후 SaaS가 통제하는 UI/API 경로로 처리한다.

## 24. 감사 로그와 거버넌스

SaaS는 다음을 기록해야 한다.

- 누가 assistant 질문을 했는지
- 어떤 task와 프로젝트에 연결되었는지
- 어떤 근거가 검색되었는지
- 웹/스킬을 사용했는지
- 어떤 실행 모드였는지
- 어떤 답변이 생성되었는지
- 어떤 신뢰도 점수가 표시되었는지
- 사용자가 어떤 정리본을 승인했는지
- 어떤 관리자가 지식을 승인/수정/반려했는지
- 공개 범위가 어떻게 변경되었는지

감사 로그는 신뢰, 디버깅, 조직 API 모드, 법규 검토 책임 경계에 필요하다.

## 25. 개인정보와 데이터 경계

MVP는 업무 공간 데이터만 저장한다.

저장 대상:

- task에 연결된 assistant 질문
- assistant 답변
- 근거와 출처
- task 정리본
- task 업무와 연결된 댓글/검토 기록
- 첨부파일/이미지 분석 결과

저장하지 않는 대상:

- ChatGPT/Codex 인증 정보
- 개인 로컬 메모
- 업무 공간 밖 브라우저 페이지 내용
- task 업무와 연결되지 않은 개인 프롬프트
- 사용자가 업무 기록으로 캡처하지 않은 외부 페이지 내용

제품은 조직 업무 공간에서 생성된 task 기록이 조직의 프로젝트 기록과 지식 DB 품질 향상에 사용될 수 있음을 명확히 알려야 한다.

## 26. MVP 범위

이 문서에서 말하는 MVP는 전체 제품의 첫 공개 가능한 최소 제품 범위다. MVP는 하나의 구현 작업이 아니라 여러 하위 실행 계획 문서의 합으로 완성된다.

첫 구현 단위는 `plans/01-task-assistant-core-loop.md`의 `Task Assistant Core Loop` vertical slice다. 첫 slice는 local runtime, SaaS retrieval, task assistant 기록 저장, 작업 기록 정리의 핵심 루프만 검증한다. 관리자 WIKI, 파일/OCR, 웹/스킬 확장, SaaS API 모드는 별도 하위 계획 문서로 순차 진행한다.

MVP 포함:

- Chromex 참고 구조 기반 extension foundation
- PC 전용 task-reactive assistant panel
- Chrome extension side panel foundation
- SaaS DB retrieval API
- 검색 우선순위 모델
- local ChatGPT/Codex 실행 경로
- task assistant thread 저장
- 답변 원문과 근거 자동 저장
- 사용자 작업 기록 정리 UX
- 퍼센트 기반 신뢰도 점수
- 법규 답변 정책
- 관리자 업로드 법규/프로젝트 기준 문서
- MVP 파일 형식 텍스트 추출
- PNG/JPG OCR과 선택 영역 이미지 분석
- 지식 후보 파이프라인
- 관리자 WIKI
- Knowledge admin 승인/수정/반려
- Markdown 호환 WIKI 저장
- 역할과 공개 범위 모델

MVP 제외:

- SaaS API 모드 실제 구현
- 조직 간 지식 공유
- 자동 법규 크롤링/정기 업데이트 기능 노출
- 전체 도면 자동 판독
- CAD/BIM 직접 파싱
- 축척 기반 법규 자동 판정
- Obsidian export
- Notion sync
- graph view
- 사용자용 WIKI 화면
- 외부 웹페이지 task 캡처의 실제 구현

## 27. 권장 구현 순서

사용자 검토와 승인 전에는 구현을 시작하지 않는다.

승인 후 권장 순서:

1. `plans/01-task-assistant-core-loop.md`를 기준으로 첫 vertical slice 구현 계획을 확정한다.
2. `/daily`에서 task 클릭에 반응하는 PC 전용 assistant panel을 먼저 구현한다.
3. SaaS assistant API contract 정의
4. assistant 기록과 knowledge 데이터 모델 정의
5. task, 프로젝트, 법규, 중앙 지식 retrieval API 설계
6. SaaS에 assistant thread와 답변 저장 구조 추가
7. `architect-browser-assistant`에 extension foundation 구성
8. extension과 SaaS task 컨텍스트/API 연결
9. Architect Local Assistant Runtime adapter 구현
10. local ChatGPT/Codex 실행 경로 연결
11. 작업 기록 정리 UX 추가
12. Knowledge admin 후보 큐의 최소 연결
13. 첫 task assistant core loop end-to-end 검증
14. 이후 관리자 WIKI, 파일/OCR, 웹/스킬 확장 세부 계획을 순차 작성한다.

## 28. 하위 실행 계획 문서

`PLAN.md`는 전체 제품 방향과 아키텍처 기준 문서다.

세부 요구사항, 구현 단위, 검토 기준, 테스트 기준, 구현 완료 기록은 `plans/` 아래 하위 계획 문서에서 관리한다.

`PLAN.md`에는 전체 방향성과 변경되면 안 되는 상위 원칙을 유지하고, 세부 구현 판단은 해당 하위 문서를 참조한다.

slice 계획, goal 기반 작업, 구현 상태 갱신, worklog 작성이 필요한 경우 `$slice-planning-worklog` 스킬을 사용한다.

권장 문서 구조:

```text
architect-browser-assistant/
  PLAN.md
  docs/
    worklogs/
  plans/
    01-task-assistant-core-loop.md
    02-knowledge-admin-wiki.md
    03-file-and-image-analysis.md
    04-web-and-skill-expansion.md
    05-saas-api-mode.md
```

첫 실행 계획은 `01-task-assistant-core-loop.md`다.

첫 vertical slice에는 local ChatGPT/Codex runtime을 포함한다. 이 기능이 없으면 실제 제품 가치 검증이 불완전하기 때문이다. 다만 Chromex와 직접 연동하지 않고, Architect Browser Assistant 전용 runtime adapter를 둔다. 개발과 자동 테스트를 위해 mock runtime도 함께 둔다.

각 하위 계획 문서는 다음 운영 규칙을 따른다.

- 문서 상단에 현재 상태를 표시한다: `planning`, `approved`, `in_progress`, `implemented`, `deferred`.
- 구현이 완료되면 해당 하위 문서에 구현 완료 사실을 남긴다.
- 완료 기록에는 commit hash, worklog 링크, 검증 명령/수동 검증 결과, 남은 제한 사항을 포함한다.
- 세부 테스트 기준과 검토 결과는 `PLAN.md`가 아니라 해당 하위 문서에 축적한다.

## 29. cross-repo 작업 운영 규칙

이 제품은 `architect-browser-assistant`와 `architect-saas`를 함께 수정할 수 있다.

cross-repo 변경 원칙:

- browser assistant repo는 extension, local runtime, side panel, browser context, extension packaging을 담당한다.
- SaaS repo는 auth, RBAC, retrieval API, assistant records, knowledge data, Admin WIKI, audit log를 담당한다.
- SaaS API/data model 변경이 필요하면 `architect-saas`에도 별도 worklog와 commit을 남긴다.
- 양쪽 repo를 함께 수정한 경우 각 repo의 worklog에서 상대 repo의 commit 또는 계획 문서를 참조한다.
- 가능하면 같은 작업명 또는 같은 slice 이름을 사용해 commit과 worklog를 연결한다.
- 한쪽 repo의 구현 상태가 다른 repo의 미구현 API에 의존하면 하위 계획 문서에 blocking dependency로 표시한다.
- extension은 SaaS API contract를 기준으로 개발하며, DB schema에 직접 의존하지 않는다.

## 30. worklog와 commit 운영 규칙

앞으로 개발 작업은 commit과 worklog를 함께 누적한다.

새 slice 문서 또는 worklog 구조를 만들 때는 `$slice-planning-worklog` 스킬과 helper script를 우선 사용한다.

worklog 위치:

```text
docs/worklogs/YYYY-MM-DD-HHMM-<short-slug>.md
```

worklog 형식은 기존 `architect-saas`의 compact worklog 관행을 따른다.

```text
Req: 사용자의 요청 또는 작업 목표
Diff: 변경된 파일과 핵심 변경 요약
Why: 왜 이 변경이 필요한지
Verify/Time: 실행한 검증과 작업 시간 또는 완료 시각
```

운영 원칙:

- 의미 있는 계획/구현/검증 변경마다 worklog를 남긴다.
- worklog는 해당 commit에 함께 포함한다.
- 구현 commit 후 관련 하위 계획 문서의 구현 상태를 갱신한다.
- 하위 계획 문서는 "무엇이 구현되었는지", "어떻게 검증했는지", "무엇이 남았는지"를 추적한다.
- `PLAN.md`는 전체 방향 문서이므로 상세 검증 로그를 직접 누적하지 않고 하위 문서와 worklog를 참조한다.

이번 검토에서 `find-skills`로 worklog 관련 skill을 검색했지만, 검색 결과의 설치 수가 낮아 외부 skill은 설치하지 않았다. 대신 기존 repo에서 검증된 compact worklog 방식을 이 프로젝트 운영 규칙으로 채택한다.

이 프로젝트 전용으로 `slice-planning-worklog` 스킬을 생성했다. 향후 goal을 사용하거나 slice별 계획/구현 상태/worklog를 관리할 때 이 스킬을 먼저 적용한다.

## 31. 구현 전 재검토 항목

아래 항목은 이 기획서의 방향을 막지는 않지만, 실제 구현 계획을 작성하기 전에 구체화해야 한다.

- 첫 구현 전 local ChatGPT/Codex runtime discovery/spike 수행
- local ChatGPT/Codex bridge 방식
- Chromex에서 어떤 구조/코드를 참고하거나 가져오고, 어떤 부분을 새로 작성할지
- 검색 방식: Postgres text search, vector search, hybrid search, 단계적 적용 여부
- 파일 추출 라이브러리와 OCR provider
- 초기 법규 문서 세트
- 현재 SaaS 권한 모델에서 Knowledge admin을 어떻게 매핑할지
- side panel과 Admin WIKI UI/UX
- 감사 로그 보관 기간
- 후속 SaaS API 모드 비용 모델

## 32. 공식 법규 + 운영지식 기반 task 검토 상세 계획

작성일: 2026-05-29

이 섹션은 "task 작성 -> 관련 법규 추천 -> 체크리스트 제시 -> 경고와 근거 표시 -> 사용자 수정 -> 승인형 운영지식 축적" MVP를 다음 작업자가 이어서 구현할 수 있도록 현재 구현 상태와 남은 설계를 정리한다.

### 32.1 사용자 의도와 목표 흐름

목표 흐름:

```text
사용자가 task 등록
  -> AI 검토 요청
  -> SaaS가 task, approved WIKI, 관리자 등록 DB, 프로젝트 문서, 같은 프로젝트 task, 공식 법규 API evidence를 수집
  -> 사용자 연결 LLM 실행 경로가 evidence bundle을 근거로 답변/체크리스트/경고/wikiCandidateDraft 생성
  -> 공식 법규 API 확인 실패 또는 필수 source 누락 시 저장과 WIKI 후보 생성을 중단
  -> assistant record와 후보 초안 저장
  -> 사용자는 task 기록용 요약을 수정/승인
  -> Knowledge admin만 WIKI 후보를 승인/수정 후 승인/보류/삭제
  -> approved WIKI만 이후 central_knowledge evidence로 retrieval에 재사용
```

권한 경계:

- 일반 사용자와 LLM은 assistant record와 WIKI 후보 초안까지만 만들 수 있다.
- WIKI 등록, 승인, 수정 후 승인, 보류, 삭제는 Knowledge admin 권한으로만 수행한다.
- approved WIKI가 되기 전의 후보 record는 `central_knowledge`로 재사용하지 않는다.

### 32.2 현재 구현 판정

현재 구현과 일치하는 부분:

- `architect-saas` retrieval은 현재 task, 관련 project task, task 파일 분석, project 파일 분석, 이전 assistant record, user-approved external evidence, approved WIKI, regulation seed를 evidence로 묶는다.
- approved WIKI만 `central_knowledge`로 재사용하는 경계가 있다.
- Knowledge admin 전용 candidate review/approve API 경계가 있다.
- `architect-browser-assistant`에는 국가법령정보센터 Open API 기반 법규명/조항 확인, API URL, 조회 시점, 판단 근거 기록, 실패 시 저장 차단 로직이 있다.
- manual verifier는 verified assistant record/WIKI 후보 생성까지만 수행하고 WIKI approval은 시도하지 않는다.

아직 목표와 차이가 있는 부분:

- 공식 법규 검증은 browser/local bridge 중심이다. 배포 환경에서는 법규 API `OC`가 등록 도메인/IP와 결합되므로 SaaS 서버가 검증을 오케스트레이션해야 한다.
- "각 사용자의 로그인된 GPT가 담당"이라는 요구는 실행 정책으로 더 구체화해야 한다. 서버가 사용자의 ChatGPT 로그인 세션을 직접 사용할 수 없으므로 local extension/native runtime, 사용자별 provider 연결, BYOK, 조직 SaaS API 모드 중 하나를 명시해야 한다.
- 체크리스트, 경고, 법규 추천, 후보 생성 사유가 아직 구조화된 schema로 고정되어 있지 않다.
- 관리자 등록 DB의 대량 import와 AURI 같은 기본 WIKI seed corpus 수집/검토 파이프라인은 아직 구현되지 않았다.
- 법규 API 근거와 관리자 DB/프로젝트 task 근거 사이의 충돌 탐지, 중요도 산정, 후보 승격 기준은 아직 별도 정책/테스트가 필요하다.

### 32.3 find-skills 검토 결과

사용자 요청에 따라 `find-skills` 지침을 확인했다. Skills leaderboard도 확인했으며, 이 작업에는 이미 설치된 다음 스킬이 충분하다.

- `find-skills`: 필요한 skill 후보를 확인하고 외부 skill 설치 여부를 판단한다.
- `superpowers:writing-plans`: 다음 작업자가 바로 수행할 수 있는 상세 구현 계획을 작성한다.
- `verification-before-completion`: 완료 주장 전 검증 명령과 결과를 남기는 기준으로 사용한다.
- 후속 구현 단계에서는 `superpowers:executing-plans` 또는 `superpowers:subagent-driven-development`를 사용한다.

외부 skill은 설치하지 않는다. 현재 필요한 것은 새 skill 기능이 아니라 기존 `architect-saas`/`architect-browser-assistant` 경계 안에서 서버 오케스트레이션, ingestion, retrieval, 검증 schema를 구현하는 일이다.

### 32.4 구현 전 확인 질문

다음 항목은 구현자가 작업 시작 전 사용자 또는 제품 책임자에게 확인해야 한다.

1. LLM 실행 주체를 무엇으로 확정할 것인가?
   - 기본안: local extension/native runtime이 사용자 로컬 Codex/ChatGPT 연결을 사용한다.
   - 대안: 사용자별 provider credential/BYOK를 SaaS에 연결한다.
   - 후속안: 조직 단위 SaaS API 모드를 관리자가 켠다.

2. 국가법령정보센터 Open API `OC`는 어디에 보관할 것인가?
   - 권장안: production SaaS 서버의 secret/credential registry에 저장하고 서버 도메인/IP를 등록한다.
   - 금지안: 일반 사용자 브라우저 storage나 client bundle에 노출한다.

3. 관리자 등록 DB의 source of truth는 무엇인가?
   - 권장안: SaaS DB + object storage + file analysis/chunk index.
   - 로컬 개발안: `LOCAL_DATA_ROOT`의 JSON metadata와 uploads는 개발 fixture로만 사용한다.

4. AURI 보고서와 기본 법규/실무 기준은 approved WIKI로 바로 넣을 것인가, 후보로 넣을 것인가?
   - 권장안: raw source로 import하고, page/section 근거가 붙은 WIKI 후보를 생성한 뒤 Knowledge admin 승인 후 approved WIKI로 승격한다.

5. 사용자가 수정/승인하는 범위와 Knowledge admin이 승인하는 범위를 어디서 나눌 것인가?
   - 권장안: 사용자는 task summary와 project record를 승인한다. Knowledge admin은 조직 WIKI 승격만 승인한다.

6. 체크리스트와 경고의 최소 schema를 무엇으로 할 것인가?
   - 권장안: `checklistItems[]`, `warnings[]`, `lawCitations[]`, `evidenceConflicts[]`, `wikiCandidateDraft`.

### 32.5 목표 아키텍처

SaaS 서버에 task review orchestrator를 둔다.

```text
POST /api/assistant/task-review
  -> auth/project membership 검증
  -> task context load
  -> retrieval evidence load
     - approved WIKI
     - admin corpus/project documents
     - current task
     - related project tasks
     - previous assistant records
     - user-approved external evidence
     - regulation seed
  -> official law verification
     - law locator extraction
     - law.go.kr lawSearch/lawService 호출
     - OC redaction
     - law/article/effectiveDate/apiUrl/checkedAt/basisExcerpt 기록
  -> evidence bundle normalization
  -> user-bound LLM execution
  -> structured result validation
  -> assistant record 저장
  -> wiki candidate draft 저장
  -> task summary draft 저장
```

핵심 모듈 책임:

- `TaskReviewOrchestrator`: 전체 flow와 failure policy를 조율한다.
- `OfficialLawVerifier`: 국가법령정보센터 API 호출, 응답 normalization, 오류/재시도 사유 기록.
- `EvidenceBundleBuilder`: task/project/admin DB/approved WIKI/법규 evidence를 같은 schema로 묶고 우선순위와 confidence weight를 부여.
- `UserBoundLlmExecutor`: local runtime, user provider, organization SaaS API mode 중 실제 활성화된 실행 경로만 호출.
- `StructuredReviewValidator`: 답변이 공식 API 응답과 evidence id를 참조하는지 검증.
- `WikiCandidatePolicy`: 후보 생성 여부, 후보 제목/요약/태그/근거/리스크를 산정하되 approve는 호출하지 않는다.

### 32.6 데이터 ingestion 계획

로컬 개발:

- 기존 문서대로 metadata는 `LOCAL_DATA_ROOT` 또는 `D:\architect-start-data\data\*.json`에 저장된다.
- 파일 binary를 uploads 폴더에 직접 넣는 것만으로 retrieval 대상이 되지 않는다.
- SaaS UI/API로 file record를 만들고, extracted text 또는 summary가 포함된 file analysis를 저장해야 assistant retrieval에 잡힌다.

배포 환경:

- 사용자는 SaaS upload/API를 통해 문서를 등록한다.
- binary는 cloud object storage, metadata와 extracted text/chunk는 production DB/index에 저장한다.
- assistant는 서버 DB/index에서 데이터를 불러와 법규 API 결과와 함께 LLM에 전달한다.
- 관리자 DB는 "폴더 경로"가 아니라 server-side import job의 source로 취급한다. 예: object storage prefix, admin upload batch, signed import manifest.

AURI/기본 WIKI seed:

- AURI PDF는 raw source로 import한다.
- PDF text extraction 후 page/section 기준으로 chunk를 만든다.
- 각 chunk에는 `sourceUrl`, `documentTitle`, `page`, `section`, `capturedAt`, `reviewState`를 남긴다.
- LLM은 chunk를 바탕으로 checklist 후보와 WIKI 후보를 만들 수 있지만, approved WIKI 등록은 Knowledge admin 승인 후에만 가능하다.

### 32.7 구현 단계

Phase 1: 서버 공식 법규 verifier 이식

- `architect-browser-assistant/src/legal/official-law-api.ts`의 검증 로직을 SaaS에서 재사용 가능하게 port 또는 shared package화한다.
- SaaS 서버 secret에서 `LAW_OPEN_DATA_OC`를 읽고, API URL에는 OC를 redaction해서 저장한다.
- 법규 API authentication/domain 오류는 `blocked`로 처리하고 assistant record/WIKI candidate 저장을 막는다.

Phase 2: task review structured output schema

- review result schema를 정의한다.
- 최소 필드: `answerMarkdown`, `lawCitations`, `checklistItems`, `warnings`, `evidenceConflicts`, `confidence`, `wikiCandidateDraft`, `failure`.
- 모든 `lawCitations`는 official API result id/API URL/checkedAt을 가져야 한다.
- 모든 checklist/warning은 최소 하나 이상의 evidence id를 참조해야 한다.

Phase 3: SaaS task review API

- `POST /api/assistant/task-review`를 추가한다.
- 기존 `/api/assistant/retrieve`를 내부에서 재사용하고, 공식 법규 verifier를 서버에서 호출한다.
- LLM 실행 경로가 없으면 retrieval + law verification preview만 반환하고 generation은 차단한다.

Phase 4: user-bound LLM execution policy

- local extension mode: SaaS가 evidence bundle을 반환하고 browser assistant가 사용자 local runtime에 전달한다.
- user provider mode: 사용자가 연결한 provider credential이 있을 때만 서버가 호출한다.
- organization SaaS API mode: 관리자가 활성화한 경우에만 서버 provider를 호출한다.
- 실행 모드와 credential boundary를 assistant record metadata에 남긴다.

Phase 5: WIKI candidate policy

- AI가 `wikiCandidateDraft`를 만들 수 있게 하되, candidate state만 저장한다.
- 후보에는 source coverage, law citations, conflicting evidence, confidence reason, suggested scope를 포함한다.
- approve/reject/hold/delete는 Knowledge admin UI/API만 수행한다.

Phase 6: admin corpus ingestion

- admin upload batch 또는 import manifest를 추가한다.
- AURI PDF와 기본 실무 기준 자료를 raw source로 등록한다.
- extraction/chunking/indexing 후 후보 생성 preview를 제공한다.
- production import 전 source review coverage와 Knowledge admin acknowledgement를 요구한다.

### 32.8 MVP 검증 시나리오

필수 수동 검증:

1. 일반 사용자가 "공동주택 단지내 도로 경사도 검토" task를 생성한다.
2. AI 검토를 요청한다.
3. 서버가 task, 관련 task, approved WIKI, admin corpus, project document, regulation evidence를 조회한다.
4. 서버가 국가법령정보센터 API에서 법규명, 조항, API URL, 조회 시점, 판단 근거를 확인한다.
5. 유효한 OC가 없으면 assistant record와 WIKI candidate 저장 없이 blocked 응답을 반환한다.
6. 유효한 OC가 있으면 structured answer/checklist/warnings/wikiCandidateDraft를 생성한다.
7. assistant record와 WIKI candidate가 저장된다.
8. 새 후보는 retrieval에서 `central_knowledge`로 나오지 않는다.
9. Knowledge admin이 후보를 승인한다.
10. 승인 후 `/api/admin/knowledge/items`와 `/api/assistant/retrieve`에서 approved WIKI evidence가 검색된다.

필수 자동 검증:

- 공식 법규 verifier 성공/실패/timeout/auth error/OC redaction 테스트.
- task review API가 verification failed 상태에서 record/candidate write를 하지 않는 테스트.
- task review API가 candidate 생성 후 approve API를 호출하지 않는 테스트.
- non-admin 사용자가 candidate approve/reject/hold/delete를 호출할 수 없는 테스트.
- approved WIKI만 `central_knowledge`로 retrieval되는 테스트.
- checklist/warnings가 evidence id 없는 상태로 저장되지 않는 validation 테스트.

### 32.9 다음 작업자용 지시 프롬프트

```text
현재 repo는 D:\architect-workspace\architect-browser-assistant이고, SaaS repo는 D:\architect-workspace\architect-saas입니다.

목표:
PLAN.md section 32를 기준으로 "공식 법규 API + 관리자 등록 DB + 프로젝트 task evidence 기반 task review orchestrator"를 구현하십시오. WIKI 승인은 자동화하지 말고 Knowledge admin 전용 UI/API만 사용하십시오.

작업 순서:
1. PLAN.md section 32, README.md의 Official Law Source Verification, plans/486-official-law-api-task-verification.md, docs/worklogs/2026-05-28-1735-official-law-api-task-verification.md, docs/worklogs/2026-05-29-0952-task-review-orchestration-planning.md를 먼저 읽으십시오.
2. architect-saas의 retrieveAssistantEvidence, assistant records, knowledge candidate approve/reject route, knowledge-guards를 확인하십시오.
3. 서버-side OfficialLawVerifier 설계를 시작하십시오. browser-side verifier를 그대로 client secret 경계에 두지 말고 SaaS server secret LAW_OPEN_DATA_OC를 사용하는 구조로 옮기십시오.
4. POST /api/assistant/task-review의 최소 vertical slice를 설계하십시오. 유효한 OC가 없거나 공식 API 검증이 실패하면 assistant record와 WIKI candidate 저장을 중단해야 합니다.
5. structured review schema(answerMarkdown, lawCitations, checklistItems, warnings, evidenceConflicts, confidence, wikiCandidateDraft)를 추가하십시오.
6. candidate creation은 허용하되 WIKI approve는 호출하지 마십시오. 승인/수정 후 승인/보류/삭제는 Knowledge admin만 할 수 있어야 합니다.
7. admin corpus ingestion은 우선 설계와 테스트 fixture로 시작하십시오. AURI PDF는 raw source 후보로 취급하고 approved WIKI로 바로 넣지 마십시오.
8. 테스트는 실패 차단, OC redaction, non-admin approve 차단, approved WIKI retrieval 재조회, 후보 미승인 상태의 central_knowledge 제외를 반드시 포함하십시오.

주의:
- 사용자의 ChatGPT/Codex credential을 SaaS나 extension storage에 저장하지 마십시오.
- law.go.kr OC 값을 client에 노출하지 마십시오.
- mock 법규 답변으로 성공 처리하지 마십시오.
- 법규 API 원문 근거 없이 법규 검토 record/WIKI candidate를 저장하지 마십시오.
```
