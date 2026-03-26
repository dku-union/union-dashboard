import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  LayoutDashboard,
  Rocket,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

const valueProps = [
  {
    title: "배포까지 더 빠르게",
    description:
      "미니앱 등록, 심사 제출, 배포 준비를 하나의 흐름으로 묶어 출시 시간을 줄입니다.",
    icon: Rocket,
  },
  {
    title: "개발에 필요한 문서를 바로",
    description:
      "개발 가이드와 Bridge API 문서를 바로 확인하며 구현과 제출 준비를 동시에 진행할 수 있습니다.",
    icon: BookOpen,
  },
  {
    title: "배포 후 운영도 이어서",
    description:
      "워크스페이스, 리뷰, 분석 화면을 통해 배포 이후 운영과 다음 버전 작업까지 이어집니다.",
    icon: LayoutDashboard,
  },
];

const processSteps = [
  {
    step: "01",
    title: "기획",
    description: "배포할 미니앱의 목적과 사용자 흐름을 정리하고 필요한 자료를 준비합니다.",
  },
  {
    step: "02",
    title: "개발",
    description: "문서와 API 가이드를 참고해 기능을 구현하고 제출 기준에 맞춰 앱을 완성합니다.",
  },
  {
    step: "03",
    title: "심사",
    description: "심사 요청을 제출하고 피드백을 반영해 출시 가능한 상태로 다듬습니다.",
  },
  {
    step: "04",
    title: "배포",
    description: "Union에 미니앱을 배포하고 운영 상태와 다음 버전을 이어서 관리합니다.",
  },
];

const features = [
  {
    title: "미니앱 등록과 버전 관리",
    description: "앱 등록부터 버전 이력 관리까지 배포 단위를 분명하게 정리할 수 있습니다.",
    icon: Compass,
  },
  {
    title: "리뷰와 심사 대응",
    description: "심사 상태와 피드백을 확인하고 수정 사항을 빠르게 반영할 수 있습니다.",
    icon: ClipboardCheck,
  },
  {
    title: "워크스페이스 협업",
    description: "팀 단위로 퍼블리셔 자산을 관리하고 작업 맥락을 공유할 수 있습니다.",
    icon: Users,
  },
  {
    title: "운영과 분석",
    description: "배포 이후 주요 지표와 운영 상태를 확인하며 다음 액션을 정할 수 있습니다.",
    icon: Workflow,
  },
];

const docLinks = [
  {
    title: "개발 문서",
    href: "/docs",
    description: "플랫폼 구조와 전체 문서 인덱스를 빠르게 훑어볼 수 있는 시작점입니다.",
  },
  {
    title: "디자인 가이드라인",
    href: "/docs/design-guidelines",
    description: "화면 설계와 UI 규칙을 맞추기 위한 기준을 확인합니다.",
  },
  {
    title: "개발 가이드",
    href: "/docs/development-guide",
    description: "구현과 제출 전에 체크해야 할 절차를 정리해둔 문서입니다.",
  },
  {
    title: "Bridge API",
    href: "/docs/bridge-api",
    description: "앱과 플랫폼을 연결하는 인터페이스를 확인할 수 있습니다.",
  },
];

