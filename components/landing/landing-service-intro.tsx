import { serviceHighlights } from "@/data/landing";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingSection } from "@/components/landing/landing-section";

export function LandingServiceIntro() {
  return (
    <LandingSection
      id="service"
      fullHeight
      className="relative py-16 lg:py-8"
      contentClassName="justify-center"
    >
      <div className="grid gap-6 rounded-[2rem] border border-slate-200/70 bg-white/92 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-10 lg:grid-cols-[1.1fr_1.4fr]">
        <LandingReveal delay={0.05}>
          <LandingSectionHeading
            eyebrow="Service"
            align="left"
            title={
              <>
                Union으로 아이디어를
                <br />
                손쉽게 배포하세요
              </>
            }
            description="대학생 대상 공지, 참여, 모집, 운영 흐름을 미니앱 단위로 빠르게 만들고 검증하여, 미니앱을 서비스 할 수 있습니다."
          />
        </LandingReveal>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {serviceHighlights.map((item, index) => (
            <LandingReveal
              key={item.title}
              delay={0.12 + index * 0.08}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </LandingReveal>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
