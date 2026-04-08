"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { serviceHighlights } from "@/data/landing";

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

export function LandingServiceIntro() {
  return (
    <section id="service" className="relative overflow-hidden py-32 sm:py-40">

      {/* Aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full -translate-x-1/2"
          style={{
            background: "radial-gradient(circle, rgba(40,90,72,0.38) 0%, transparent 68%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Top label + large word */}
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
            Service
          </p>
          <h2
            className="font-bold leading-[1.0] tracking-tight text-white"
            style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
          >
            CONNECTING
          </h2>
        </Reveal>

        {/* Main statement */}
        <Reveal delay={0.1} className="mt-8 max-w-3xl">
          <p
            className="font-bold leading-[1.12] tracking-tight text-white"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
          >
            Union은 캠퍼스 아이디어를
            <br />
            <span style={{ color: "#75BFA0" }}>실제 서비스로</span> 연결합니다
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/50 sm:text-lg max-w-xl">
            대학생 대상 공지, 참여, 모집, 운영 흐름을 미니앱 단위로
            빠르게 만들고 검증할 수 있습니다.
          </p>
        </Reveal>

        {/* Feature cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {serviceHighlights.map((item, i) => (
            <Reveal key={item.title} delay={0.05 + i * 0.1} y={20}>
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-7 hover:border-[#408A71]/35 hover:bg-[#408A71]/[0.04] transition-all duration-300 h-full">
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#408A71]/20 bg-[#408A71]/10 text-[#52A882] group-hover:bg-[#408A71]/15 transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2.5 text-[13px] leading-6 text-white/50">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom thin divider */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