const navLinks = [
  { label: "프로세스", href: "#process" },
  { label: "기능", href: "#features" },
  { label: "문서", href: "#docs" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-[22rem] h-[36rem] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08),_transparent_62%)]" />

        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-union text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)]">
                U
              </div>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">Union Publisher Dashboard</p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Developer Platform</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_40px_rgba(26,39,68,0.22)] transition-transform hover:-translate-y-0.5"
              >
                시작하기
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-union/15 bg-white/80 px-3 py-1 text-xs font-medium text-union shadow-sm shadow-union/5">
                <Sparkles className="h-3.5 w-3.5" />
                미니앱 개발부터 배포까지, 하나의 워크플로우로
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                Union에 미니앱을 배포하세요.
                <br />
                개발부터 배포까지 손쉽게
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Union Publisher Dashboard는 미니앱 등록, 심사 제출, 워크스페이스 협업,
                운영 분석을 한 흐름으로 연결하는 퍼블리셔 플랫폼입니다. 필요한 문서를
                바로 확인하고, 출시까지 걸리는 시간을 줄이세요.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_rgba(26,39,68,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-union/30 hover:bg-white"
                >
                  개발 문서 보기
                  <BookOpen className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.2),_transparent_48%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,248,255,0.92))] p-6 shadow-[0_30px_90px_rgba(26,39,68,0.14)]">
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Workflow</p>
                    <p className="mt-1 font-display text-lg font-semibold">Mini App Launch</p>
                  </div>
                  <div className="rounded-full bg-union/10 px-3 py-1 text-xs font-medium text-union">
                    Ready to Publish
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {processSteps.map((item) => (
                    <div
                      key={item.step}
                      className="grid gap-3 rounded-2xl border border-border/60 bg-white/85 p-4 sm:grid-cols-[auto_1fr]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "심사 기준 문서 바로 확인",
                    "워크스페이스별 자산 정리",
                    "배포 이후 운영 상태 추적",
                    "버전 단위 제출 흐름 관리",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-2xl border border-border/50 bg-background/70 px-3 py-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sage" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section id="value" className="grid gap-5 lg:grid-cols-3">
            {valueProps.map((item, index) => (
              <article
                key={item.title}
                className={`animate-fade-up rounded-[1.75rem] border border-border/60 bg-card/85 p-6 shadow-[0_18px_50px_rgba(26,39,68,0.08)] delay-${index + 1}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-union/10 text-union">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </section>
        </section>

        <section id="process" className="border-y border-border/50 bg-white/45">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-union">Process</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                기획부터 배포까지 끊기지 않는 미니앱 출시 흐름
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                퍼블리셔가 실제로 거치는 단계를 순서대로 정리해, 필요한 화면과 문서를
                바로 찾을 수 있도록 구성했습니다.
              </p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {processSteps.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-[0_18px_40px_rgba(26,39,68,0.06)]"
                >
                  <p className="text-sm font-medium text-union">{item.step}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-union">Capabilities</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                배포에 필요한 기능을 한 흐름으로 구성했습니다
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              등록, 심사, 협업, 분석이 서로 끊어지지 않도록 퍼블리셔 관점에서 기능을
              연결했습니다.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map((item) => (
              <article
                key={item.title}
                className="group rounded-[1.75rem] border border-border/60 bg-card/90 p-7 shadow-[0_20px_50px_rgba(26,39,68,0.07)] transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="docs" className="border-t border-border/50 bg-[linear-gradient(180deg,rgba(219,234,254,0.2),rgba(255,255,255,0.86))]">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-union">Documentation</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                구현 전에 바로 들어갈 수 있는 문서 진입점
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                개발과 제출 전에 꼭 확인해야 하는 문서를 빠르게 찾을 수 있도록 정리했습니다.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {docLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[1.75rem] border border-border/60 bg-card/90 p-6 shadow-[0_18px_40px_rgba(26,39,68,0.06)] transition-all hover:border-union/30 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-semibold tracking-tight">{item.title}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-union" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border/60 bg-primary px-6 py-10 text-primary-foreground shadow-[0_30px_70px_rgba(26,39,68,0.22)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">Start Publishing</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                지금 바로 Union에 첫 미니앱을 배포해보세요.
              </h2>
              <p className="mt-4 text-sm leading-7 text-primary-foreground/75 sm:text-base">
                처음 시작하는 퍼블리셔라면 회원가입부터, 이미 계정이 있다면 로그인 후
                바로 배포 흐름을 이어갈 수 있습니다.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                로그인
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/50 bg-background/90">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">Union Publisher Dashboard</p>
              <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Union에 미니앱을 배포하고 운영하기 위한 퍼블리셔 전용 플랫폼입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/docs" className="transition-colors hover:text-foreground">
                문서
              </Link>
              <Link href="/login" className="transition-colors hover:text-foreground">
                로그인
              </Link>
              <Link href="/signup" className="transition-colors hover:text-foreground">
                회원가입
              </Link>
              <a
                href="https://github.com/dku-union/union-dashboard"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
