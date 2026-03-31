import Image from "next/image";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { miniAppCategories } from "@/data/landing";

export function LandingMiniAppCatalog() {
  return (
    <LandingSection
      id="miniapps"
      fullHeight
      className="py-16 lg:py-8"
      contentClassName="justify-center"
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.12)]">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white px-8 py-10 sm:px-12 sm:py-12">
          <LandingReveal>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
              Mini Apps
            </p>
            <h2 className="mt-4 heading-display text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
              UniApp에서 가능해요
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
              학사, 생활, 행사, 커뮤니티 운영처럼 대학생 일상과 맞닿은 미니앱을
              빠르게 구성할 수 있습니다.
            </p>
          </LandingReveal>
        </div>

        {/* Content */}
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:gap-8 lg:p-10">
          {/* Category grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {miniAppCategories.map((item, index) => (
              <LandingReveal
                key={item.title}
                delay={0.02 * index}
                duration={0.5}
                distance={14}
                className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/50 px-3 py-4 text-center transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ${item.accent}`}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className={`mt-0.5 text-[11px] font-medium ${item.accent}`}>
                  {item.subtitle}
                </p>
              </LandingReveal>
            ))}
          </div>

          {/* Preview panel */}
          <LandingReveal
            variant="image"
            delay={0.16}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-6"
          >
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-blue-600">
                Sample Experience
              </p>
              <h3 className="mt-3 heading-display text-xl font-bold text-slate-950 sm:text-2xl">
                캠퍼스 운영을 한 화면에 담은
                <br />
                미니앱 허브
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                학생회 공지, 캠퍼스 맵, 소모임, 맛집, 분실물처럼 자주 쓰이는
                기능을 카드형 경험으로 빠르게 묶을 수 있습니다.
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-white p-2">
              <Image
                src="/landing/miniapp-mockup.webp"
                alt="Union miniapp mockup"
                width={760}
                height={760}
                className="landing-image-float mx-auto h-auto w-full max-w-[300px] object-contain"
              />
            </div>
          </LandingReveal>
        </div>
      </div>
    </LandingSection>
  );
}
