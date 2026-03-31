import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";

export function LandingMiniAppCatalog() {
  return (
    <LandingShell id="miniapps" className="py-24 sm:py-28">
      <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.35)] sm:p-12">
        <LandingSectionHeading
          eyebrow="Mini Apps"
          title="UniApp에서 가능해요"
          description="캠퍼스 안에서 바로 쓰이는 운영형 미니앱을 카드 형태로 소개하는 섹션을 배치합니다."
        />
      </div>
    </LandingShell>
  );
}
