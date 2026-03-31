import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";

export function LandingHowItWorks() {
  return (
    <LandingShell id="how-it-works" className="py-24 sm:py-28">
      <LandingSectionHeading
        eyebrow="How It Works"
        title={
          <>
            아이디어만 있으면
            <br />
            바로 출시할 수 있어요
          </>
        }
        description="기존 앱스토어 절차보다 가볍고 빠른 운영 흐름을 소개하는 섹션을 배치합니다."
      />
    </LandingShell>
  );
}
