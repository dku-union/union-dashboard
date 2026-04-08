"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Highlight } from "@/components/ui/highlight";
import {
  Bell, BarChart3, Rocket, Users, Globe, Code2,
  CheckCircle, Zap,
} from "lucide-react";

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
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

/**
 * GlowCard — glassmorphic card with:
 * - 1px border that brightens to mint on hover
 * - radial inner-glow bloom at `glowAt` position
 * - thin top-edge highlight line
 */
function GlowCard({
  children,
  className = "",
  glowAt = "50% 0%",
}: {
  children: React.ReactNode;
  className?: string;
  glowAt?: string;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-white/[0.07]
                   bg-white/[0.025] backdrop-blur-sm overflow-hidden h-full
                   hover:border-[#75BFA0]/45 transition-all duration-500 ${className}`}
    >
      {/* Hover inner radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${glowAt}, rgba(117,191,160,0.15) 0%, transparent 60%)`,
        }}
      />
      {/* Top-edge accent line — intensifies on hover */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(117,191,160,0.55) 50%, transparent 90%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/* ── Static data ──────────────────────────────────────────────── */

const NOTIFS = [
  { title: "동아리 모집 마감 D-1",     time: "방금 전", unread: true  },
  { title: "새 공지: 학생회 투표 시작", time: "3분 전",  unread: false },
  { title: "신청이 승인되었습니다",     time: "12분 전", unread: false },
] as const;

const CHART_BARS = [35, 52, 40, 68, 55, 78, 70, 88, 82, 95, 90, 100] as const;

const UNIS = ["단국대", "연세대", "고려대", "성균관대", "한양대", "+45개"] as const;

const AVATARS = [
  { initial: "P", bg: "#285A48" },
  { initial: "J", bg: "#2D6B52" },
  { initial: "M", bg: "#347B5E" },
  { initial: "K", bg: "#3B8C6A" },
  { initial: "+3", bg: "rgba(64,138,113,0.25)" },
] as const;

/* ── Component ───────────────────────────────────────────────── */

export function LandingFeatureBento() {
  return (
    <section id="features" className="relative overflow-hidden py-32 sm:py-40">

      {/* ── Background orbs ─────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-1/4 w-[650px] h-[650px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(40,90,72,0.18) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute bottom-1/4 -left-32 w-[550px] h-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(64,138,113,0.14) 0%, transparent 68%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <Reveal className="mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52A882] mb-5">
            Platform Features
          </p>
          <h2
            className="font-black leading-[0.94] tracking-tight text-white"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
          >
            퍼블리셔를 위한
            <br />
            <span className="text-white/45">
              모든 것이 <Highlight>여기에.</Highlight>
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-white/50 max-w-lg leading-relaxed">
            아이디어 기획부터 배포, 분석, 운영까지—
            Union 대시보드 하나로 전부 해결됩니다.
          </p>
        </Reveal>

        {/*
         * ── Bento Grid ─────────────────────────────────────────
         * Desktop (lg, 12-col):
         *   Row 1 │ Hero Notifications (7) │ Analytics (5)
         *   Row 2 │ Deploy (4) │ Team (3) │ Reach (5)
         *   Row 3 │ Bridge SDK (12, full width)
         *
         * Tablet (sm, 2-col):
         *   Row 1 │ Hero Notifications (span 2)
         *   Row 2 │ Analytics │ Deploy
         *   Row 3 │ Team │ Reach
         *   Row 4 │ Bridge SDK (span 2)
         */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

          {/* ① Hero — 실시간 알림 (7 cols) ─────────────────── */}
          <Reveal className="sm:col-span-2 lg:col-span-7" delay={0.06} y={24}>
            <GlowCard className="p-7 sm:p-9 min-h-[280px]" glowAt="15% 100%">
              <div className="flex flex-col sm:flex-row sm:gap-10 h-full">

                {/* Left: copy */}
                <div className="flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-xl sm:text-2xl font-bold text-white">
                    실시간 푸시 알림
                  </h3>
                  <p className="mt-2.5 text-[13px] sm:text-sm text-white/50 leading-relaxed max-w-[260px]">
                    중요 공지와 이벤트를 구독 중인 학생에게 즉각 전달하세요.
                    열람률을 추적할 수 있습니다.
                  </p>
                  <div className="mt-5 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 rounded-full bg-[#408A71]/15 border border-[#408A71]/25 px-3 py-1.5">
                      <CheckCircle className="h-3 w-3 text-[#75BFA0]" />
                      <span className="text-[11px] text-[#75BFA0] font-medium">열람률 추적</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1.5">
                      <Zap className="h-3 w-3 text-white/40" />
                      <span className="text-[11px] text-white/40 font-medium">즉시 발송</span>
                    </div>
                  </div>
                </div>

                {/* Right: notification list mock */}
                <div className="mt-6 sm:mt-0 sm:flex-1 sm:max-w-[260px]">
                  <div className="space-y-2">
                    {NOTIFS.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.05] px-4 py-3"
                      >
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            n.unread ? "bg-[#75BFA0]" : "bg-white/15"
                          }`}
                        />
                        <span className="text-[12px] text-white/65 flex-1 truncate">
                          {n.title}
                        </span>
                        <span className="text-[11px] text-white/40 shrink-0">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </GlowCard>
          </Reveal>

          {/* ② Analytics — 성장 분석 (5 cols) ─────────────── */}
          <Reveal className="lg:col-span-5" delay={0.10} y={24}>
            <GlowCard className="p-7 min-h-[280px]" glowAt="80% 50%">
              <div className="flex flex-col h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="heading-display text-xl font-bold text-white">
                  성장 분석 대시보드
                </h3>
                <p className="mt-2 text-[13px] text-white/50 leading-relaxed">
                  사용자 행동과 전환율을 실시간으로 추적하세요.
                </p>

                {/* Mini bar chart */}
                <div className="mt-5 flex-1 flex flex-col justify-end">
                  <div className="flex items-end gap-[3px] h-20">
                    {CHART_BARS.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background:
                            i >= 8
                              ? `rgba(117,191,160,${0.35 + (i - 8) * 0.18})`
                              : `rgba(64,138,113,${0.14 + i * 0.015})`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 h-px bg-white/[0.08]" />

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                      <p className="text-[10px] text-white/45 uppercase tracking-wide">주간 방문</p>
                      <p className="mt-1 text-xl font-bold text-white">12,840</p>
                      <p className="mt-0.5 text-[11px] text-[#75BFA0]">↑ 18.4%</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] px-4 py-3">
                      <p className="text-[10px] text-white/45 uppercase tracking-wide">전환율</p>
                      <p className="mt-1 text-xl font-bold text-white">7.2%</p>
                      <p className="mt-0.5 text-[11px] text-[#75BFA0]">↑ 2.1%</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>

          {/* ③ Quick Deploy — 즉시 배포 (4 cols) ──────────── */}
          <Reveal className="lg:col-span-4" delay={0.15} y={24}>
            <GlowCard className="p-7 min-h-[220px]" glowAt="50% 110%">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-xl font-bold text-white">
                앱스토어 없이 배포
              </h3>
              <p className="mt-2 text-[13px] text-white/50 leading-relaxed">
                심사 없이 즉시 모든 Union 사용자에게 배포됩니다.
              </p>
              <div className="mt-5">
                <p
                  className="font-black leading-none tracking-tighter"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#75BFA0" }}
                >
                  3일
                </p>
                <p className="mt-1.5 text-[12px] text-white/45">평균 아이디어 → 출시</p>
              </div>
            </GlowCard>
          </Reveal>

          {/* ④ Team Collab — 팀 협업 (3 cols) ─────────────── */}
          <Reveal className="lg:col-span-3" delay={0.20} y={24}>
            <GlowCard className="p-7 min-h-[220px]" glowAt="50% 0%">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-lg font-bold text-white">팀 협업</h3>
              <p className="mt-2 text-[13px] text-white/50 leading-relaxed">
                멤버를 초대하고 역할을 나눠 함께 운영하세요.
              </p>
              <div className="mt-5 flex -space-x-2">
                {AVATARS.map((a, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-[#070d0a] flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: a.bg,
                      color: i === 4 ? "#75BFA0" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {a.initial}
                  </div>
                ))}
              </div>
            </GlowCard>
          </Reveal>

          {/* ⑤ Global Reach — 전국 도달 (5 cols) ──────────── */}
          <Reveal className="lg:col-span-5" delay={0.25} y={24}>
            <GlowCard className="p-7 min-h-[220px]" glowAt="0% 50%">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-xl font-bold text-white">
                전국 대학 동시 도달
              </h3>
              <p className="mt-2 text-[13px] text-white/50 leading-relaxed">
                한 번의 배포로 50개 이상 파트너 대학 학생 전체에 전달됩니다.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {UNIS.map((name, i) => (
                  <span
                    key={i}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      borderColor:
                        i === 5 ? "rgba(64,138,113,0.45)" : "rgba(255,255,255,0.08)",
                      color: i === 5 ? "#75BFA0" : "rgba(255,255,255,0.38)",
                      background: i === 5 ? "rgba(64,138,113,0.08)" : "transparent",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </GlowCard>
          </Reveal>

          {/* ⑥ Bridge SDK — 풀 위드스 (12 cols) ───────────── */}
          <Reveal className="sm:col-span-2 lg:col-span-12" delay={0.30} y={24}>
            <GlowCard className="p-7 sm:p-9" glowAt="60% 50%">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-14">

                {/* Text */}
                <div className="flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#408A71]/15 border border-[#408A71]/25 text-[#75BFA0] mb-5">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-2xl font-bold text-white">
                    Bridge SDK로 네이티브 기능까지
                  </h3>
                  <p className="mt-2.5 text-sm text-white/50 leading-relaxed max-w-md">
                    카메라, 위치, 저장소 등 iOS 네이티브 기능을 Bridge SDK를 통해 웹앱에서
                    그대로 사용하세요. React 컴포넌트처럼 간결하게 통합됩니다.
                  </p>
                </div>

                {/* Code snippet mock */}
                <div className="mt-6 lg:mt-0 flex-1 max-w-lg rounded-xl bg-[#040a06] border border-white/[0.06] p-5 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.1]" />
                    <span className="ml-2 text-[11px] text-white/35 font-mono">camera.ts</span>
                  </div>
                  <div className="font-mono text-[12px] leading-[1.75] overflow-x-auto">
                    <p>
                      <span className="text-[#52A882]">import</span>
                      <span className="text-white/55">{" { union } "}</span>
                      <span className="text-[#52A882]">from</span>
                      <span className="text-[#75BFA0]">{" '@union/sdk'"}</span>
                    </p>
                    <p className="mt-3 text-white/40">{"// 카메라 접근 — 한 줄로"}</p>
                    <p>
                      <span className="text-[#52A882]">const</span>
                      <span className="text-white/70">{" photo "}</span>
                      <span className="text-white/40">{"= "}</span>
                      <span className="text-white/50">{"await"}</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-[#75BFA0]">union</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-white/65">camera</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-[#52A882]">capture</span>
                      <span className="text-white/40">{"()"}</span>
                    </p>
                    <p className="mt-3 text-white/40">{"// 네이티브 저장소"}</p>
                    <p>
                      <span className="text-[#52A882]">await</span>
                      <span className="text-[#75BFA0]">{" union"}</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-white/65">storage</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-[#52A882]">set</span>
                      <span className="text-white/40">{"("}</span>
                      <span className="text-[#75BFA0]">{"'key'"}</span>
                      <span className="text-white/40">{", "}</span>
                      <span className="text-[#75BFA0]">{"'value'"}</span>
                      <span className="text-white/40">{")"}</span>
                    </p>
                  </div>
                </div>

              </div>
            </GlowCard>
          </Reveal>

        </div>

        {/* Section divider */}
        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </section>
  );
}
