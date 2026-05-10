"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { CodeBlock } from "@/components/docs/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "1. 요구 사항",
    description: "Union 미니앱은 React, Vite, TypeScript 기반 템플릿으로 시작합니다.",
    code: `Node.js 18 이상
npm 9 이상
Union 퍼블리셔 계정
업로드할 워크스페이스 권한(owner, admin, developer)`,
    lang: "text",
  },
  {
    title: "2. SDK와 CLI 준비",
    description: "현재 SDK는 모노레포 기준으로 빌드한 뒤 CLI를 사용합니다.",
    code: `git clone https://github.com/dku-union/union-sdk.git
cd union-sdk
npm install
npm run build`,
    lang: "bash",
  },
  {
    title: "3. 새 미니앱 생성",
    description: "CLI가 React/Vite 템플릿과 union.config.json을 생성합니다.",
    code: `npx union create festival-waiting
cd festival-waiting
npm install
npx union dev`,
    lang: "bash",
  },
  {
    title: "4. 프로젝트 구조",
    code: `festival-waiting/
├── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── union.config.json
├── package.json
└── vite.config.ts`,
    lang: "text",
  },
  {
    title: "5. union.config.json",
    description: "앱 식별자, 버전, 권한, 빌드 출력 위치를 정의합니다.",
    code: `{
  "appId": "com.union.festival-waiting",
  "name": "festival-waiting",
  "version": "1.0.0",
  "description": "축제 웨이팅 미니앱",
  "icon": "./assets/icon.png",
  "category": "utility",
  "permissions": ["user.profile"],
  "contactEmail": "team@example.com",
  "keywords": ["festival", "waiting"],
  "previews": [],
  "minSdkVersion": "1.0.0",
  "build": {
    "entry": "src/main.tsx",
    "outDir": "dist",
    "maxBundleSize": "2MB"
  }
}`,
    lang: "json",
  },
  {
    title: "6. SDK 사용",
    description: "@union-miniapp/sdk를 import해 인증, UI, 디바이스 기능을 호출합니다.",
    code: `import Union from "@union-miniapp/sdk";

const profile = await Union.auth.getUserProfile();

Union.ui.showToast({
  message: \`\${profile.nickname}님, 환영합니다.\`,
  duration: "short"
});

Union.analytics.trackEvent("home_opened", {
  source: "dashboard-docs"
});`,
    lang: "typescript",
  },
  {
    title: "7. 로컬 검증",
    description: "브라우저 개발 환경에서는 Mock Bridge가 동작하므로 권한 거부, 빈 데이터, 네트워크 오류 상태를 먼저 확인합니다.",
    code: `npx union dev
npm run lint
npm run build

# 권장 확인 항목
- 초기 진입 화면이 3초 이내에 표시되는지
- 권한 거부 시 대체 안내가 보이는지
- API 실패 시 재시도 또는 오류 메시지가 있는지`,
    lang: "bash",
  },
  {
    title: "8. 빌드와 패키징",
    description: "build는 Vite 빌드 후 manifest.json과 .unionapp 패키지를 생성합니다.",
    code: `npx union build
npx union validate

# 생성 결과 예시
dist/
com.union.festival-waiting-1.0.0.unionapp`,
    lang: "bash",
  },
  {
    title: "9. 업로드와 QR 테스트",
    description: "현재 업로드는 콘솔에서 진행합니다. 테스트 완료 전에는 심사 요청 단계로 넘어가지 않습니다.",
    code: `1. Dashboard > 워크스페이스 > 미니앱 업로드
2. 기존 미니앱 선택 또는 새 미니앱 등록
3. 버전과 릴리즈 노트 입력
4. .unionapp 파일 업로드
5. 모바일 앱으로 QR 테스트
6. 테스트 완료 후 심사 요청`,
    lang: "text",
  },
  {
    title: "10. 심사 대응과 배포",
    description: "운영자는 제출 정보, 테스트 상태, 릴리즈 노트, 권한 사용 범위를 함께 확인합니다.",
    code: `승인된 경우
- 미니앱 관리 > 버전 관리에서 승인된 버전을 배포합니다.
- 배포 후 실제 슈퍼앱 진입 경로와 핵심 기능을 다시 확인합니다.

반려된 경우
- 반려 사유를 기준으로 코드를 수정합니다.
- 버전 번호를 올리고 새 .unionapp 파일을 업로드합니다.
- 수정 범위를 릴리즈 노트에 구체적으로 남깁니다.`,
    lang: "text",
  },
];

const packageRules = [
  "파일 확장자는 .unionapp을 사용합니다.",
  "패키지는 내부적으로 zip archive입니다.",
  "index.html, manifest.json, signature 파일이 필요합니다.",
  "version은 1.0.0 같은 semver 형식을 사용합니다.",
  "build.maxBundleSize 기본값은 2MB입니다.",
];

const reviewReadyItems = [
  "릴리즈 노트에 사용자가 체감하는 변경 사항과 운영자 확인 포인트를 적습니다.",
  "Bridge API 권한 요청 사유가 앱 기능과 직접 연결되어야 합니다.",
  "로그인 실패, 권한 거부, 네트워크 오류, 빈 데이터 상태를 화면에서 처리합니다.",
  "QR 테스트에서 첫 진입, 주요 CTA, 뒤로가기 흐름을 확인합니다.",
  "문의 이메일은 실제 운영자가 확인할 수 있는 주소를 사용합니다.",
];

export default function DevelopmentGuidePage() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="flex-1 space-y-6 max-w-3xl">
        <div className="animate-fade-up">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Build to Release
          </p>
          <h1 className="heading-display mt-2 text-2xl tracking-tight">개발 가이드</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            SDK 템플릿으로 미니앱을 만들고, .unionapp 패키지 업로드와 QR 테스트를 거쳐 심사에 제출하는 전체 흐름입니다.
          </p>
        </div>

        <Card className="animate-fade-up delay-1 border-border/60">
          <CardContent className="grid gap-3 p-4 md:grid-cols-4">
            <GuideStep title="개발" description="SDK 템플릿과 Bridge API 연동" />
            <GuideStep title="검증" description="로컬 빌드와 오류 상태 확인" />
            <GuideStep title="제출" description=".unionapp 업로드와 QR 테스트" />
            <GuideStep title="운영" description="심사 대응과 승인 후 배포" />
          </CardContent>
        </Card>

        {sections.map((section, i) => (
          <Card key={section.title} className={`animate-fade-up delay-${Math.min(i + 2, 8)} border-border/60`}>
            <CardHeader>
              <CardTitle className="heading-display text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {section.description && (
                <p className="text-muted-foreground leading-relaxed">{section.description}</p>
              )}
              <CodeBlock code={section.code} language={section.lang} />
            </CardContent>
          </Card>
        ))}

        <Card className="animate-fade-up delay-8 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">.unionapp 패키지 규칙</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {packageRules.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-union mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="animate-fade-up delay-8 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">심사 제출 전 체크리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {reviewReadyItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-union" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GuideStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
