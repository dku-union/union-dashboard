import Image from "next/image";
import Link from "next/link";

import { landingStats } from "@/data/landing";
import { LandingShell } from "@/components/landing/landing-shell";

export function LandingHero() {
  return (
    <section className="landing-hero relative overflow-hidden">
      <div className="landing-hero__aurora" />
      <LandingShell className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            대학생 전용 미니앱 플랫폼
          </div>
          <h1 className="heading-display max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-[6.5rem]">
            내 아이디어가
            <span className="block bg-linear-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              200,000명의
            </span>
            대학생에게 닿는 방법
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-2xl">
            Union에서 미니앱을 출시하고,
            <br />
            전국 대학생들에게 내 서비스를 선보이세요.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5B8CFF,#4776F3)] px-8 text-base font-medium text-white shadow-xl shadow-blue-950/35 transition-all hover:opacity-95"
            >
              지금 시작하기
            </Link>
            <a
              href="#service"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-8 text-base font-medium text-white transition-all hover:bg-white/12 hover:text-white"
            >
              서비스 알아보기
            </a>
          </div>

          <div className="mt-14 grid w-full max-w-4xl gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:grid-cols-3">
            {landingStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-white/8 bg-slate-950/25 px-6 py-7">
                <div className="heading-display text-4xl font-semibold text-white">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 p-3 shadow-2xl shadow-slate-950/40">
            <div className="rounded-[1.4rem] border border-white/8 bg-slate-950/30 p-3">
              <Image
                src="/landing/hero-preview.png"
                alt="Union landing page preview"
                width={1180}
                height={664}
                className="h-auto w-full rounded-[1rem] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </LandingShell>
    </section>
  );
}
