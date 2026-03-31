import Link from "next/link";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";

export function LandingHero() {
  return (
    <LandingSection fullHeight id="top" className="landing-hero relative overflow-hidden">
      <div className="landing-hero__aurora" />
      <div className="relative py-20 sm:py-24 lg:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <LandingReveal delay={0.05}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              대학생 전용 미니앱 플랫폼
            </div>
          </LandingReveal>
          <LandingReveal as="h1" delay={0.12} className="heading-display max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
            우리 학교에
            <span className="block bg-linear-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              필요한 미니앱
            </span>
            직접 만들어보세요
          </LandingReveal>
          <LandingReveal
            as="p"
            delay={0.2}
            className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-2xl"
          >
            Union에서 미니앱을 출시하고,
            <br />
            전국 대학생들에게 내 서비스를 선보이세요.
          </LandingReveal>
          <LandingReveal
            delay={0.28}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5B8CFF,#4776F3)] px-8 text-base font-medium text-white shadow-xl shadow-blue-950/35 transition-all hover:opacity-95"
            >
              지금 시작하기
            </Link>
            <a
              href="#service"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-8 text-base font-medium text-white transition-all hover:bg-white/12 hover:text-white"
            >
              서비스 알아보기
            </a>
          </LandingReveal>
        </div>
      </div>
    </LandingSection>
  );
}
