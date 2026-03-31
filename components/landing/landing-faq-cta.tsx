import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LandingShell } from "@/components/landing/landing-shell";
import { faqItems } from "@/data/landing";

export function LandingFaqCta() {
  return (
    <>
      {/* FAQ */}
      <LandingShell id="faq" className="py-20 sm:py-24">
        <div className="space-y-8">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
              FAQ
            </p>
            <h2 className="mt-4 heading-display text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
              도입 전에 많이 묻는 질문
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
              출시 준비, 대상 조직, 운영 연결 방식처럼 실제 도입 전에 자주 나오는
              질문을 먼저 정리했습니다.
            </p>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            {faqItems.map((item, index) => (
              <article key={item.question} className="px-6 py-5 sm:px-8 sm:py-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-xs font-bold text-slate-300">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </LandingShell>

      {/* CTA */}
      <LandingShell className="pb-16 sm:pb-20">
        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[linear-gradient(135deg,#0a1628,#15295a_50%,#2563eb)] p-10 sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-blue-200/80">
                Get Started
              </p>
              <h2 className="mt-5 heading-display text-3xl font-bold tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
                Union으로
                <br />
                캠퍼스 아이디어를
                <br />
                시작하세요
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-blue-100/70">
                학생에게 필요한 공지, 참여, 운영 경험을 더 빠르게 출시하고 검증할
                수 있습니다. 지금 계정을 만들고 퍼블리셔 대시보드에서 다음 단계를
                이어가세요.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-slate-950 transition-all hover:bg-slate-50"
              >
                지금 시작하기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 text-[15px] font-medium text-white transition-all hover:bg-white/10"
              >
                로그인
              </Link>
              <a
                href="#service"
                className="inline-flex h-12 items-center justify-center rounded-xl px-5 text-[15px] font-medium text-blue-100/80 transition-all hover:text-white"
              >
                서비스 알아보기
              </a>
            </div>
          </div>
        </div>
      </LandingShell>

    </>
  );
}
