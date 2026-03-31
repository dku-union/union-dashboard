import Image from "next/image";

import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";
import { useCases } from "@/data/landing";

export function LandingUseCases() {
  return (
    <LandingShell id="use-cases" className="py-24 sm:py-28">
      <div className="space-y-12">
        <LandingSectionHeading
          eyebrow="Use Cases"
          title="캠퍼스 운영에 바로 연결되는 활용 사례"
          description="학생회, 동아리, 학과, 캠퍼스 프로젝트 팀이 어떤 식으로 UniApp을 활용할 수 있는지 사례 중심으로 보여줍니다."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {useCases.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_-50px_rgba(15,23,42,0.45)]"
            >
              <div className="overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={768}
                  height={768}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
                  Case 0{index + 1}
                </div>
                <h3 className="heading-display text-2xl font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </LandingShell>
  );
}
