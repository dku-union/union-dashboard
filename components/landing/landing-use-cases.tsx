import { LandingSectionHeading } from "@/components/landing/landing-section-heading";
import { LandingShell } from "@/components/landing/landing-shell";

export function LandingUseCases() {
  return (
    <LandingShell id="use-cases" className="py-24 sm:py-28">
      <LandingSectionHeading
        eyebrow="Use Cases"
        title="캠퍼스 운영에 바로 연결되는 활용 사례"
        description="학생회, 동아리, 캠퍼스 서비스 예시를 보여주는 쇼케이스 섹션을 배치합니다."
      />
    </LandingShell>
  );
}
