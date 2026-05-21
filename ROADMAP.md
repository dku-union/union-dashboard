# Dashboard Roadmap

배포본 운영을 위해 남아 있는 작업을 우선순위별로 정리. 이번 PR(`feat/dashboard-release-prep`)에서 처리한 항목은 본 문서에서 제외.

---

## P1 — 운영 안정성 (1~2주 안)

### 1. API 에러 응답 컨벤션 일괄 마이그레이션
- 현재 신규 라우트(아이콘 업로드 등)는 `jsonError` + `serverError` + `requestId` 패턴 사용
- 다음 28개 라우트는 구식 `console.error` + `NextResponse.json({ error })` 패턴이 남아 있음. 클라이언트 `apiErrorMessage` 헬퍼는 graceful하지만 일관성/관측성 차원에서 통일 권장.
  - `app/api/auth/login/route.ts`, `signup`, `session`, `email/send`, `email/verify`
  - `app/api/mini-apps/route.ts`, `/[id]/route.ts` (GET 부분), `/my-apps/route.ts`
  - `app/api/workspaces/route.ts`, `/[id]/route.ts`, `/[id]/members/route.ts`, `/[id]/members/[memberId]/route.ts`
  - `app/api/invitations/[id]/route.ts`
  - `app/api/notifications/route.ts`, `/[id]/route.ts`
  - `app/api/reviews/mine/route.ts`
  - `app/api/analytics/usage/route.ts`
  - `app/api/app-versions/[id]/route.ts`
  - `app/api/admin/*` 전부(11개)
- 신규 라우트는 항상 helper 사용을 컨벤션으로 명문화 (PR 리뷰 시 확인).

### 2. 빌드 파일 업로드 실패 재시도 UX
- 현재 50MB `.unionapp` 업로드 중 네트워크 끊기면 처음부터 다시 업로드 + 버전 row가 DRAFT로 남음
- 개선안: 같은 versionId로 signed URL 재발급 endpoint 추가, 클라이언트는 진행률 + 재시도 버튼 노출
- 의존: Spring 측 endpoint 추가 필요 (`POST /app-versions/{id}/upload-url-refresh` 같은 형태)

### 3. 권한 격차 점검
- BFF는 `owner/admin/developer` writer만 통과, Spring 측은 `hasRole('PUBLISHER')` + workspace membership 검증
- viewer가 BFF를 거치지 않고 Spring을 직접 호출하는 경로가 있는지 / 토큰 발급 정책 확인
- admin endpoint 매트릭스도 동일하게 한 번 점검

### 4. 세션 만료 / 자동 로그아웃 흐름
- 작업 중 세션 만료 시 처리 정책 미정
- 토큰 만료 임박 시 사일런트 갱신 또는 "곧 만료됩니다" 토스트 + 갱신 UI

### 5. 알림(notifications) end-to-end 검증
- 라우트(`/api/notifications/*`)는 존재. 실제 트리거 지점에서 알림이 정상 발송되는지 검증 필요:
  - 심사 승인/반려
  - 워크스페이스 멤버 초대 수락
  - 빌드 업로드 확정
- in-app + 이메일 채널 모두 점검

---

## P2 — UX 발견성/일관성

### 6. 검색/필터/정렬 — 잔여 페이지
- 이번 PR에서 미니앱 목록(`AppList`)에 정렬 추가, 리뷰(`ReviewStatusBoard`)에 검색+정렬 추가
- 남은 곳:
  - 워크스페이스 멤버 목록 (`app/(dashboard)/workspace/[id]/page.tsx`)
  - 버전 이력 (`apps/[id]/versions/page.tsx`) — 현재 createdAt desc 기본, 필터/검색 부재
  - 알림 목록

