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
    accent: "from-union/10 to-union/5 border-union/10",
    iconColor: "text-union",
  },
  {
    title: "개발 가이드",
    description: "미니앱 개발 환경 설정부터 배포까지의 전체 프로세스",
    href: "/docs/development-guide",
    icon: Code2,
    accent: "from-gold/10 to-gold/5 border-gold/10",
    iconColor: "text-gold",
  },
  {
    title: "Bridge API 레퍼런스",
    description: "Union 플랫폼과 미니앱 간 통신을 위한 API 문서",
    href: "/docs/bridge-api",
    icon: Blocks,
    accent: "from-sage/10 to-sage/5 border-sage/10",
    iconColor: "text-sage",
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
          <h1 className="heading-display text-2xl tracking-tight">개발 문서</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Union 미니앱 개발에 필요한 모든 문서를 확인하세요.
          </p>
          <div className="h-0.5 w-8 bg-union mt-3" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <Link key={section.href} href={section.href} className={`animate-fade-up delay-${i + 1}`}>
              <Card className="h-full card-hover border-border/60 group">
                <CardHeader className="pb-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} border mb-3`}>
                    <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                  </div>
                  <CardTitle className="heading-display text-base flex items-center gap-2">
                    {section.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-union" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="animate-fade-up delay-4 border-border/60">
          <CardHeader>
            <CardTitle className="heading-display text-base">시작하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Union 미니앱은 웹 기술(HTML, CSS, JavaScript)을 사용하여 개발되며,
              Union 플랫폼 내에서 실행됩니다.
            </p>
            <p>
              미니앱 개발을 시작하려면 먼저 <span className="font-medium text-foreground">개발 가이드</span>를 읽고
              개발 환경을 설정한 후, <span className="font-medium text-foreground">Bridge API</span>를 활용하여
              플랫폼의 네이티브 기능에 접근할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
