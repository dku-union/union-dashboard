"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { CodeBlock } from "@/components/docs/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "1. 개발 환경 설정",
    description: "Union 미니앱 SDK를 설치하고 프로젝트를 초기화합니다.",
    code: `# Union Mini App CLI 설치
npm install -g @union/miniapp-cli

# 새 프로젝트 생성
union create my-miniapp

# 개발 서버 실행
cd my-miniapp
npm run dev`,
    lang: "bash",
  },
  {
    title: "2. 프로젝트 구조",
    code: `my-miniapp/
├── src/
│   ├── index.html      # 진입점
│   ├── app.js          # 앱 로직
│   ├── style.css       # 스타일
│   └── assets/         # 정적 자원
├── union.config.json    # Union 설정
└── package.json`,
    lang: "text",
  },
  {
    title: "3. Union 설정 파일",
    description: "union.config.json 파일에서 앱의 기본 설정과 권한을 정의합니다.",
    code: `{
  "appId": "your-app-id",
  "name": "내 미니앱",
  "version": "1.0.0",
  "permissions": [
    "user.profile",
    "location"
  ],
  "entry": "src/index.html",
  "minPlatformVersion": "1.0.0"
}`,
    lang: "json",
  },
  {
    title: "4. Bridge API 사용",
    description: "Union Bridge를 통해 플랫폼의 네이티브 기능에 접근합니다.",
    code: `import { UnionBridge } from '@union/bridge';

// 사용자 프로필 조회
const profile = await UnionBridge.getUserProfile();
console.log(profile.name); // "김유니비"

// 위치 정보 조회
const location = await UnionBridge.getLocation();
console.log(location.latitude, location.longitude);`,
    lang: "typescript",
  },
  {
    title: "5. 빌드 & 제출",
    description: "앱을 빌드하고 심사를 위해 제출합니다.",
    code: `# 프로덕션 빌드
npm run build

# 빌드 파일 패키징 (.zip)
union pack

# 결과물: dist/my-miniapp-1.0.0.zip`,
    lang: "bash",
  },
];

const reviewCriteria = [
  "불필요한 권한을 요청하지 않아야 합니다.",
  "개인정보 처리방침이 명시되어야 합니다.",
  "안정적으로 동작하며 크래시가 없어야 합니다.",
  "디자인 가이드라인을 준수해야 합니다.",
  "유해 콘텐츠가 포함되지 않아야 합니다.",
  "결제 기능 사용 시 보안 요구사항을 충족해야 합니다.",
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
            미니앱 개발 환경 설정부터 배포까지의 전체 프로세스
          </p>
        </div>

        {sections.map((section, i) => (
          <Card key={section.title} className={`animate-fade-up delay-${i + 1} border-border/60`}>
            <CardHeader>
              <CardTitle className="heading-display text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
              <CodeBlock code={section.code} language={section.lang} />
            </CardContent>
          </Card>
        ))}

        <Card className="animate-fade-up delay-6 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">6. 심사 기준</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {reviewCriteria.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
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
