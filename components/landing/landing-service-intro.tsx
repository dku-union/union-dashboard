"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { serviceHighlights } from "@/data/landing";
import { Highlight } from "@/components/ui/highlight";

const SERVICE_IMAGES = [
  "/landing/generated/svc-b-deploy.png",
  "/landing/generated/svc-a-build.png",
  "/landing/generated/svc-c-analyze.png",
] as const;

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
    <section id="service" className="relative overflow-clip bg-[#E83A33] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#EDF2FA] mb-5">
            Service
          </p>
          <h2
            className="heading-display font-bold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            Union은 캠퍼스 아이디어를
            <br />
            <Highlight variant="onRed">실제 서비스로</Highlight> 연결합니다
          </h2>
          <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-white/70">
            대학생 대상 공지, 참여, 모집, 운영 흐름을 미니앱 단위로
            빠르게 만들고 검증할 수 있습니다.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {serviceHighlights.map((item, i) => (
            <Reveal key={item.title} delay={0.05 + i * 0.1} y={20}>
              <div className="group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                {/* Isometric illustration header */}
                <div className="relative h-44 bg-[#EDF2FA]">
                  <Image
                    src={SERVICE_IMAGES[i]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                {/* Card body */}
                <div className="flex-1 p-6 pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDE8E7] text-[#E83A33] mb-4">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#262725]">{item.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-[1.6] text-[#6B6D6B]">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  );
}
