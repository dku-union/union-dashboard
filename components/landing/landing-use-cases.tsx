"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCases } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";

const CASE_FLOWS = [
  {
    target: "학생회",
    steps: ["투표·공지 등록", "참여 현황 확인", "다음 행사 개선"],
  },
  {
    target: "캠퍼스 팀",
    steps: ["서비스 버전 제출", "사용 흐름 확인", "기능 단위 개선"],
  },
  {
    target: "운영 조직",
    steps: ["흩어진 절차 정리", "미니앱으로 전환", "반복 업무 축소"],
  },
] as const;

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

export function LandingUseCases() {
  return (
    <section id="use-cases" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <Reveal className="mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
            Use Cases
          </p>
          <h2
            className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            캠퍼스 운영에
            <br />
            <Highlight>바로 연결되는</Highlight> 활용 사례
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B6D6B] sm:text-lg" style={{ wordBreak: "keep-all" }}>
            단순히 “만들 수 있는 앱”을 나열하는 대신, 각 조직이 어떤 운영 문제를
            미니앱 흐름으로 바꾸는지 보여줍니다.
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} y={20}>
              <article className="group h-full rounded-lg border border-[#DCE4F2] bg-white p-6 transition-colors duration-300 hover:border-[#C6D1E2]">
                <div className="flex items-center justify-between gap-4 border-b border-[#DCE4F2] pb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E83A33]">
                    {CASE_FLOWS[i]?.target ?? `Case 0${i + 1}`}
                  </p>
                  <div className="h-px flex-1 bg-[#DCE4F2]" />
                </div>
                <div className="pt-5">
                  <h3 className="heading-display text-xl font-semibold leading-tight text-[#262725]">{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.65] text-[#6B6D6B]">{item.description}</p>
                  <div className="mt-6 space-y-2">
                    {CASE_FLOWS[i]?.steps.map((step, stepIndex) => (
                      <div key={step} className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-md border border-[#DCE4F2] bg-[#F7FAFE] px-3 py-2.5">
                        <span className="text-[10px] font-semibold text-[#E83A33]">0{stepIndex + 1}</span>
                        <span className="text-[12px] font-medium text-[#4A4C4A]">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
