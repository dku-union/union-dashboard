import Image from "next/image";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
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
      <div className="overflow-hidden rounded-[2.25rem] border border-blue-100 bg-[linear-gradient(180deg,#4f7eff_0%,#5d87ff_34%,#eaf2ff_34%,#f7faff_100%)] shadow-[0_30px_80px_-40px_rgba(37,99,235,0.35)]">
        <LandingReveal className="p-8 pb-10 sm:p-12">
          <LandingSectionHeading
            eyebrow="Mini Apps"
            title="UniApp에서 가능해요"
            description="학사, 생활, 행사, 커뮤니티 운영처럼 대학생 일상과 맞닿은 미니앱을 빠르게 구성할 수 있습니다."
          />
        </LandingReveal>

        <div className="grid gap-6 px-6 pb-8 sm:px-8 lg:grid-cols-[1.65fr_0.95fr] lg:gap-8 lg:px-10 lg:pb-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {miniAppCategories.map((item, index) => (
              <LandingReveal
                key={item.title}
                delay={0.03 * index}
                duration={0.55}
                distance={18}
                className="rounded-[1.5rem] border border-white/60 bg-white px-4 py-5 text-center shadow-sm"
              >
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ${item.accent}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900 sm:text-base">
                  {item.title}
                </h3>
                <p className={`mt-1 text-xs font-medium ${item.accent}`}>{item.subtitle}</p>
              </LandingReveal>
            ))}
          </div>

          <LandingReveal
            variant="image"
            delay={0.16}
            className="flex flex-col justify-between rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-lg shadow-blue-950/10"
          >
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-600 uppercase">
                Sample Experience
              </p>
              <h3 className="mt-3 heading-display text-2xl font-semibold text-slate-950">
                캠퍼스 운영을 한 화면에 담은
                <br />
                미니앱 허브
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                학생회 공지, 캠퍼스 맵, 소모임, 맛집, 분실물처럼 자주 쓰이는 기능을 카드형 경험으로 빠르게 묶을 수 있습니다.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-3">
              <Image
                src="/landing/miniapp-mockup.webp"
                alt="Union miniapp mockup"
                width={760}
                height={760}
                className="landing-image-float mx-auto h-auto w-full max-w-[320px] object-contain"
              />
            </div>
          </LandingReveal>
        </div>
      </div>
    </LandingSection>
  );
}
