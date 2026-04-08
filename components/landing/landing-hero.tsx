"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { landingStats } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";

/*
 * Hero is a TRANSPARENT section — no solid background.
 * The global LandingCanvas (fixed, z:-1) shows through on the right side.
 * Left-side CSS gradient overlay keeps text legible.
 * Aurora blobs add atmospheric depth on top of the canvas.
 */

const TICKER = [
  "대학생 미니앱 플랫폼", "·", "UNION", "·",
  "PUBLISHER PLATFORM",   "·", "200,000+ 대학생", "·",
  "50+ 미니앱",           "·", "300+ 연결 대학",  "·",
];

export function LandingHero() {
  return (
    <section className="relative min-h-svh overflow-hidden">

      {/* ── Atmospheric aurora (CSS only, no canvas) ─────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Top-left deep green pulse */}
        <div
          className="absolute -top-48 -left-32 w-[640px] h-[640px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(40,90,72,0.48) 0%, transparent 68%)",
            filter:     "blur(88px)",
          }}
        />
        {/* Top-right subtle glow */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(64,138,113,0.12) 0%, transparent 70%)",
            filter:     "blur(100px)",
          }}
        />
        {/* Bottom haze */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(82,168,130,0.06) 0%, transparent 70%)",
            filter:     "blur(70px)",
          }}
        />
        {/* Micro grid */}
        <div
          className="absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ── Gradient overlay — text legibility on left ─────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex:     1,
          background:
            "linear-gradient(to right, #070d0a 18%, rgba(7,13,10,0.90) 34%, " +
            "rgba(7,13,10,0.45) 55%, transparent 72%)",
        }}
        aria-hidden
      />

      {/* ── Marquee ticker ────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b border-white/[0.05] py-2.5"
        style={{ zIndex: 2 }}
        aria-hidden
      >
        <div className="animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className={cn(
                "mx-5 shrink-0 text-[10px] font-medium tracking-[0.22em]",
                t === "·" ? "text-white/20" : "text-white/35 uppercase"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div
        className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8
                   flex flex-col justify-center min-h-[calc(100svh-48px)] py-20"
        style={{ zIndex: 2 }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#52A882] opacity-55" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#52A882]" />
          </span>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
            대학생 전용 미니앱 플랫폼
          </p>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold leading-[1.04] tracking-tight text-white"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6.2rem)" }}
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
          className="mt-8 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg"
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
            className="inline-flex h-12 items-center justify-center rounded-2xl
                       bg-[#408A71] px-8 text-sm font-medium text-white
                       shadow-xl shadow-[#285A48]/30
                       transition-all hover:bg-[#52A882] hover:shadow-[#408A71]/35"
          >
            지금 시작하기
          </Link>
          <a
            href="#service"
            className="inline-flex h-12 items-center justify-center rounded-2xl
                       border border-white/[0.1] px-8 text-sm font-medium text-white/50
                       transition-all hover:border-white/20 hover:text-white/80"
          >
            서비스 알아보기
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 flex flex-wrap gap-x-12 gap-y-6"
        >
          {landingStats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(i > 0 && "border-l border-white/[0.07] pl-12")}
            >
              <p className="heading-display text-3xl font-bold text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-2"
        style={{ zIndex: 2 }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
        <p
          className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/20"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </p>
      </motion.div>
    </section>
  );
}
