"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { landingStats } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";
import { HeroMosaicCanvas } from "@/components/landing/hero-rocket-canvas";

const TICKER = [
  "대학생 미니앱 플랫폼", "·", "UNION", "·",
  "PUBLISHER PLATFORM",   "·", "200,000+ 대학생", "·",
  "50+ 미니앱",           "·", "300+ 연결 대학",  "·",
];

/* ── Hero Section ─────────────────────────────────────────── */

export function LandingHero() {
  return (
    <section className="relative min-h-svh overflow-clip bg-[#EDF2FA]">

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, #B0B2B0 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top-right decorative wash */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(circle, rgba(232,58,51,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Marquee ticker ────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b border-[#DCE4F2] py-2.5"
        aria-hidden
      >
        <div className="animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className={cn(
                "mx-5 shrink-0 text-[10px] font-medium tracking-[0.22em]",
                t === "·" ? "text-[#DCE4F2]" : "text-[#8E908E] uppercase"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8
                   flex flex-col lg:flex-row lg:items-center lg:gap-16
                   min-h-[calc(100svh-64px)] py-20 lg:py-0"
      >
        {/* Left: Copy */}
        <div className="flex-1 max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E83A33] opacity-55" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E83A33]" />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#6B6D6B]">
              대학생 전용 미니앱 플랫폼
            </p>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display font-extrabold leading-[1.04] tracking-tight text-[#262725]"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            내 아이디어가
            <br />
            <Highlight>200,000명의</Highlight>
            <br />
            대학생에게 닿는 방법
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-lg text-base leading-relaxed text-[#6B6D6B] sm:text-lg"
          >
            Union에서 미니앱을 출시하고,
            <br />
            전국 대학생들에게 내 서비스를 선보이세요.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.52 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-xl
                         bg-[#E83A33] px-8 text-sm font-medium text-white
                         shadow-lg shadow-[#E83A33]/20
                         transition-all hover:bg-[#C42E29] hover:shadow-[#E83A33]/30"
            >
              지금 시작하기
            </Link>
            <a
              href="#service"
              className="inline-flex h-12 items-center justify-center rounded-xl
                         border border-[#DCE4F2] bg-white px-8 text-sm font-medium text-[#6B6D6B]
                         transition-all hover:border-[#B0B2B0] hover:text-[#262725]"
            >
              서비스 알아보기
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 flex flex-wrap gap-x-12 gap-y-6"
          >
            {landingStats.map((stat, i) => (
              <div
                key={stat.label}
                className={i > 0 ? "border-l border-[#DCE4F2] pl-12" : undefined}
              >
                <p className="heading-display text-3xl font-bold text-[#262725] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8E908E]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Geometric Mosaic + Rocket */}
        <div
          className="hidden lg:flex items-center justify-center flex-shrink-0"
          style={{ overflow: "visible" }}
        >
          <HeroMosaicCanvas />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-2"
      >
        <div className="h-12 w-px bg-gradient-to-b from-[#B0B2B0] to-transparent" />
        <p
          className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#B0B2B0]"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
