import { serviceHighlights } from "@/data/landing";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";

export function LandingServiceIntro() {
  return (
    <LandingSection
      id="service"
      fullHeight
      className="relative py-16 lg:py-8"
      contentClassName="justify-center"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        {/* Left: Heading card */}
        <LandingReveal
          delay={0.05}
          className="rounded-3xl border border-white/[0.08] bg-[linear-gradient(145deg,#0d1a30,#152242)] p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.4)] sm:p-10"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
            Service
          </p>
          <h2 className="mt-5 heading-display text-3xl font-bold leading-tight tracking-[-0.025em] text-white sm:text-4xl">
            Union으로 아이디어를
            <br />
            손쉽게 배포하세요
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-300/80">
            대학생 대상 공지, 참여, 모집, 운영 흐름을 미니앱 단위로 빠르게
            만들고 검증하여, 미니앱을 서비스 할 수 있습니다.
          </p>
        </LandingReveal>

        {/* Right: Feature cards */}
        <div className="grid gap-3">
          {serviceHighlights.map((item, index) => (
            <LandingReveal
              key={item.title}
              delay={0.14 + index * 0.08}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 backdrop-blur transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_40px_-12px_rgba(37,99,235,0.15)]"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-blue-600 transition-colors group-hover:bg-blue-50">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-slate-300">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </LandingReveal>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
