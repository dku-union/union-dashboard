"use client";

import { DocSidebar } from "@/components/docs/doc-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Package,
  Palette,
  ShieldCheck,
  Terminal,
  Upload,
} from "lucide-react";
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

const launchFlow = [
  {
    title: "SDK로 구현",
    description: "템플릿을 생성하고 Bridge API 권한을 코드와 설정에 맞춥니다.",
  },
  {
    title: "패키지 업로드",
    description: "워크스페이스에서 .unionapp 파일과 릴리즈 노트를 등록합니다.",
  },
  {
    title: "QR 테스트",
    description: "슈퍼앱 환경에서 핵심 화면, 권한 요청, 오류 상태를 확인합니다.",
  },
  {
    title: "심사 제출",
    description: "테스트 완료 버전을 제출하고 반려 시 수정 버전을 다시 올립니다.",
  },
  {
    title: "승인 후 배포",
    description: "승인된 버전을 선택해 슈퍼앱 사용자에게 공개합니다.",
  },
];

const reviewChecklist = [
  "앱 이름, 설명, 아이콘이 실제 서비스 목적과 일치합니다.",
  "요청 권한은 기능에 필요한 범위만 포함합니다.",
  "로그인 실패, 권한 거부, 네트워크 오류 상태가 화면에서 처리됩니다.",
  "릴리즈 노트에 변경 사항과 검증 포인트가 정리되어 있습니다.",
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

        <Card className="publisher-panel animate-fade-up delay-2">
          <CardHeader>
            <CardTitle className="text-heading-3">출시 운영 흐름</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:grid-cols-5">
              {launchFlow.map((item, index) => (
                <div key={item.title} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <p className="text-xs font-medium text-union">0{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
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
                <p className="publisher-eyebrow">Review Ready</p>
                <div className="mt-4 space-y-3">
                  {reviewChecklist.map((item) => (
                    <DocCheck key={item} title={item} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="publisher-panel animate-fade-up delay-7">
              <CardContent className="p-4">
                <p className="publisher-eyebrow">Console Flow</p>
                <div className="mt-4 space-y-3 text-sm">
                  <ConsoleStep title="업로드" description="워크스페이스에서 미니앱과 버전을 생성합니다." />
                  <ConsoleStep title="테스트" description="QR 테스트 완료 후 심사 요청이 활성화됩니다." />
                  <ConsoleStep title="심사" description="운영자 승인 후 배포 가능한 버전이 됩니다." />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Card className="publisher-panel animate-fade-up delay-7">
          <CardHeader>
            <CardTitle className="text-heading-3">퍼블리셔가 먼저 확인할 것</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Union 미니앱은 React와 Vite 기반으로 개발되며, Union 슈퍼앱의 WebView 안에서 실행됩니다.
              브라우저에서는 Mock Bridge로 개발하고, 업로드 후에는 QR 테스트로 실제 슈퍼앱 실행 환경을 확인합니다.
            </p>
            <p>
              개발을 시작할 때는 <span className="font-medium text-foreground">개발 가이드</span>에서
              프로젝트 생성과 패키징 방식을 확인하고, <span className="font-medium text-foreground">Bridge API</span>에서
              네이티브 기능 호출 방법과 필요한 권한을 먼저 정리하세요. 심사는 구현 품질뿐 아니라 권한 설명, 오류 처리,
              릴리즈 노트까지 함께 봅니다.
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

function ConsoleStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-union/10">
        <ClipboardCheck className="h-3.5 w-3.5 text-union" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
