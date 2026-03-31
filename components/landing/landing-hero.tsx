import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";

export function LandingHero() {
  return (
    <LandingSection
      fullHeight
      id="top"
      className="landing-hero relative overflow-hidden"
    >
      <div className="landing-hero__aurora" />
      <div className="relative py-20 sm:py-24 lg:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <LandingReveal delay={0.05}>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(96,165,250,0.6)]" />
              <span className="text-[13px] font-medium tracking-wide text-slate-300">
                대학생 전용 미니앱 플랫폼
              </span>
            </div>
          </LandingReveal>

          <LandingReveal
            as="h1"
            delay={0.12}
            className="heading-display max-w-5xl text-[3.25rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-7xl lg:text-[6rem]"
          >
            우리 학교에{" "}
            <span className="bg-[linear-gradient(135deg,#93bbff_0%,#5b8cff_50%,#a78bfa_100%)] bg-clip-text text-transparent">
              필요한 미니앱
            </span>
            <br />
            직접 만들어보세요
          </LandingReveal>

          <LandingReveal
            as="p"
            delay={0.2}
            className="mt-7 max-w-lg text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
          >
            Union에서 미니앱을 출시하고,
            <br className="hidden sm:block" />
            전국 대학생들에게 내 서비스를 선보이세요.
          </LandingReveal>

          <LandingReveal
            delay={0.28}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-[15px] font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_-20px_rgba(59,130,246,0.35)] transition-all hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_20px_50px_-15px_rgba(59,130,246,0.5)]"
            >
              지금 시작하기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#service"
              className="inline-flex h-12 items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 text-[15px] font-medium text-slate-300 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
            >
              서비스 알아보기
            </a>
          </LandingReveal>
        </div>
      </div>
    </LandingSection>
  );
}
