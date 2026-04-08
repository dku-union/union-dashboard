"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Highlight } from "@/components/ui/highlight";
import {
  Bell, BarChart3, Rocket, Users, Globe, Code2,
  CheckCircle, Zap,
} from "lucide-react";

function Reveal({
  children, className, delay = 0, y = 28,
}: {
  children: React.ReactNode; className?: string; delay?: number; y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`group rounded-xl border border-[#DCE4F2] bg-white shadow-sm overflow-hidden h-full hover:shadow-md hover:border-[#E83A33]/30 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

const NOTIFS = [
  { title: "동아리 모집 마감 D-1",     time: "방금 전", unread: true },
  { title: "새 공지: 학생회 투표 시작", time: "3분 전",  unread: false },
  { title: "신청이 승인되었습니다",     time: "12분 전", unread: false },
] as const;

const CHART_BARS = [35, 52, 40, 68, 55, 78, 70, 88, 82, 95, 90, 100] as const;

const UNIS = ["단국대", "연세대", "고려대", "성균관대", "한양대", "+45개"] as const;

const AVATARS = [
  { initial: "P", bg: "#E83A33" },
  { initial: "J", bg: "#2D8A4E" },
  { initial: "M", bg: "#D4860A" },
  { initial: "K", bg: "#262725" },
  { initial: "+3", bg: "#FDE8E7" },
] as const;

export function LandingFeatureBento() {
  return (
    <section id="features" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <Reveal className="mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
            Platform Features
          </p>
          <h2
            className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            퍼블리셔를 위한
            <br />
            <span className="text-[#8E908E]">
              모든 것이 <Highlight>여기에.</Highlight>
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-[#6B6D6B]">
            아이디어 기획부터 배포, 분석, 운영까지—
            Union 대시보드 하나로 전부 해결됩니다.
          </p>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

          {/* ① Notifications (7 cols) */}
          <Reveal className="sm:col-span-2 lg:col-span-7" delay={0.06} y={24}>
            <BentoCard className="p-7 sm:p-9 min-h-[280px]">
              <div className="flex flex-col sm:flex-row sm:gap-10 h-full">
                <div className="flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-xl sm:text-2xl font-bold text-[#262725]">
                    실시간 푸시 알림
                  </h3>
                  <p className="mt-2.5 text-[13px] sm:text-sm text-[#6B6D6B] leading-relaxed max-w-[260px]">
                    중요 공지와 이벤트를 구독 중인 학생에게 즉각 전달하세요.
                    열람률을 추적할 수 있습니다.
                  </p>
                  <div className="mt-5 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 rounded-full bg-[#FDE8E7] px-3 py-1.5">
                      <CheckCircle className="h-3 w-3 text-[#E83A33]" />
                      <span className="text-[11px] text-[#E83A33] font-medium">열람률 추적</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-[#EDF2FA] px-3 py-1.5">
                      <Zap className="h-3 w-3 text-[#6B6D6B]" />
                      <span className="text-[11px] text-[#6B6D6B] font-medium">즉시 발송</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0 sm:flex-1 sm:max-w-[260px]">
                  <div className="space-y-2">
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-[#EDF2FA] px-4 py-3">
                        <div className={`h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-[#E83A33]" : "bg-[#DCE4F2]"}`} />
                        <span className="text-[12px] text-[#4A4C4A] flex-1 truncate">{n.title}</span>
                        <span className="text-[11px] text-[#8E908E] shrink-0">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>

          {/* ② Analytics (5 cols) */}
          <Reveal className="lg:col-span-5" delay={0.10} y={24}>
            <BentoCard className="p-7 min-h-[280px]">
              <div className="flex flex-col h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="heading-display text-xl font-bold text-[#262725]">성장 분석 대시보드</h3>
                <p className="mt-2 text-[13px] text-[#6B6D6B] leading-relaxed">사용자 행동과 전환율을 실시간으로 추적하세요.</p>
                <div className="mt-5 flex-1 flex flex-col justify-end">
                  <div className="flex items-end gap-[3px] h-20">
                    {CHART_BARS.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: i >= 8
                            ? `rgba(232,58,51,${0.4 + (i - 8) * 0.18})`
                            : `rgba(232,58,51,${0.12 + i * 0.025})`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 h-px bg-[#DCE4F2]" />
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-[#EDF2FA] px-4 py-3">
                      <p className="text-[10px] text-[#8E908E] uppercase tracking-wide">주간 방문</p>
                      <p className="mt-1 text-xl font-bold text-[#262725]">12,840</p>
                      <p className="mt-0.5 text-[11px] text-[#E83A33]">↑ 18.4%</p>
                    </div>
                    <div className="rounded-xl bg-[#EDF2FA] px-4 py-3">
                      <p className="text-[10px] text-[#8E908E] uppercase tracking-wide">전환율</p>
                      <p className="mt-1 text-xl font-bold text-[#262725]">7.2%</p>
                      <p className="mt-0.5 text-[11px] text-[#E83A33]">↑ 2.1%</p>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>

          {/* ③ Quick Deploy (4 cols) */}
          <Reveal className="lg:col-span-4" delay={0.15} y={24}>
            <BentoCard className="p-7 min-h-[220px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-xl font-bold text-[#262725]">앱스토어 없이 배포</h3>
              <p className="mt-2 text-[13px] text-[#6B6D6B] leading-relaxed">심사 없이 즉시 모든 Union 사용자에게 배포됩니다.</p>
              <div className="mt-5">
                <p className="font-black leading-none tracking-tighter text-[#E83A33]" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>3일</p>
                <p className="mt-1.5 text-[12px] text-[#8E908E]">평균 아이디어 → 출시</p>
              </div>
            </BentoCard>
          </Reveal>

          {/* ④ Team (3 cols) */}
          <Reveal className="lg:col-span-3" delay={0.20} y={24}>
            <BentoCard className="p-7 min-h-[220px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-lg font-bold text-[#262725]">팀 협업</h3>
              <p className="mt-2 text-[13px] text-[#6B6D6B] leading-relaxed">멤버를 초대하고 역할을 나눠 함께 운영하세요.</p>
              <div className="mt-5 flex -space-x-2">
                {AVATARS.map((a, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: a.bg,
                      color: i === 4 ? "#E83A33" : "#FFFFFF",
                    }}
                  >
                    {a.initial}
                  </div>
                ))}
              </div>
            </BentoCard>
          </Reveal>

          {/* ⑤ Global Reach (5 cols) */}
          <Reveal className="lg:col-span-5" delay={0.25} y={24}>
            <BentoCard className="p-7 min-h-[220px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="heading-display text-xl font-bold text-[#262725]">전국 대학 동시 도달</h3>
              <p className="mt-2 text-[13px] text-[#6B6D6B] leading-relaxed">한 번의 배포로 50개 이상 파트너 대학 학생 전체에 전달됩니다.</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {UNIS.map((name, i) => (
                  <span
                    key={i}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      borderColor: i === 5 ? "#E83A33" : "#DCE4F2",
                      color: i === 5 ? "#E83A33" : "#6B6D6B",
                      background: i === 5 ? "#FDE8E7" : "transparent",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </BentoCard>
          </Reveal>

          {/* ⑥ Bridge SDK (12 cols) */}
          <Reveal className="sm:col-span-2 lg:col-span-12" delay={0.30} y={24}>
            <BentoCard className="p-7 sm:p-9">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-14">
                <div className="flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8E7] text-[#E83A33] mb-5">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-2xl font-bold text-[#262725]">Bridge SDK로 네이티브 기능까지</h3>
                  <p className="mt-2.5 text-sm text-[#6B6D6B] leading-relaxed max-w-md">
                    카메라, 위치, 저장소 등 iOS 네이티브 기능을 Bridge SDK를 통해 웹앱에서
                    그대로 사용하세요. React 컴포넌트처럼 간결하게 통합됩니다.
                  </p>
                </div>
                {/* Code snippet — dark inset */}
                <div className="mt-6 lg:mt-0 flex-1 max-w-lg rounded-xl bg-[#262725] p-5 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                    <span className="ml-2 text-[11px] text-white/40 font-mono">camera.ts</span>
                  </div>
                  <div className="font-mono text-[12px] leading-[1.75] overflow-x-auto">
                    <p>
                      <span className="text-[#EF6560]">import</span>
                      <span className="text-white/60">{" { union } "}</span>
                      <span className="text-[#EF6560]">from</span>
                      <span className="text-[#EF6560]">{" '@union/sdk'"}</span>
                    </p>
                    <p className="mt-3 text-white/40">{"// 카메라 접근 — 한 줄로"}</p>
                    <p>
                      <span className="text-[#EF6560]">const</span>
                      <span className="text-white/70">{" photo "}</span>
                      <span className="text-white/40">{"= "}</span>
                      <span className="text-white/55">{"await"}</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-[#EF6560]">union</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-white/70">camera</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-[#EF6560]">capture</span>
                      <span className="text-white/40">{"()"}</span>
                    </p>
                    <p className="mt-3 text-white/40">{"// 네이티브 저장소"}</p>
                    <p>
                      <span className="text-[#EF6560]">await</span>
                      <span className="text-[#EF6560]">{" union"}</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-white/70">storage</span>
                      <span className="text-white/40">{"."}</span>
                      <span className="text-[#EF6560]">set</span>
                      <span className="text-white/40">{"("}</span>
                      <span className="text-[#EF6560]">{"'key'"}</span>
                      <span className="text-white/40">{", "}</span>
                      <span className="text-[#EF6560]">{"'value'"}</span>
                      <span className="text-white/40">{")"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
