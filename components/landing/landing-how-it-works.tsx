import Image from "next/image";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { howItWorksSteps } from "@/data/landing";

export function LandingHowItWorks() {
  return (
    <LandingSection
      id="how-it-works"
      fullHeight
      className="py-16 lg:py-8"
      contentClassName="justify-center"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Left: Heading + Image */}
        <div className="space-y-8">
          <LandingReveal delay={0.05}>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
              How It Works
            </p>
            <h2 className="mt-4 heading-display text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
              학생들에게 필요한 미니앱
              <br />
              간단한 절차로 런칭하세요
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-500">
              기존 앱스토어의 복잡한 절차와 높은 진입 장벽 대신, Union에서는
              훨씬 가벼운 운영 흐름으로 서비스를 시작할 수 있습니다.
            </p>
          </LandingReveal>

          <LandingReveal
            variant="image"
            delay={0.14}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.15)]"
          >
            <Image
              src="/landing/easy-launch.webp"
              alt="Easy launch illustration"
              width={768}
              height={768}
              className="landing-image-float h-auto w-full rounded-xl object-cover"
            />
          </LandingReveal>
        </div>

        {/* Right: Steps with timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute bottom-6 left-[22px] top-6 w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent lg:left-[26px]" />

          <div className="space-y-1">
            {howItWorksSteps.map((step, index) => (
              <LandingReveal
                key={step.title}
                delay={0.14 + index * 0.1}
                className="group relative flex gap-5 rounded-2xl p-5 transition-colors hover:bg-slate-50/80 lg:gap-6"
              >
                {/* Step number */}
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white font-mono text-sm font-bold text-blue-600 shadow-sm transition-all group-hover:border-blue-200 group-hover:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] lg:h-[52px] lg:w-[52px]">
                  0{index + 1}
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </LandingReveal>
            ))}
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
