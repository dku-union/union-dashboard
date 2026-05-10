"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { serviceHighlights } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";

function Reveal({
  children, className, delay = 0, y = 28,
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

export function LandingServiceIntro() {
  return (
    <section id="service" className="relative overflow-clip bg-[#EDF2FA] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
            Service
          </p>
          <h2
            className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            Union은 미니앱 출시를
            <br />
            <Highlight>운영 가능한 흐름으로</Highlight> 연결합니다
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B6D6B] sm:text-lg" style={{ wordBreak: "keep-all" }}>
            <span className="block">퍼블리셔는 SDK로 개발한 미니앱을 콘솔에 업로드하고</span>
            <span className="block">QR 테스트와 심사를 거쳐 슈퍼앱 안에 배포합니다.</span>
          </p>
        </Reveal>

        {/* Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {serviceHighlights.map((item, i) => (
            <Reveal key={item.title} delay={0.05 + i * 0.1} y={20}>
              <div className="group h-full rounded-lg border border-[#DCE4F2] bg-white p-6 transition-colors duration-300 hover:border-[#C6D1E2]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F5C6C2] bg-[#FFF7F6] text-[#E83A33]">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E83A33]">
                  0{i + 1}
                </p>
                <h3 className="mt-2 text-[15px] font-semibold text-[#262725]">{item.title}</h3>
                <p className="mt-2.5 text-[13px] leading-[1.6] text-[#6B6D6B]">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-[#DCE4F2] to-transparent" />
      </div>
    </section>
  );
}
