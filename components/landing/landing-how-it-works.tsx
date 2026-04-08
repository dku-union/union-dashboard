"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { howItWorksSteps } from "@/data/landing";

function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-32 sm:py-40">

      {/* Left aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 -left-32 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(40,90,72,0.28) 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:items-start">

          {/* Left col — label + heading + image */}
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
                How It Works
              </p>
              <h2
                className="font-bold leading-[1.04] tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", wordBreak: "keep-all" }}
              >
                아이디어만 있으면{" "}
                <span style={{ color: "#75BFA0" }}>바로 출시</span>할 수 있어요
              </h2>
              <p className="mt-5 text-base text-white/50 max-w-sm">
                기존 앱스토어의 복잡한 절차 대신, Union에서는 훨씬 가벼운
                운영 흐름으로 서비스를 시작할 수 있습니다.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="relative flex items-center justify-center py-20 px-8">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(64,138,113,0.12) 0%, rgba(7,13,10,0.95) 100%)",
                  }}
                />
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#408A71]/15 border border-[#408A71]/25">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <p className="text-sm font-medium text-white/60">아이디어에서 출시까지, 단 3일</p>
                  <div className="flex items-center gap-3 mt-2">
                    {["기획", "개발", "배포"].map((step, i) => (
                      <div key={step} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#408A71]/10 border border-[#408A71]/20 text-xs font-bold text-[#75BFA0]">
                          {i + 1}
                        </span>
                        <span className="text-xs text-white/50">{step}</span>
                        {i < 2 && <span className="text-white/20">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right col — numbered steps */}
          <div className="grid gap-4">
            {howItWorksSteps.map((step, i) => (
              <Reveal key={step.title} delay={0.1 + i * 0.1}>
                <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-7 hover:border-[#408A71]/35 hover:bg-[#408A71]/[0.04] transition-all duration-300">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Number badge */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#408A71]/10 border border-[#408A71]/20 group-hover:bg-[#408A71]/15 transition-colors">
                      <span className="heading-display text-lg font-bold text-[#52A882]">
                        0{i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#52A882]/60">
                        {step.eyebrow}
                      </p>
                      <h3 className="mt-2 heading-display text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[13px] leading-6 text-white/50 sm:text-sm sm:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
