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
      <div className="grid gap-8 p-2 sm:p-4 lg:grid-cols-[1.1fr_1.4fr] lg:gap-10 lg:p-0">
        <LandingReveal
          delay={0.05}
          className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.7)] backdrop-blur-md sm:p-8"
        >
          <LandingSectionHeading
            eyebrow="Service"
            align="left"
            eyebrowClassName="text-blue-300"
            titleClassName="text-white"
            descriptionClassName="text-slate-200/90"
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
              className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] backdrop-blur"
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
