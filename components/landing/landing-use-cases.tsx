"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCases } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";
import { Building2, Rocket, RefreshCw } from "lucide-react";

const CASE_ICONS = [Building2, Rocket, RefreshCw];

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
    <section id="use-cases" className="relative overflow-clip bg-[#E83A33] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <Reveal className="mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#EDF2FA] mb-5">
            Use Cases
          </p>
          <h2
            className="heading-display font-bold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            캠퍼스 운영에
            <br />
            <Highlight variant="onRed">바로 연결되는</Highlight> 활용 사례
          </h2>
          <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-white/70">
            학생회, 동아리, 학과, 캠퍼스 프로젝트 팀이 어떤 식으로 활용할 수 있는지
            사례 중심으로 보여줍니다.
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {useCases.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} y={20}>
              <article className="group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                {/* Visual header */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, rgba(232,58,51,${0.08 + i * 0.05}) 0%, #FFFFFF 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => {
                      const Icon = CASE_ICONS[i];
                      return (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDE8E7] shadow-sm">
                          <Icon className="h-7 w-7 text-[#E83A33]" />
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {/* Body */}
                <div className="p-6 space-y-3">
                  <div className="inline-flex items-center rounded-full bg-[#FDE8E7] px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#E83A33] uppercase">
                    Case 0{i + 1}
                  </div>
                  <h3 className="heading-display text-xl font-semibold text-[#262725]">{item.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-[#6B6D6B]">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  );
}
