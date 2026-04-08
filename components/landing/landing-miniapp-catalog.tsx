"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { miniAppCategories } from "@/data/landing";

function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
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
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingMiniAppCatalog() {
  return (
    <section id="miniapps" className="relative overflow-hidden py-32 sm:py-40">

      {/* Subtle right aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(64,138,113,0.14) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
            Mini Apps
          </p>
          <h2
            className="font-bold leading-[1.04] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            UniApp에서
            <br />
            <span style={{ color: "#75BFA0" }}>가능해요</span>
          </h2>
          <p className="mt-5 max-w-lg text-base text-white/50">
            학사, 생활, 행사, 커뮤니티 운영처럼 대학생 일상과 맞닿은
            미니앱을 빠르게 구성할 수 있습니다.
          </p>
        </Reveal>

        {/* Grid + mockup */}
        <div className="grid gap-6 lg:grid-cols-[1.65fr_0.95fr] lg:items-start">

          {/* App categories grid */}
          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {miniAppCategories.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-4 text-center hover:border-[#408A71]/25 hover:bg-[#408A71]/[0.04] transition-all duration-200 cursor-default"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] group-hover:bg-[#408A71]/10 transition-colors">
                    <item.icon className="h-4.5 w-4.5 text-white/50 group-hover:text-[#75BFA0] transition-colors" style={{ height: "18px", width: "18px" }} />
                  </div>
                  <h3 className="mt-3 text-[12px] font-medium text-white/70">{item.title}</h3>
                  <p className="mt-0.5 text-[10px] text-white/45 uppercase tracking-wide">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Mockup card */}
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#52A882]">
                Sample Experience
              </p>
              <h3 className="mt-3 heading-display text-xl font-semibold text-white leading-snug">
                캠퍼스 운영을 한 화면에 담은
                <br />
                미니앱 허브
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-white/50">
                학생회 공지, 캠퍼스 맵, 소모임, 맛집, 분실물처럼 자주 쓰이는
                기능을 카드형 경험으로 빠르게 묶을 수 있습니다.
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
                <Image
                  src="/landing/miniapp-mockup.webp"
                  alt="Union miniapp mockup"
                  width={760}
                  height={760}
                  className="mx-auto h-auto w-full max-w-[300px] object-contain opacity-90"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
