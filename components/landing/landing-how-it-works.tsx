"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { howItWorksSteps } from "@/data/landing";

function Reveal({
  children, className, delay = 0, y = 28,
}: {
  children: React.ReactNode; className?: string; delay?: number; y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:items-start">

          {/* Left — heading + visual */}
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
                How It Works
              </p>
              <h2
                className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", wordBreak: "keep-all" }}
              >
                아이디어만 있으면{" "}
                <span className="text-[#E83A33]">바로 출시</span>할 수 있어요
              </h2>
              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-[#6B6D6B]">
                기존 앱스토어의 복잡한 절차 대신, Union에서는 훨씬 가벼운
                운영 흐름으로 서비스를 시작할 수 있습니다.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <figure className="group relative overflow-hidden rounded-2xl border border-[#DCE4F2] bg-[#262725] shadow-md">
                <Image
                  src="/landing/generated/howitworks-launch-moment-v2.png"
                  alt="첫 미니앱이 Union에서 출시 완료되는 순간을 보는 퍼블리셔"
                  width={1024}
                  height={1280}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={false}
                />

                {/* Bottom caption overlay — context for the moment captured */}
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-6 pt-16 bg-gradient-to-t from-[#262725] via-[#262725]/80 to-transparent">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#EF6560]">
                    The launch moment
                  </p>
                  <p className="mt-2 text-sm font-medium text-white sm:text-base">
                    아이디어에서 출시까지, 평균 <span className="text-[#EF6560] font-bold">3일</span>
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Right — steps */}
          <div className="grid gap-4">
            {howItWorksSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.1 + i * 0.1}>
                <div className="group rounded-xl border border-[#DCE4F2] bg-white p-7 shadow-sm hover:shadow-md hover:border-[#E83A33]/30 transition-all duration-300">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDE8E7] group-hover:bg-[#E83A33]/15 transition-colors">
                      <span className="heading-display text-lg font-bold text-[#E83A33]">0{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E83A33]/60">
                        {step.eyebrow}
                      </p>
                      <h3 className="mt-2 heading-display text-xl font-semibold text-[#262725]">{step.title}</h3>
                      <p className="mt-3 text-[13px] leading-6 text-[#6B6D6B] sm:text-sm sm:leading-7">{step.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
