"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

function Reveal({
  children, className, delay = 0, y = 32,
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

const STATS = [
  { num: "50+",    label: "파트너 대학교",   sub: "전국 거점 대학 중심" },
  { num: "1,200+", label: "출시된 미니앱",   sub: "학생회·동아리·개발자" },
  { num: "98%",    label: "퍼블리셔 만족도", sub: "내부 서베이 기준" },
  { num: "3일",    label: "평균 출시 기간",  sub: "기획에서 배포까지" },
] as const;

export function LandingImpactStats() {
  return (
    <section id="impact" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
            Impact
          </p>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:items-end">
          {/* Left: headline */}
          <div>
            <Reveal delay={0.06} y={50}>
              <h2
                className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", wordBreak: "keep-all" }}
              >
                숫자로 보는
                <br />
                <span className="text-[#E83A33]">Union의 성장</span>
              </h2>
            </Reveal>
            <Reveal delay={0.18} y={20}>
              <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-[#6B6D6B]">
                Union은 대학생들이 가장 많이 사용하는 캠퍼스 슈퍼앱입니다.
                퍼블리셔는 단 하나의 플랫폼으로 전국 모든 대학에 즉시 도달합니다.
              </p>
            </Reveal>
          </div>

          {/* Right: 2×2 stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.20 + i * 0.10} y={20}>
                <div className="group rounded-xl border border-[#DCE4F2] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#E83A33]/30 transition-all duration-300 h-full">
                  <p
                    className="font-black leading-none tracking-tighter text-[#E83A33]"
                    style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)" }}
                  >
                    {stat.num}
                  </p>
                  <p className="mt-3 text-[13px] sm:text-sm font-semibold text-[#262725] leading-tight">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[11px] text-[#8E908E] leading-snug">
                    {stat.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
