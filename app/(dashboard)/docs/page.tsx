"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Code2, Blocks, ArrowRight, Package, Upload, CheckCircle2, Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "디자인 가이드라인",
    description: "Union 플랫폼의 디자인 원칙과 UI 컴포넌트 사용 가이드",
    href: "/docs/design-guidelines",
    icon: Palette,
    accent: "from-muted to-muted/50 border-border/40",
    iconColor: "text-muted-foreground",
  },
  {
    title: "개발 가이드",
    description: "SDK 템플릿으로 미니앱을 만들고 .unionapp 패키지를 업로드하는 흐름",
    href: "/docs/development-guide",
    icon: Code2,
    accent: "from-muted to-muted/50 border-border/40",
    iconColor: "text-muted-foreground",
  },
  {
    title: "Bridge API 레퍼런스",
    description: "@union-miniapp/sdk가 제공하는 인증, UI, 디바이스, 저장소 API",
    href: "/docs/bridge-api",
    icon: Blocks,
    accent: "from-muted to-muted/50 border-border/40",
    iconColor: "text-muted-foreground",
  },
];

export default function DocsPage() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-56 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="publisher-page flex-1">
        <div className="publisher-page-header animate-fade-up">
          <div className="max-w-2xl">
            <p className="publisher-eyebrow">Developer Docs</p>
            <h1 className="text-heading-1">개발 문서</h1>
            <p className="mt-2 text-body-sm text-muted-foreground">
              미니앱 생성부터 SDK 연동, 빌드 패키징, 콘솔 업로드까지 필요한 문서를 작업 흐름에 맞춰 확인하세요.
            </p>
          </div>
          <Button className="bg-union text-white hover:bg-union/90" render={<Link href="/workspace" />}>
            <Upload className="h-4 w-4" />
            업로드로 이동
          </Button>
        </div>

        <Card className="publisher-panel animate-fade-up delay-1">
          <CardContent className="grid gap-4 p-4 md:grid-cols-4">
            <FlowStep icon={Terminal} title="생성" description="SDK 템플릿으로 시작" />
            <FlowStep icon={Blocks} title="연동" description="Bridge API와 권한 확인" />
            <FlowStep icon={Package} title="빌드" description=".unionapp 패키징" />
            <FlowStep icon={ShieldCheck} title="심사" description="업로드 후 테스트/제출" />
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section, i) => (
              <Link key={section.href} href={section.href} className={`animate-fade-up delay-${i + 2}`}>
                <Card className="publisher-panel group h-full transition-colors hover:border-union/45">
                  <CardHeader className="pb-3">
                    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-muted/45 border border-border/60`}>
                      <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                    </div>
                    <CardTitle className="flex items-center gap-2 text-heading-3">
                      {section.title}
                      <ArrowRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <aside className="space-y-4">
            <Card className="publisher-panel animate-fade-up delay-5">
              <CardContent className="p-4">
                <p className="publisher-eyebrow">Quick Start</p>
                <div className="mt-4 rounded-lg border border-border/70 bg-muted/25 p-3 font-mono text-xs leading-6">
                  <p>npx union create my-app</p>
                  <p>cd my-app</p>
                  <p>npm run build</p>
                  <p>npx union pack</p>
                </div>
                <Button variant="outline" className="mt-3 w-full border-border/70" render={<Link href="/docs/development-guide" />}>
                  개발 가이드 보기
                </Button>
              </CardContent>
            </Card>

            <Card className="publisher-panel animate-fade-up delay-6">
              <CardContent className="p-4">
                <p className="publisher-eyebrow">Before Upload</p>
                <div className="mt-4 space-y-3">
                  <DocCheck title="앱 이름과 설명 정리" />
                  <DocCheck title="필요 권한과 Bridge API 확인" />
                  <DocCheck title=".unionapp 빌드 파일 생성" />
                  <DocCheck title="릴리즈 노트 작성" />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Card className="publisher-panel animate-fade-up delay-7">
          <CardHeader>
            <CardTitle className="text-heading-3">시작하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Union 미니앱은 React와 Vite 기반으로 개발되며, Union iOS 앱의 WebView 안에서 실행됩니다.
              브라우저 개발 환경에서는 SDK의 Mock Bridge가 자동으로 동작합니다.
            </p>
            <p>
              개발을 시작하려면 <span className="font-medium text-foreground">개발 가이드</span>에서
              프로젝트 생성과 빌드 방식을 확인하고, <span className="font-medium text-foreground">Bridge API</span>에서
              네이티브 기능 호출 방법과 필요한 권한을 확인하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FlowStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Terminal;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/25 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card">
        <Icon className="h-4 w-4 text-union" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function DocCheck({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="h-4 w-4 text-sage" />
      <span>{title}</span>
    </div>
  );
}
