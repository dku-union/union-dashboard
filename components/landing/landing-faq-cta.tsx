"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";
import { faqItems, landingNavItems } from "@/data/landing";

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingFaqCta() {
  return (
    <>
      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" className="relative overflow-hidden py-32 sm:py-40">

        {/* Left aurora */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(40,90,72,0.22) 0%, transparent 70%)",
              filter: "blur(120px)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <Reveal className="mb-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
              FAQ
            </p>
            <h2
              className="font-bold leading-[1.04] tracking-tight text-white"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              도입 전에
              <br />
              <span style={{ color: "#75BFA0" }}>많이 묻는</span> 질문
            </h2>
          </Reveal>

          {/* FAQ items */}
          <div className="grid gap-3">
            {faqItems.map((item, i) => (
              <Reveal key={item.question} delay={i * 0.07}>
                <article className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-7 hover:border-[#408A71]/25 hover:bg-[#408A71]/[0.03] transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px] font-semibold text-white/85 sm:text-base">
                      {item.question}
                    </h3>
                    <ChevronDown className="h-4 w-4 text-white/40 shrink-0 mt-0.5" />
                  </div>
                  <p className="mt-4 text-[13px] leading-6 text-white/50 sm:text-sm sm:leading-7">
                    {item.answer}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-[#408A71]/30 bg-[#0a1a10] px-8 py-12 sm:px-12 sm:py-16">

              {/* Background glow inside CTA */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 30% 50%, rgba(40,90,72,0.55) 0%, transparent 65%)",
                  filter: "blur(60px)",
                }}
              />

              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
                    Get Started
                  </p>
                  <h2
                    className="font-bold leading-[1.06] tracking-tight text-white"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}
                  >
                    Union으로
                    <br />
                    캠퍼스 아이디어를
                    <br />
                    시작하세요
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/50 sm:text-base">
                    학생에게 필요한 공지, 참여, 운영 경험을 더 빠르게 출시하고 검증할 수 있습니다.
                    지금 계정을 만들고 퍼블리셔 대시보드에서 다음 단계를 이어가세요.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.10] bg-white/[0.05] p-5 backdrop-blur-xl shadow-2xl shadow-black/30">
                  <Link
                    href="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#408A71] px-5 text-sm font-medium text-white transition-all hover:bg-[#52A882]"
                  >
                    지금 시작하기
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
                  >
                    로그인
                  </Link>
                  <a
                    href="#service"
                    className="inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-medium text-white/35 transition-all hover:text-white/60"
                  >
                    서비스 알아보기
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] bg-[#040a06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#408A71]">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <div>
                <p className="heading-display text-[14px] font-semibold text-white">Union</p>
                <p className="text-[10px] text-white/40">University mini-app launch platform</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] text-white/45">
              캠퍼스 안에서 바로 검증하고 확장하는 대학생 전용 미니앱 플랫폼
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-white/45">
            {landingNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white/60"
              >
                {item.label}
              </a>
            ))}
            <Link href="/login" className="transition-colors hover:text-white/60">
              로그인
            </Link>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="text-[11px] text-white/30">© 2025 Union. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
