"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { landingStats } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";
import { HeroMosaicCanvas } from "@/components/landing/hero-rocket-canvas";

const TICKER = [
  "UNION MINIAPP PLATFORM", "·", "PUBLISHER CONSOLE", "·",
  "SDK BUILD",              "·", "QR TEST",           "·",
  "REVIEW",                 "·", "DEPLOY",            "·",
];

const MOBILE_FLOW_STEPS = ["빌드 업로드", "QR 테스트", "심사 요청", "승인 후 배포"] as const;

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
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E83A33]" />
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#6B6D6B]">
              Union Publisher Platform
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
            캠퍼스 서비스를
            <br />
            <Highlight>미니앱으로</Highlight>
            <br />
            출시하는 콘솔
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-lg text-base leading-relaxed text-[#6B6D6B] sm:text-lg"
          >
            SDK로 개발한 미니앱을 업로드하고,
            <br />
            테스트·심사·배포까지 하나의 흐름으로 관리하세요.
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
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl
                         border border-[#DCE4F2] bg-white px-8 text-sm font-medium text-[#6B6D6B]
                         transition-all hover:border-[#B0B2B0] hover:text-[#262725]"
            >
              출시 흐름 보기
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62 }}
            className="mt-8 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur lg:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E83A33]">
                Release Flow
              </p>
              <span className="rounded-full bg-[#FDE8E7] px-2.5 py-1 text-[11px] font-medium text-[#E83A33]">
                4단계
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {MOBILE_FLOW_STEPS.map((step, i) => (
                <div key={step} className="rounded-xl border border-[#DCE4F2] bg-[#EDF2FA] px-3 py-2.5">
                  <p className="text-[10px] font-medium text-[#8E908E]">0{i + 1}</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#262725]">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 grid grid-cols-3 gap-3 sm:mt-16 sm:flex sm:flex-wrap sm:gap-x-12 sm:gap-y-6"
          >
            {landingStats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-xl border border-[#DCE4F2] bg-white/55 px-3 py-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0",
                  i > 0 && "sm:border-l sm:border-[#DCE4F2] sm:pl-12"
                )}
              >
                <p className="heading-display text-xl font-bold leading-tight text-[#262725] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#8E908E] sm:text-[10px] sm:tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Geometric Mosaic */}
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
