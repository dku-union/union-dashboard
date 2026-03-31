import Link from "next/link";

import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";
import { Button } from "@/components/ui/button";
import { faqItems, landingNavItems } from "@/data/landing";

export function LandingFaqCta() {
  return (
    <>
      <LandingShell id="faq" className="py-24 sm:py-28">
        <div className="space-y-10">
          <LandingSectionHeading
            eyebrow="FAQ"
            title="도입 전에 많이 묻는 질문"
            description="출시 준비, 대상 조직, 운영 연결 방식처럼 실제 도입 전에 자주 나오는 질문을 먼저 정리했습니다."
          />

          <div className="grid gap-4">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.45)] sm:p-7"
              >
                <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </LandingShell>

      <LandingShell className="pb-16 sm:pb-20">
        <div className="overflow-hidden rounded-[2.4rem] border border-blue-200 bg-[linear-gradient(135deg,#0f1f45,#244cc8_52%,#5687ff)] px-8 py-10 text-white shadow-[0_30px_90px_-35px_rgba(37,99,235,0.6)] sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">
                Final CTA
              </p>
              <h2 className="mt-4 heading-display text-4xl font-semibold tracking-tight sm:text-5xl">
                UniApp로
                <br />
                캠퍼스 아이디어를 시작하세요
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
                학생에게 필요한 공지, 참여, 운영 경험을 더 빠르게 출시하고 검증할 수 있습니다.
                지금 계정을 만들고 퍼블리셔 대시보드에서 다음 단계를 이어가세요.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-white/15 bg-white/8 p-5 backdrop-blur sm:p-6">
              <Button
                size="lg"
                className="h-12 rounded-2xl bg-white text-blue-700 hover:bg-blue-50"
                render={<Link href="/signup" />}
              >
                지금 시작하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/login" />}
              >
                로그인
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 rounded-2xl text-white hover:bg-white/10 hover:text-white"
                render={<a href="#service" />}
              >
                서비스 알아보기
              </Button>
            </div>
          </div>
        </div>
      </LandingShell>

      <footer className="border-t border-slate-200/80 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5B8CFF,#4776F3)] text-sm font-semibold text-white">
                U
              </div>
              <div>
                <p className="heading-display text-lg font-semibold text-slate-950">UniApp</p>
                <p className="text-sm text-slate-500">University mini-app launch platform</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              캠퍼스 안에서 바로 검증하고 확장하는 대학생 전용 미니앱 플랫폼
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {landingNavItems.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-slate-950">
                {item.label}
              </a>
            ))}
            <Link href="/login" className="transition-colors hover:text-slate-950">
              로그인
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
