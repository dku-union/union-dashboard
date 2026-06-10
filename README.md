# union-dashboard

> **Union** 학내 슈퍼앱 + 미니앱 플랫폼의 퍼블리셔·어드민 콘솔.
> 단국대학교 캡스톤디자인 2026.
>
> 🔗 배포: [union-phi.vercel.app](https://union-phi.vercel.app)

---

## Union 생태계 안에서의 위치

학생은 별도 설치 없이 학내 미니앱(학생회 투표·동아리 모집·식권·셔틀·중고거래 등)을 Union 슈퍼앱 하나로 사용한다. 학내 개발팀(학생 개발팀·동아리·학과)은 React + Union SDK 로 미니앱을 만들어 본 대시보드에 등록·심사·배포한다.

| # | 컴포넌트 | 레포 | 역할 |
|:-:|----------|------|------|
| ① | Union iOS App | [union-ios](https://github.com/dku-union/union-ios) | 학생 사용자 슈퍼앱 (Swift · TCA · WebView Pool · Bridge) |
| ② | Union SDK | [union-sdk](https://github.com/dku-union/union-sdk) | 미니앱 ↔ Native 통신 라이브러리 (`window.Union`) |
| ③ | Union CLI | union-sdk 모노레포 | 미니앱 스타터·검증·업로드 (`npx union ...`) |
| ④ | **Publisher Dashboard** ← 본 레포 | [union-dashboard](https://github.com/dku-union/union-dashboard) | 등록·심사·배포 콘솔 (Next.js 16) |
| ⑤ | Union Backend | [union-app-backend](https://github.com/dku-union/union-app-backend) | API + 인증 + GCS + Redis + FCM + SMTP (Spring Boot) |

---

## 주요 기능

### 퍼블리셔
- 워크스페이스 생성 + 팀 멤버 4 역할(owner/admin/developer/viewer) 관리·초대
- 미니앱 등록 (이름·설명·카테고리·키워드·권한 스코프·아이콘)
- 빌드 업로드 (`.unionapp` ≤ 50MB · Browser → GCS 직접 PUT · 실패 자동 1 회 재시도)
- QR 테스트 세션 (10 분 1 회용 토큰)
- 심사 요청 + 결과 알림 (인앱·푸시·이메일)
- 배포·메타 편집·버전 이력·사용 통계·API 키

### 어드민
- 미니앱 심사 보드 (승인 / 반려 + 사유)
- 퍼블리셔·사용자 정지 (SUSPENDED)
- 카테고리 관리
- 신고 처리
- 운영 통계 대시보드

---

## 기술 스택

| 분류 | 사용 |
|------|------|
| Framework | Next.js 16 (App Router · Turbopack) · React 19 |
| Language | TypeScript |
| UI | Base UI · shadcn/ui · Tailwind CSS v4 |
| 차트 | Recharts |
| 폼 / 검증 | React Hook Form · Zod |
| DB / ORM | Neon PostgreSQL · Drizzle ORM (HTTP driver) |
| 인증 | jose (JWT) · bcryptjs |
| 이메일 | nodemailer (Gmail SMTP) |
| 배포 | Vercel (`develop` 자동 배포) |

---

## 아키텍처 메모

- **BFF 패턴** — 클라이언트는 Spring 을 직접 호출하지 않는다. `lib/spring/client.ts` 의 `springFetch<T>` 단일 진입점이 internal JWT 재발급 + 응답 정규화 + 에러 매핑을 담당. 41 라우트가 `jsonError` / `jsonData` + `requestId` 컨벤션으로 통일.
- **데이터 일관성** — Dashboard(Drizzle) 와 Spring(JPA) 이 같은 Neon DB 의 같은 테이블에 매핑. INSERT 게이트는 **Spring 한 쪽** 으로 단일화 (POST 는 항상 Spring forward, Dashboard 에서 별도 insert 금지). READ 는 양쪽 가능.
- **5 단계 권한 가드** — `proxy.ts` → BFF Route Handler → `springFetch` internal JWT → Spring `@PreAuthorize` → `workspaceAuthorizationService`. 단일 우회 경로 차단.
- **빌드 우회 업로드** — 50MB `.unionapp` 은 Spring 이 발급한 5 분 signed URL 로 Browser → GCS 에 직접 PUT. Next.js 서버 메모리·대역폭 부담 0, 실패 시 같은 versionId 로 자동 재발급 + 1 회 재시도.

---

## 프로젝트 구조

```
union-dashboard/
├── app/
│   ├── (auth)/             # 로그인 · 회원가입 · 이메일 인증
│   ├── (dashboard)/        # 퍼블리셔 콘솔 (워크스페이스 · 미니앱 · 분석 · 문서)
│   ├── admin/              # 어드민 (대시보드 · 심사 · 미니앱 · 퍼블리셔 · 유저 · 신고 · 설정)
│   ├── api/                # 41 BFF Route Handlers (Spring forward + 응답 컨벤션)
│   └── legal/              # 이용약관 · 개인정보처리방침
├── components/
│   ├── admin/              # 어드민 테이블·다이얼로그
│   ├── auth/               # 로그인·회원가입 폼
│   ├── landing/            # 랜딩 페이지 섹션
│   ├── providers/          # Auth · Theme Provider
│   └── ui/                 # Base UI · shadcn 기반 공통 UI
├── hooks/                  # useAuthActions · useUploadVersion · ...
├── lib/
│   ├── spring/             # springFetch<T> + JWT 헬퍼
│   ├── db/                 # Drizzle 스키마 (11 tables)
│   ├── validations.ts      # zod 스키마
│   └── observability/      # 로깅
├── types/                  # TypeScript 타입
├── proxy.ts                # Next.js 16 middleware — 인증 가드 + redirect
└── drizzle.config.ts       # Drizzle Kit 설정
```

---

## 시작하기

### 요구사항

- Node.js >= 20
- Neon PostgreSQL 인스턴스 (또는 호환 PostgreSQL)
- Spring Boot Backend 실행 중 (`SPRING_API_URL`)

### 설치 및 실행

```bash
git clone https://github.com/dku-union/union-dashboard.git
cd union-dashboard
npm install
cp .env.example .env.local      # 값 채우기
npm run dev                      # http://localhost:3000
```

### 주요 스크립트

| 명령 | 역할 |
|------|------|
| `npm run dev` | 개발 서버 (Turbopack) |
| `npm run build` · `npm run start` | 프로덕션 빌드 / 실행 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` 타입 검사 |
| `npm run db:generate` | Drizzle 마이그레이션 생성 |
| `npm run db:push` | 스키마 변경을 DB 에 직접 push (개발용) |
| `npm run db:studio` | Drizzle Studio (DB GUI) |

> `db:push` 는 Spring 측 JPA 와 같은 테이블을 공유하므로 운영 환경에서는 사용 금지.

---

## 환경 변수

`.env.example` 의 키를 채워 `.env.local` 로 복사한다.

| 키 | 설명 |
|----|------|
| `DATABASE_URL` · `DATABASE_URL_UNPOOLED` | Neon PostgreSQL 연결 (Spring 과 공유) |
| `NEON_API_KEY` | (선택) Neon 관리 API |
| `JWT_SECRET` | Dashboard `union-session` JWT 서명 키 (httpOnly · 7 일) |
| `INTERNAL_JWT_SECRET` | Dashboard ↔ Spring 사이 internal JWT 서명 키 |
| `SPRING_API_URL` | Spring Backend 베이스 URL |
| `MAIL_HOST` · `MAIL_PORT` · `MAIL_USERNAME` · `MAIL_PASSWORD` | 이메일 인증·초대 메일용 SMTP |

---

## 인앱 개발 문서 (`/docs/*`)

배포된 대시보드 안의 가이드 — 퍼블리셔가 미니앱을 만들 때 보는 1차 자료.

- `/docs/quick-start` — 미니앱 첫 등록까지
- `/docs/development/bridge-api` — Union SDK 6 모듈 레퍼런스
- `/docs/development/permissions` — `PermissionScope` 7 종 가이드
- `/docs/development/config` — `union.config.json`
- `/docs/distribution/build` · `/docs/distribution/submit` — 빌드 + 심사 요청
- `/docs/guidelines/review` — 심사 4 단계 (Critical · Warning · Info · Manual)
- `/docs/guidelines/notifications` — 알림 가이드라인
- `/docs/design` — 디자인 가이드

---

## 브랜치 전략

```
main      ← 안정 (제출용 스냅샷 / hotfix)
develop   ← 통합 · Vercel 자동 배포
feat/*    ← 기능 개발 (PR → develop)
chore/*   ← 정리·문서·인프라
fix/*     ← 버그 수정
```

---

## 라이선스

[MIT](./LICENSE) © 2026 Union — 단국대학교 캡스톤디자인 2026
