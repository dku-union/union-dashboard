"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

function Reveal({
  children, className, delay = 0, y = 32,
}: {
  children: React.ReactNode; className?: string; delay?: number; y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

const RELEASE_FLOW = [
  {
    num: "01",
    label: "워크스페이스 정리",
    sub: "팀, 멤버, 앱 소유권을 먼저 확정합니다.",
    outcome: "운영 주체 확정",
  },
  {
    num: "02",
    label: "빌드 업로드",
    sub: ".unionapp 파일과 버전 메모를 제출합니다.",
    outcome: "심사 가능한 버전 생성",
  },
  {
    num: "03",
    label: "QR 테스트·심사",
    sub: "실기기 테스트 후 리뷰를 요청하고 피드백을 확인합니다.",
    outcome: "출시 전 검증",
  },
  {
    num: "04",
    label: "승인 후 배포",
    sub: "승인된 버전을 슈퍼앱에 배포하고 다음 버전을 관리합니다.",
    outcome: "사용자 공개",
  },
] as const;

export function LandingImpactStats() {
  return (
    <section id="impact" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
            Impact
          </p>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:items-center">
          {/* Left: headline */}
          <div>
            <Reveal delay={0.06} y={50}>
              <h2
                className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", wordBreak: "keep-all" }}
              >
                퍼블리셔가 따라가는
                <br />
                <span className="text-[#E83A33]">출시 운영 흐름</span>
              </h2>
            </Reveal>
            <Reveal delay={0.18} y={20}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6B6D6B] sm:text-lg" style={{ wordBreak: "keep-all" }}>
                퍼블리셔가 어디서 시작하고, 어느 시점에 테스트·심사를 거치며,
                어떤 버전이 실제로 배포되는지 한 흐름으로 보여줍니다.
              </p>
            </Reveal>
          </div>

          {/* Right: release timeline */}
          <div className="rounded-lg border border-[#DCE4F2] bg-white p-3 sm:p-4">
            {RELEASE_FLOW.map((stat, i) => (
              <Reveal key={stat.label} delay={0.20 + i * 0.10} y={20}>
                <div className="grid gap-4 border-b border-[#E8EEF7] px-3 py-5 last:border-b-0 sm:grid-cols-[64px_1fr_150px] sm:items-center sm:px-4">
                  <div>
                    <p className="text-[12px] font-semibold tracking-[0.18em] text-[#E83A33]">{stat.num}</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#262725]">{stat.label}</p>
                    <p className="mt-1 text-[13px] leading-6 text-[#6B6D6B]">{stat.sub}</p>
                  </div>
                  <div className="rounded-md border border-[#DCE4F2] bg-[#F7FAFE] px-3 py-2 text-[12px] font-medium text-[#4A4C4A]">
                    {stat.outcome}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
