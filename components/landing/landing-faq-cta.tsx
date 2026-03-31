import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";

export function LandingFaqCta() {
  return (
    <LandingShell id="faq" className="py-24 sm:py-28">
      <LandingSectionHeading
        eyebrow="FAQ"
        title="도입 전에 많이 묻는 질문"
        description="FAQ와 마지막 전환 CTA를 함께 배치하는 섹션입니다."
      />
    </LandingShell>
  );
}
