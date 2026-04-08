"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCases } from "@/data/landing";
import { Building2, Rocket, RefreshCw } from "lucide-react";

const CASE_ICONS = [Building2, Rocket, RefreshCw];

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
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

export function LandingUseCases() {
  return (
    <section id="use-cases" className="relative overflow-hidden py-32 sm:py-40">

      {/* Center aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(40,90,72,0.22) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
            Use Cases
          </p>
          <h2
            className="font-bold leading-[1.04] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            캠퍼스 운영에
            <br />
            <span style={{ color: "#75BFA0" }}>바로 연결되는</span> 활용 사례
          </h2>
          <p className="mt-5 max-w-lg text-base text-white/50">
            학생회, 동아리, 학과, 캠퍼스 프로젝트 팀이 어떤 식으로 활용할 수 있는지
            사례 중심으로 보여줍니다.
          </p>
        </Reveal>

        {/* Case cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} y={20}>
              <article className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:border-[#408A71]/30 transition-all duration-300">
                {/* Visual placeholder */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, rgba(64,138,113,${0.15 + i * 0.08}) 0%, rgba(7,13,10,0.9) 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => {
                      const Icon = CASE_ICONS[i];
                      return (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#408A71]/15 border border-[#408A71]/25">
                          <Icon className="h-7 w-7 text-[#75BFA0]" />
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {/* Body */}
                <div className="p-6 space-y-3">
                  <div className="inline-flex items-center rounded-full border border-[#408A71]/20 bg-[#408A71]/8 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#52A882] uppercase">
                    Case 0{i + 1}
                  </div>
                  <h3 className="heading-display text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-6 text-white/40">
                    {item.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
