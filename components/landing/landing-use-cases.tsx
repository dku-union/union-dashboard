import Image from "next/image";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { useCases } from "@/data/landing";

export function LandingUseCases() {
  return (
    <LandingSection
      id="use-cases"
      fullHeight
      className="py-16 lg:py-8"
      contentClassName="justify-center"
    >
      <div className="space-y-10">
        <LandingReveal>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
            Use Cases
          </p>
          <h2 className="mt-4 heading-display text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
            캠퍼스 운영에 바로 연결되는 활용 사례
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
            학생회, 동아리, 학과, 캠퍼스 프로젝트 팀이 어떤 식으로 UniApp을
            활용할 수 있는지 사례 중심으로 보여줍니다.
          </p>
        </LandingReveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((item, index) => (
            <LandingReveal
              as="article"
              key={item.title}
              variant="image"
              delay={0.1 + index * 0.08}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_16px_48px_-16px_rgba(15,23,42,0.15)]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={768}
                  height={768}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 backdrop-blur-sm">
                  Case 0{index + 1}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </LandingReveal>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
