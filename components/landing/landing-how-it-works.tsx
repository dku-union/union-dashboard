import Image from "next/image";

import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";
import { howItWorksSteps } from "@/data/landing";

export function LandingHowItWorks() {
  return (
    <LandingShell id="how-it-works" className="py-24 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="space-y-8">
          <LandingSectionHeading
            eyebrow="How It Works"
            align="left"
            title={
              <>
                아이디어만 있으면
                <br />
                바로 출시할 수 있어요
              </>
            }
            description="기존 앱스토어의 복잡한 절차와 높은 진입 장벽 대신, Union에서는 훨씬 가벼운 운영 흐름으로 서비스를 시작할 수 있습니다."
          />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.45)]">
            <Image
              src="/landing/easy-launch.webp"
              alt="Easy launch illustration"
              width={768}
              height={768}
              className="h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {howItWorksSteps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-50px_rgba(59,130,246,0.45)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-2 heading-display text-2xl font-semibold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandingShell>
  );
}
