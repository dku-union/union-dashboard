"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";
import { faqItems, landingNavItems } from "@/data/landing";

function Reveal({
  children, className, delay = 0,
}: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export function LandingFaqCta() {
  return (
    <>
      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <Reveal className="mb-16">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">FAQ</p>
            <h2
              className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
            >
              도입 전에
              <br />
              <span className="text-[#E83A33]">많이 묻는</span> 질문
            </h2>
          </Reveal>

          <div className="grid gap-3">
            {faqItems.map((item, i) => (
              <Reveal key={item.question} delay={i * 0.07}>
                <article className="rounded-xl border border-[#DCE4F2] bg-white p-7 shadow-sm hover:shadow-md hover:border-[#E83A33]/25 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[15px] font-semibold text-[#262725] sm:text-base">{item.question}</h3>
                    <ChevronDown className="h-4 w-4 text-[#8E908E] shrink-0 mt-0.5" />
                  </div>
                  <p className="mt-4 text-[13px] leading-6 text-[#6B6D6B] sm:text-sm sm:leading-7">{item.answer}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="relative overflow-clip bg-[#EDF2FA] pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-[#262725] px-8 py-12 sm:px-12 sm:py-16">

              {/* Decorative quarter circles */}
              <svg className="absolute top-0 right-0 w-48 h-48 opacity-[0.08]" viewBox="0 0 200 200" aria-hidden>
                <path d="M 200 0 L 200 200 A 200 200 0 0 1 0 0 Z" fill="#E83A33" />
              </svg>
              <svg className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.06]" viewBox="0 0 200 200" aria-hidden>
                <path d="M 0 200 L 0 0 A 200 200 0 0 1 200 200 Z" fill="#E83A33" />
              </svg>

              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#EF6560] mb-5">
                    Get Started
                  </p>
                  <h2
                    className="heading-display font-bold leading-[1.06] tracking-tight text-white"
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

                <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                  <Link
                    href="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#E83A33] px-5 text-sm font-medium text-white transition-all hover:bg-[#C42E29]"
                  >
                    지금 시작하기
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
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
      <footer className="relative overflow-hidden bg-white">
        {/* Geometric decorations — hidden on mobile */}
        <svg className="pointer-events-none absolute left-0 top-0 h-72 w-72 opacity-[0.5] hidden sm:block" viewBox="0 0 200 200" aria-hidden>
          <path d="M 0 0 L 0 200 A 200 200 0 0 1 200 0 Z" fill="#DCE4F2" />
        </svg>
        <svg className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 opacity-[0.5] hidden sm:block" viewBox="0 0 200 200" aria-hidden>
          <path d="M 200 200 L 200 0 A 200 200 0 0 1 0 200 Z" fill="#DCE4F2" />
        </svg>

        {/* Main footer content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
            {/* Brand column */}
            <Reveal>
              <div className="flex items-center gap-3">
                <Image src="/logo.svg" alt="Union" width={48} height={48} />
                <div>
                  <p className="heading-display text-[16px] font-bold text-[#262725]">Union</p>
                  <p className="text-[11px] text-[#8E908E]">University mini-app platform</p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-[13px] leading-6 text-[#8E908E]">
                캠퍼스 안에서 바로 검증하고 확장하는
                <br />
                대학생 전용 미니앱 플랫폼
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a href="https://github.com/dku-union" target="_blank" rel="noopener noreferrer" className="text-[#6B6D6B] transition-colors hover:text-[#E83A33]" aria-label="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                </a>
                <a href="mailto:union@dankook.ac.kr" className="text-[#6B6D6B] transition-colors hover:text-[#E83A33]" aria-label="Email">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </a>
              </div>
            </Reveal>

            {/* Product column */}
            <Reveal delay={0.05}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#262725] mb-5">Product</p>
              <ul className="space-y-3">
                {[
                  { label: "서비스 소개", href: "#service" },
                  { label: "사용 방법", href: "#how-it-works" },
                  { label: "미니앱 카탈로그", href: "#miniapps" },
                  { label: "활용 사례", href: "#use-cases" },
                ].map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-[13px] text-[#6B6D6B] transition-all duration-200 hover:text-[#262725] hover:translate-x-1 inline-block">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Resources column */}
            <Reveal delay={0.1}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#262725] mb-5">Resources</p>
              <ul className="space-y-3">
                {[
                  { label: "FAQ", href: "#faq" },
                  { label: "개발 가이드", href: "#" },
                  { label: "API 문서", href: "#" },
                  { label: "SDK 레퍼런스", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-[13px] text-[#6B6D6B] transition-all duration-200 hover:text-[#262725] hover:translate-x-1 inline-block">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Account column */}
            <Reveal delay={0.15}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#262725] mb-5">Account</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-[13px] text-[#6B6D6B] transition-all duration-200 hover:text-[#262725] hover:translate-x-1 inline-block">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-[13px] text-[#6B6D6B] transition-all duration-200 hover:text-[#262725] hover:translate-x-1 inline-block">
                    회원가입
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[13px] text-[#6B6D6B] transition-all duration-200 hover:text-[#262725] hover:translate-x-1 inline-block">
                    퍼블리셔 대시보드
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Sub-footer */}
          <div className="mt-14 flex flex-col gap-4 border-t border-[#DCE4F2] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#8E908E]">© 2025 Union. All rights reserved.</p>
            <div className="flex gap-5 text-[11px] text-[#8E908E]">
              <a href="#" className="transition-colors hover:text-[#262725]">이용약관</a>
              <a href="#" className="transition-colors hover:text-[#262725]">개인정보처리방침</a>
              <span className="text-[#6B6D6B]">단국대학교 캡스톤디자인</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
