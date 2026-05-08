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
    title: "7. 빌드와 검증",
    description: "build는 Vite 빌드 후 manifest.json과 .unionapp 패키지를 생성합니다.",
    code: `npx union build
npx union validate

# 생성 결과 예시
dist/
com.union.festival-waiting-1.0.0.unionapp`,
    lang: "bash",
  },
  {
    title: "8. 업로드와 심사",
    description: "CLI upload는 아직 백엔드 API 연동 전이므로 dashboard에서 업로드합니다.",
    code: `1. Dashboard > 워크스페이스 > 미니앱 업로드
2. 기존 미니앱 선택 또는 새 미니앱 등록
3. 버전과 릴리즈 노트 입력
4. .unionapp 파일 업로드
5. QR 테스트 완료 후 심사 요청
6. 승인 후 배포 버튼으로 공개`,
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

export default function DevelopmentGuidePage() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="flex-1 space-y-6 max-w-3xl">
        <div className="animate-fade-up">
          <h1 className="heading-display text-2xl tracking-tight">개발 가이드</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SDK 템플릿으로 미니앱을 만들고 dashboard에 업로드하는 전체 흐름
          </p>
        </div>

        {sections.map((section, i) => (
          <Card key={section.title} className={`animate-fade-up delay-${Math.min(i + 1, 8)} border-border/60`}>
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
      </div>
    </div>
  );
}