### 7. 빈 상태 패턴 — 잔여 페이지
- 이번 PR에서 `components/ui/empty-state.tsx` 추가 + 5곳 적용 (dashboard, app-list, apps/[id], apps/[id]/analytics, apps/[id]/versions)
- 남은 곳(grep 결과 약 35곳):
  - 워크스페이스 페이지
  - 알림 목록
  - admin/* 페이지 전반
  - 워크스페이스 멤버 비어있을 때 등
- 점진적으로 `<EmptyState />` 컴포넌트로 교체

### 8. 모바일 반응형 점검
- 반응형 prefix(sm/md/lg) 사용 빈도가 페이지 수 대비 적음
- 워크스페이스 상세, 앱 상세, 분석 페이지 모바일 뷰포트에서 한 번 돌려보고 깨지는 부분 보완

---

## P3 — 기능 확장

### 9. 미니앱 메타 편집 API 연동 활성화
- 이번 PR에서 UI 프레임워크(`/apps/[id]/edit`)와 BFF stub(`PATCH /api/mini-apps/[id]`) 추가됨
- 현재는 `SAVE_DISABLED = true` 플래그로 저장 비활성 + 503 응답
- **백엔드 요청 사항**: Spring에 `PATCH /mini-apps/{id}` endpoint 추가
  - request body: `{ name?: string, description?: string | null }`
  - response: `MiniAppResponseDto`
  - 권한: `hasRole('PUBLISHER')` + workspace membership
- endpoint 추가 후 dashboard 측 변경:
  1. `app/(dashboard)/apps/[id]/edit/page.tsx`의 `SAVE_DISABLED` 를 `false`로
  2. `app/api/mini-apps/[id]/route.ts` PATCH handler의 503 분기 제거 → `springFetch` 호출 + 응답으로 dashboard DB 동기화
  3. 페이지 상단 "백엔드 구현 대기 중" 안내 배너 제거

### 10. 미니앱 카테고리/키워드/권한 스코프 입력
- `types/mini-app.ts`에 `MiniAppCategory`, `PermissionScope` 정의 + `lib/validations.ts`에 `miniAppSchema` (카테고리·키워드·권한 포함) + `components/apps/app-form*.tsx` 멀티스텝 폼 존재. 모두 mock 시대 잔재로 **현재 사용처 없음**.
- 의존성:
  - Spring `MiniAppRegisterRequestDto`에 카테고리/키워드/권한 필드 확장
  - dashboard 등록 폼에 단계 추가 (현재는 이름+설명+아이콘만 받음)
- 우선순위: 배포 직전엔 불필요, 카탈로그 검색/추천 강화 시점에 진행

### 11. 버전 롤백 / 핫픽스
- 현재 `deploy`는 단방향(승인된 버전을 deployed로 전환)
- 운영 중인 버전에 문제 발견 시 이전 버전으로 되돌리는 endpoint + UI 필요

### 12. 빌드 사전 검증
- 업로드 시 manifest/권한 선언 정적 검증으로 심사 반려율 ↓
- 권한 스코프(`user.profile`, `payment`, `camera` 등)가 빌드 manifest와 일치하는지 검증

### 13. 감사 로그 (admin)
- 누가 언제 누구를 정지/승인/반려했는지 추적
- admin 페이지에 timeline 뷰

---

## 정리 작업 (잔재 코드)

이번 PR에서 mock 의존 핵심 화면(`dashboard/page.tsx`, `apps/[id]/analytics/page.tsx`)과 legacy 훅(`use-mini-apps.ts`, `use-reviews.ts`) + mock 데이터(`data/mini-apps.ts`, `data/reviews.ts`)는 제거 완료. 다음은 다른 작업과 함께 점진 정리:

- `types/mini-app.ts` — `MiniAppStatus`(draft/in_review/published/...), `MiniAppCategory`, `PermissionScope` 등 mock 시대 enum. P3-10이 활성화될 때 백엔드 enum과 정합성 재정렬.
- `lib/validations.ts` 의 `miniAppSchema`, `MiniAppFormValues` — 사용처 없음(legacy `app-form.tsx` 전용). 위 작업 시 같이 정리.
- `components/apps/app-form*.tsx`, `components/apps/status-badge.tsx` — legacy. 사용처 점검 후 삭제 또는 신규 enum으로 갱신.
- `data/admin-reviews.ts`, `data/publishers.ts` — admin 페이지 사용 여부 확인 후 처리.

---

## 백엔드 요청 사항 요약

- **`PATCH /mini-apps/{id}`** — 이름/설명 수정 (P3-9에서 활용)
- **`POST /app-versions/{id}/upload-url-refresh`** — 업로드 실패 시 같은 versionId로 signed URL 재발급 (P1-2)
- **카테고리/키워드/권한 필드** — `MiniAppRegisterRequestDto` 확장 (P3-10)
- **버전 롤백 endpoint** — `POST /app-versions/{id}/rollback` 또는 deploy 역방향 (P3-11)
- 빌드 manifest 검증 hook (선택, P3-12)

---

마지막 업데이트: 2026-05-21
