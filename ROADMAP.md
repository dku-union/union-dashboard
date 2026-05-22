# Dashboard Roadmap

배포본 운영을 위해 남아 있는 작업을 우선순위별로 정리. 이미 머지된 작업은 본 문서에서 제외.

---

## 최근 사이클에서 완료된 항목 (참고)

- **P0-1** 메인 대시보드 mock 데이터 제거 (`dashboard/page.tsx`, `apps/[id]/analytics/page.tsx`, legacy 훅/데이터 정리)
- **P1-2** 빌드 업로드 실패 시 signed URL 재발급 자동 재시도 (`POST /app-versions/{id}/upload-url-refresh` 연동)
- **P2-7** 검색/정렬 (앱 목록 정렬 + 리뷰 검색·정렬)
- **P2-8** 공통 `EmptyState` 컴포넌트 + 5곳 적용 (dashboard, apps 목록, apps 상세, apps 분석, apps 버전 이력)
- **P3-9** 미니앱 메타 편집(`PATCH /mini-apps/{id}`) 활성화
- **P3-10** 신규 등록 폼에 카테고리/키워드/권한 입력 추가 + 등록 흐름을 Spring source-of-truth 로 정합
- **hotfix** P3-10 회귀(POST `/api/mini-apps` 미러링 insert로 인한 PK 충돌) 제거 (PR #47, develop)

---

## P1 — 운영 안정성 (다음 사이클 권장)

### 1. API 에러 응답 컨벤션 일괄 마이그레이션
- 신규 라우트(아이콘 업로드, upload-url-refresh, categories, PATCH 등)는 `jsonError` + `serverError` + `requestId` 패턴 사용 중
- 다음 28개 라우트는 구식 `console.error` + `NextResponse.json({ error })` 패턴
  - `app/api/auth/login/route.ts`, `signup`, `session`, `email/send`, `email/verify`
  - `app/api/mini-apps/route.ts` GET, `/[id]/route.ts` GET, `/my-apps/route.ts`
  - `app/api/workspaces/route.ts`, `/[id]/route.ts`, `/[id]/members/route.ts`, `/[id]/members/[memberId]/route.ts`
  - `app/api/invitations/[id]/route.ts`
  - `app/api/notifications/route.ts`, `/[id]/route.ts`
  - `app/api/reviews/mine/route.ts`
  - `app/api/analytics/usage/route.ts`
  - `app/api/app-versions/[id]/route.ts`
  - `app/api/admin/*` (11개)
- 클라이언트 `apiErrorMessage` 헬퍼는 graceful하지만 일관성/관측성 차원에서 통일 권장

### 2. 권한 격차 점검
- BFF는 `owner/admin/developer` writer만 통과, Spring은 `hasRole('PUBLISHER')` + workspace membership 검증
- viewer가 BFF를 거치지 않고 Spring을 직접 호출하는 경로/토큰 발급 정책 점검
- admin endpoint 매트릭스 한 번 정리

### 3. 세션 만료 / 자동 로그아웃 흐름
- 작업 중 세션 만료 시 처리 정책 미정
- 토큰 만료 임박 시 사일런트 갱신 또는 "곧 만료됩니다" 토스트 + 갱신 UI

### 4. 알림(notifications) end-to-end 검증
- 라우트(`/api/notifications/*`)는 존재. 실제 트리거 지점에서 알림이 정상 발송되는지 검증 필요
  - 심사 승인/반려
  - 워크스페이스 멤버 초대 수락
  - 빌드 업로드 확정
- in-app + 이메일 채널 모두 점검

### 5. 모니터링·관측성 셋업 점검
- `lib/observability/logger.ts`가 어디로 송신되는지 확인 (Sentry/Datadog/콘솔만?)
- 운영 시작했으니 에러 실시간 감지 가능 상태인지 확인
- 운영 중 발견된 실제 갭이 ROADMAP 위로 올라가야 함

---

## P2 — UX 발견성/일관성

### 6. 검색/필터/정렬 — 잔여 페이지
- 이미 적용: 앱 목록(`AppList`), 리뷰(`ReviewStatusBoard`)
- 남은 곳:
  - 워크스페이스 멤버 목록 (`app/(dashboard)/workspace/[id]/page.tsx`)
  - 버전 이력 (`apps/[id]/versions/page.tsx`) — 현재 createdAt desc 기본
  - 알림 목록

### 7. 빈 상태 — 잔여 페이지
- 이미 적용: 5곳 (`<EmptyState />` 컴포넌트)
- 남은 곳(grep 결과 약 35곳):
  - 워크스페이스 페이지
  - 알림 목록
  - admin/* 페이지 전반
  - 워크스페이스 멤버 비어있을 때 등

### 8. 모바일 반응형 점검
- 반응형 prefix(sm/md/lg) 사용 빈도가 페이지 수 대비 적음
- 워크스페이스 상세, 앱 상세, 분석 페이지 모바일 뷰포트 확인 + 깨지는 부분 보완

---

## P3 — 기능 확장 (백엔드 의존)

### 9. 버전 롤백 / 핫픽스
- 현재 `deploy`는 단방향(승인된 버전을 deployed로 전환)
- 운영 중인 버전에 문제 발견 시 이전 버전으로 되돌리는 endpoint + UI 필요

### 10. 빌드 사전 검증
- 업로드 시 manifest/권한 선언 정적 검증으로 심사 반려율 ↓
- 권한 스코프(`user.profile`, `payment`, `camera` 등)가 빌드 manifest와 일치하는지 검증

### 11. 감사 로그 (admin)
- 누가 언제 누구를 정지/승인/반려했는지 추적
- admin 페이지에 timeline 뷰

---

## 정리 작업 (잔재 코드 + 사이클 발견 사항)

### 1. PATCH 라우트의 중복 dashboard DB update 제거
- dashboard와 Spring이 **동일한 Neon DB의 같은 `mini_apps` 테이블**을 공유한다는 사실 확인됨 (Spring `@Table(name = "mini_apps")` ↔ drizzle `pgTable("mini_apps", ...)`)
- 따라서 다음 PATCH 라우트들의 dashboard DB update는 같은 row를 두 번 손대는 중복 작업:
  - `app/api/mini-apps/[id]/route.ts` (이름/설명)
  - `app/api/mini-apps/[id]/icon/route.ts` (아이콘)
- update는 idempotent라 PK 충돌은 없고 데이터는 안전. 정리는 별도 cleanup PR로

### 2. legacy 코드 정리
- `types/mini-app.ts` — `MiniAppStatus`(draft/in_review/published/...), `MiniAppCategory`, `PermissionScope` 등 mock 시대 enum. 일부는 신규 코드에서 재사용 중이지만 `types/app-version.ts`로 통합 가능
- `lib/validations.ts`의 `miniAppSchema`, `MiniAppFormValues` — 사용처는 legacy `app-form.tsx` 한 곳뿐
- `components/apps/app-form*.tsx`, `components/apps/status-badge.tsx` — legacy 멀티스텝 폼. 사용처 점검 후 삭제 또는 신규 enum으로 갱신
- `data/admin-reviews.ts`, `data/publishers.ts` — admin 페이지 사용 여부 확인 후 처리

### 3. dashboard drizzle 스키마 `permissions` 컬럼 정합
- 백엔드에서 `mini_apps` 테이블에 `permissions` (JSONB) 컬럼 추가됨
- dashboard drizzle 스키마에는 해당 컬럼이 정의되어 있지 않아 select 시 누락
- 두 옵션:
  1. drizzle 스키마에 `permissions: jsonb("permissions").$type<PermissionScope[]>()` 추가
  2. GET `/api/mini-apps/[id]`도 Spring으로 forward로 바꿔서 dashboard DB read 제거 → 일관성 ↑

---

## 데이터 모델 메모 (이번 사이클 학습)

- dashboard와 Spring은 **동일한 Neon DB의 동일한 `mini_apps` 테이블**을 공유 (dashboard `.env.local`의 `DATABASE_URL` ↔ 백엔드 `DB_URL` 환경변수가 같은 Neon 호스트의 `neondb` 가리킴)
- 같은 row지만 게이트(insert 시 비즈니스 로직)는 **Spring 하나로 단일화**가 정책 (`POST` 만 Spring forward)
- 향후 dashboard 측 라우트 작성 시:
  - GET — dashboard 직접 read 가능 (성능 ↑), 단 신규 필드(`permissions` 같은) 누락 주의
  - POST — Spring forward 후 dashboard에서 별도 insert 하지 말 것 (PK 충돌)
  - PATCH — Spring forward, dashboard 측 update는 idempotent라 무해하지만 중복

---

## 백엔드 협조 요청 큐

현재 큐는 **비어 있음**. 직전 사이클에 요청한 항목 모두 처리 완료:
- `POST /app-versions/{id}/upload-url-refresh` (PR #47)
- `PATCH /mini-apps/{id}` (PR #47)
- `MiniAppRegisterRequestDto` keywords/permissions 확장 (PR #47)
- `GET /mini-apps/categories` (PR #48)
- 등록 정합성 정책 결정 (Spring source of truth)

다음 백엔드 요청은 P3 항목 진행 시점에:
- 버전 롤백 endpoint (P3-9)
- 빌드 manifest 검증 hook (P3-10, 선택)

---

## 다음 사이클 권장 우선순위

1. **P1-2 권한 격차 점검** — 작업 작고 운영 보안 영향 큼
2. **P1-3 세션 만료 처리** — 사용자 작업 중 강제 로그아웃 분노 포인트
3. **P1-5 모니터링 셋업 점검** — 운영 에러 감지 인프라 확인
4. **P1-4 알림 검증** — 사용자 발견성에 직결
5. P1-1(에러 응답 통일) + 정리 작업은 큰 회귀 가능성이 작은 작업이라 P1-2/3 끝낸 뒤 같은 PR로 묶기

---

마지막 업데이트: 2026-05-22
