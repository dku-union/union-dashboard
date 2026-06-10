# union-dashboard

> **Union** 대학생 전용 미니앱 플랫폼의 퍼블리셔·어드민 대시보드입니다.  
> 단국대학교 캡스톤디자인 프로젝트

---

## 개요

퍼블리셔(개발자, 학생회, 동아리)가 미니앱을 등록·관리하고, 어드민이 심사 및 플랫폼 운영을 수행하는 웹 대시보드입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui, Tailwind CSS v4 |
| 차트 | Recharts |
| 폼 | React Hook Form + Zod |
| DB | Neon (PostgreSQL Serverless) + Drizzle ORM |
| 인증 | Jose (JWT), bcryptjs |
| 이메일 | Nodemailer |

## 주요 기능

### 퍼블리셔
- 워크스페이스 생성 및 팀 멤버 관리
- 미니앱 등록 및 버전 업로드
- 심사 요청 및 상태 조회
- QR코드 기반 테스트 세션
- 앱 통계 및 분석 대시보드

### 어드민
- 미니앱 심사 승인 / 반려
- 유저·퍼블리셔 계정 관리
- 신고 처리
- 플랫폼 현황 대시보드

## 프로젝트 구조

```
union-dashboard/
├── app/
│   ├── admin/              # 어드민 페이지 (대시보드, 앱 관리, 심사, 유저, 퍼블리셔, 신고)
│   ├── api/                # Route Handlers
│   │   ├── admin/          # 어드민 API (유저/앱/퍼블리셔/심사/신고)
│   │   ├── auth/           # 인증 API (로그인/회원가입/이메일 인증/세션)
│   │   └── workspaces/     # 워크스페이스 API
│   └── legal/              # 이용약관, 개인정보처리방침
├── components/
│   ├── admin/              # 어드민 전용 테이블, 다이얼로그 컴포넌트
│   ├── auth/               # 로그인, 회원가입 폼
│   ├── landing/            # 랜딩 페이지 섹션
│   ├── providers/          # Auth, Theme Provider
│   └── ui/                 # shadcn/ui 기반 공통 컴포넌트
└── types/                  # TypeScript 타입 정의
```

## 시작하기

### 요구사항

- Node.js >= 18

### 설치 및 실행

```bash
git clone https://github.com/dku-union/union-dashboard.git
cd union-dashboard
npm install
```

`.env.local` 파일을 생성하고 아래 환경변수를 설정합니다.

```env
DATABASE_URL=postgresql://...        # Neon DB 연결 문자열
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=gmail-app-password
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
# DB 마이그레이션
npx drizzle-kit migrate

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm run start
```

## 배포

Vercel 배포를 권장합니다. 환경변수를 Vercel 프로젝트 설정에 동일하게 등록해 주세요.

## 브랜치 전략

```
main        ← 프로덕션 배포
develop     ← 개발 통합
feature/*   ← 기능 개발 (PR → develop)
```
