"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Code2, Blocks, ArrowRight } from "lucide-react";
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
      <div className="flex-1 space-y-8">
        <div className="animate-fade-up">
          <h1 className="text-heading-1">개발 문서</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Union 미니앱 개발에 필요한 모든 문서를 확인하세요.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <Link key={section.href} href={section.href} className={`animate-fade-up delay-${i + 1}`}>
              <Card className="h-full card-hover border-border/60 group">
                <CardHeader className="pb-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} border mb-3`}>
                    <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                  </div>
                  <CardTitle className="text-heading-3 flex items-center gap-2">
                    {section.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="animate-fade-up delay-4 border-border/60">
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
