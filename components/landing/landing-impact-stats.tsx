"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
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

const STATS = [
  { num: "50+",    label: "파트너 대학교",   sub: "전국 거점 대학 중심"  },
  { num: "1,200+", label: "출시된 미니앱",   sub: "학생회·동아리·개발자" },
  { num: "98%",    label: "퍼블리셔 만족도", sub: "내부 서베이 기준"     },
  { num: "3일",    label: "평균 출시 기간",  sub: "기획에서 배포까지"    },
] as const;

export function LandingImpactStats() {
  return (
    <section id="impact" className="relative overflow-hidden py-32 sm:py-44">

      {/* ── Background atmospheric orbs ─────────────────────── */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right wide bloom */}
        <div
          className="absolute -top-40 -right-56 w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(64,138,113,0.15) 0%, transparent 60%)",
            filter: "blur(130px)",
          }}
        />
        {/* Bottom-left corner wash */}
        <div
          className="absolute -bottom-48 -left-40 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(40,90,72,0.20) 0%, transparent 65%)",
            filter: "blur(110px)",
          }}
        />
        {/* Center subtle text halo */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[400px]"
          style={{
            background: "radial-gradient(ellipse, rgba(117,191,160,0.05) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Overline */}
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-10">
            Impact
          </p>
        </Reveal>

        {/* ── Asymmetric layout: headline left, stats right ── */}
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:items-end">

          {/* LEFT: Headline + description */}
          <div>
            <Reveal delay={0.06} y={50}>
              <h2
                className="font-bold leading-[1.04] tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", wordBreak: "keep-all" }}
              >
                숫자로 보는
                <br />
                <span style={{ color: "#75BFA0" }}>Union의 성장</span>
              </h2>
            </Reveal>

            <Reveal delay={0.18} y={20}>
              <p className="mt-6 text-base sm:text-lg text-white/50 max-w-md leading-relaxed">
                Union은 대학생들이 가장 많이 사용하는 캠퍼스 슈퍼앱입니다.
                퍼블리셔는 단 하나의 플랫폼으로 전국 모든 대학에 즉시 도달합니다.
              </p>
            </Reveal>
          </div>

          {/* RIGHT: 2×2 stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.20 + i * 0.10} y={20}>
                <div
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 sm:p-8
                             overflow-hidden hover:border-[#75BFA0]/40 transition-all duration-500 h-full"
                >
                  {/* Hover radial bloom from bottom */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 110%, rgba(117,191,160,0.16) 0%, transparent 60%)",
                    }}
                  />
                  {/* Top-edge accent line */}
                  <div
                    aria-hidden
                    className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(117,191,160,0.55) 50%, transparent)",
                    }}
                  />
                  <div className="relative">
                    <p
                      className="font-black leading-none tracking-tighter"
                      style={{
                        fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                        color: "#75BFA0",
                      }}
                    >
                      {stat.num}
                    </p>
                    <p className="mt-3 text-[13px] sm:text-sm font-semibold text-white/75 leading-tight">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/40 leading-snug">
                      {stat.sub}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>

        {/* Section divider */}
        <div className="mt-24 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
