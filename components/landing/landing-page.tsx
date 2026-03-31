import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingMiniAppCatalog } from "@/components/landing/landing-miniapp-catalog";
import { LandingParticleText } from "@/components/landing/landing-particle-text";
import { LandingPretextHero } from "@/components/landing/landing-pretext-hero";
import { LandingServiceIntro } from "@/components/landing/landing-service-intro";
import { LandingUseCases } from "@/components/landing/landing-use-cases";

export function LandingPage() {
  return (
    <div className="landing-page bg-[linear-gradient(180deg,#060a14_0%,#0c1734_13%,#e8f0ff_36%,#f5f8ff_100%)] text-slate-950">
      <LandingHeader />
      <main className="landing-scroll-container lg:h-[calc(100svh-var(--landing-header-height))] lg:overflow-y-auto lg:snap-y lg:snap-mandatory lg:scroll-smooth">
        <LandingPretextHero />
        <LandingParticleText />
        <LandingHero />
        <LandingServiceIntro />
        <LandingMiniAppCatalog />
        <LandingHowItWorks />
        <LandingUseCases />
        <LandingFaqCta />
      </main>
    </div>
  );
}
