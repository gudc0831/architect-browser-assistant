# Architect Browser Assistant 기획서

작성일: 2026-05-07
작업 위치: `D:\architect-workspace\architect-browser-assistant`
연동 대상 SaaS: `D:\architect-workspace\architect-saas`

## 1. 제품 방향

Architect Browser Assistant는 건축 업무 task 검토에 특화된 Chromex 기반 브라우저 어시스턴트다.

이 제품은 일반 챗봇이 아니다. 사용자가 SaaS의 task를 중심으로 질문하면, 중앙 공식 지식 DB, 법규 DB, 프로젝트 업무 데이터, 첨부파일 분석 결과, 웹/스킬 결과를 근거로 검토 의견을 제공하고, 그 결과를 다시 조직 지식으로 축적하는 서비스다.

추천 제품 방향은 다음과 같다.

```text
SaaS DB 우선 참조
  + 로컬 Chromex형 브라우저 도구
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

## 9. task assistant 기록

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

## 10. 답변 자동 저장과 작업 기록 정리 UX

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

## 11. Review Closure Gate

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

## 12. 법규 체크 답변 정책

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

## 13. 신뢰도 점수

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

## 14. 법규 DB 구축

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

## 15. 파일과 이미지 분석

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

## 16. 관리자 WIKI

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

## 17. LLM WIKI 패턴

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

## 18. Obsidian/Notion 방향

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

## 19. 역할과 권한

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

## 20. 브라우저 assistant UX

MVP 기본 화면은 task 중심 side panel이다.

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

## 21. 브라우저 동작 범위

MVP는 `architect-saas` task 화면 중심으로 동작한다.

MVP:

- SaaS task 컨텍스트 자동 인식
- 현재 task 기준 side panel 사용
- task, 첨부파일, 선택 영역, 프로젝트 컨텍스트 기반 분석
- assistant 기록을 SaaS task에 저장

후속:

- 외부 법규/지자체/자료 사이트에서 선택 텍스트 분석
- 외부 페이지 내용을 task 기록에 연결
- 관리자가 허용한 도메인에서만 업무 기록 저장
- 외부 웹/스킬 결과는 관리자 승인 전 공식 지식으로 사용하지 않음

## 22. assistant 실행 범위

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

## 23. 감사 로그와 거버넌스

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

## 24. 개인정보와 데이터 경계

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

## 25. MVP 범위

MVP 포함:

- Chromex 기반 extension foundation
- task 중심 side panel
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

## 26. 권장 구현 순서

사용자 검토와 승인 전에는 구현을 시작하지 않는다.

승인 후 권장 순서:

1. `plans/01-task-assistant-core-loop.md`를 기준으로 첫 vertical slice 구현 계획을 확정한다.
2. SaaS assistant API contract 정의
3. assistant 기록과 knowledge 데이터 모델 정의
4. task, 프로젝트, 법규, 중앙 지식 retrieval API 설계
5. SaaS에 assistant thread와 답변 저장 구조 추가
6. `architect-browser-assistant`에 extension foundation 구성
7. extension과 SaaS task 컨텍스트/API 연결
8. Architect Local Assistant Runtime adapter 구현
9. local ChatGPT/Codex 실행 경로 연결
10. 작업 기록 정리 UX 추가
11. Knowledge admin 후보 큐의 최소 연결
12. 첫 task assistant core loop end-to-end 검증
13. 이후 관리자 WIKI, 파일/OCR, 웹/스킬 확장 세부 계획을 순차 작성한다.

## 27. 하위 실행 계획 문서

`PLAN.md`는 전체 제품 방향과 아키텍처 기준 문서다.

구현 가능한 단위는 `plans/` 아래 하위 계획 문서로 분리한다.

권장 문서 구조:

```text
architect-browser-assistant/
  PLAN.md
  plans/
    01-task-assistant-core-loop.md
    02-knowledge-admin-wiki.md
    03-file-and-image-analysis.md
    04-web-and-skill-expansion.md
    05-saas-api-mode.md
```

첫 실행 계획은 `01-task-assistant-core-loop.md`다.

첫 vertical slice에는 local ChatGPT/Codex runtime을 포함한다. 이 기능이 없으면 실제 제품 가치 검증이 불완전하기 때문이다. 다만 Chromex와 직접 연동하지 않고, Architect Browser Assistant 전용 runtime adapter를 둔다. 개발과 자동 테스트를 위해 mock runtime도 함께 둔다.

## 28. 구현 전 재검토 항목

아래 항목은 이 기획서의 방향을 막지는 않지만, 실제 구현 계획을 작성하기 전에 구체화해야 한다.

- local ChatGPT/Codex bridge 방식
- Chromex에서 어떤 구조/코드를 참고하거나 가져오고, 어떤 부분을 새로 작성할지
- 검색 방식: Postgres text search, vector search, hybrid search, 단계적 적용 여부
- 파일 추출 라이브러리와 OCR provider
- 초기 법규 문서 세트
- 현재 SaaS 권한 모델에서 Knowledge admin을 어떻게 매핑할지
- side panel과 Admin WIKI UI/UX
- 감사 로그 보관 기간
- 후속 SaaS API 모드 비용 모델
