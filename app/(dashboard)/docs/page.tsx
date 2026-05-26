import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eyebrow,
  GridMosaic,
  QuarterCircle,
} from "@/components/docs/geometric-motifs";
import {
  Sparkles,
  Code2,
  ShieldCheck,
  Palette,
  Rocket,
  ArrowUpRight,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type DocCategoryCard = {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  links: { label: string; href: string }[];
};

const categories: DocCategoryCard[] = [
  {
    id: "getting-started",
    number: "01",
    title: "시작하기",
    description: "5분 안에 첫 미니앱을 빌드하고 검증하는 흐름.",
    href: "/docs/quick-start",
    icon: Sparkles,
    links: [{ label: "빠른 시작", href: "/docs/quick-start" }],
  },
  {
    id: "development",
    number: "02",
    title: "개발",
    description: "프로젝트 설정, Bridge API 7개 모듈, 권한 모델.",
    href: "/docs/development/config",
    icon: Code2,
    links: [
      { label: "프로젝트 설정", href: "/docs/development/config" },
      { label: "Bridge API", href: "/docs/development/bridge-api" },
      { label: "권한 모델", href: "/docs/development/permissions" },
    ],
  },
  {
    id: "guidelines",
    number: "03",
    title: "가이드라인",
    description: "심사 기준과 보안 규칙. 반려를 피하는 가장 빠른 길.",
    href: "/docs/guidelines/review",
    icon: ShieldCheck,
    links: [
      { label: "심사 기준", href: "/docs/guidelines/review" },
      { label: "알림 발송", href: "/docs/guidelines/notifications" },
    ],
  },
  {
    id: "design",
    number: "04",
    title: "디자인",
    description: "Union 슈퍼앱 안에서 자연스러운 UI/UX 기준.",
    href: "/docs/design",
    icon: Palette,
    links: [{ label: "디자인 가이드라인", href: "/docs/design" }],
  },
  {
    id: "distribution",
    number: "05",
    title: "배포",
    description: "빌드, validate, 업로드, 심사 진행과 결과 처리.",
    href: "/docs/distribution/build",
    icon: Rocket,
    links: [
      { label: "빌드와 검증", href: "/docs/distribution/build" },
      { label: "업로드와 심사", href: "/docs/distribution/submit" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* HERO — clean & minimal. Single accent bar, no decorative motifs. */}
      <section className="space-y-5 pt-2 pb-1">
        <Eyebrow>Developer Docs</Eyebrow>
        <h1 className="font-display text-[36px] md:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground max-w-2xl">
          미니앱을 만들고 심사를 통과하는 문서.
        </h1>
        <p className="text-[15px] leading-[1.7] text-foreground/65 max-w-xl">
          생성, SDK 연동, 빌드 패키징, 심사 신청까지의 흐름을 한 곳에서
          확인합니다.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button
            className="bg-union text-white hover:bg-union/90 h-10 px-5 font-semibold"
            render={<Link href="/docs/quick-start" />}
          >
            빠른 시작
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-foreground/[0.04] h-10 px-4 text-foreground/70"
            render={<Link href="/workspace" />}
          >
            <Upload className="h-4 w-4" />
            업로드로 이동
          </Button>
        </div>
        <span aria-hidden className="block h-[3px] w-12 bg-union mt-4" />
      </section>

      {/* Flow strip — five waypoints with arrows */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <Eyebrow>Workflow</Eyebrow>
          <span className="text-[11px] text-muted-foreground tracking-wider">
            create → build → validate → upload → review
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          {[
            { label: "생성", code: "union create" },
            { label: "개발", code: "union dev" },
            { label: "빌드", code: "union build" },
            { label: "검증", code: "union validate" },
            { label: "업로드", code: "Dashboard" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="rounded-md border border-border bg-card px-3 py-2 min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {String(i + 1).padStart(2, "0")} · {step.label}
                </p>
                <code className="text-[12px] font-mono text-foreground font-medium">
                  {step.code}
                </code>
              </div>
              {i < arr.length - 1 && (
                <span aria-hidden className="text-foreground/30 select-none">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Categories — 5 editorial cards, asymmetric layout */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] font-bold tracking-tight flex items-baseline gap-3">
            <span aria-hidden className="inline-block w-6 h-[3px] bg-union translate-y-[-4px]" />
            카테고리
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const Icon = category.icon;
            // Make first card span 2 columns on lg+ for editorial asymmetry
            const isFeature = i === 0;
            return (
              <Link
                key={category.href}
                href={category.href}
                className={cn_local(
                  "group relative",
                  isFeature && "lg:col-span-2",
                )}
              >
                <Card className="relative h-full overflow-hidden border-border bg-card transition-all duration-200 hover:border-union/45 hover:shadow-[0_4px_16px_rgba(38,39,37,0.08)]">
                  {/* quarter-circle corner accent */}
                  <QuarterCircle
                    aria-hidden
                    className="absolute top-0 left-0 w-3.5 h-3.5 text-union opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 grid place-items-center rounded-md bg-foreground text-background">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                          {category.number}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground -translate-y-0.5 translate-x-0.5 group-hover:text-union group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-[20px] font-bold tracking-tight text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-[13.5px] leading-[1.6] text-foreground/65">
                        {category.description}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-1.5 pt-1">
                      {category.links.map((link) => (
                        <li
                          key={link.href}
                          className="text-[11.5px] px-2 py-1 rounded border border-border bg-background/40 text-foreground/70 font-medium"
                        >
                          {link.label}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tail — handoff to quick start */}
      <section className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 md:p-10">
        {/* tiny mosaic on the right */}
        <div
          aria-hidden
          className="absolute -right-10 -bottom-10 opacity-30 pointer-events-none hidden md:block"
        >
          <GridMosaic cell={28} />
        </div>
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-end">
          <div className="space-y-3 max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-union font-bold">
              · Get started
            </p>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold tracking-tight leading-[1.15]">
              5분 안에 첫 미니앱
              <br />
              빌드부터 검증까지.
            </h2>
            <p className="text-[14px] leading-relaxed text-background/70">
              Mock Bridge가 자동으로 켜지므로 네이티브 없이도 바로 개발할 수
              있습니다.
            </p>
          </div>
          <Button
            className="bg-union text-white hover:bg-union/90 h-11 px-6 font-semibold"
            render={<Link href="/docs/quick-start" />}
          >
            빠른 시작
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

// inline cn to avoid extra import in this file
function cn_local(...args: Array<string | false | undefined | null>) {
  return args.filter(Boolean).join(" ");
}
