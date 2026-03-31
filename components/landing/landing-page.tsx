import { LandingFaqCta } from "@/components/landing/landing-faq-cta";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingMiniAppCatalog } from "@/components/landing/landing-miniapp-catalog";
import { LandingServiceIntro } from "@/components/landing/landing-service-intro";
import { LandingUseCases } from "@/components/landing/landing-use-cases";

export function LandingPage() {
  return (
    <div className="landing-page bg-[linear-gradient(180deg,#071127_0%,#0c1734_14%,#edf3ff_38%,#f7faff_100%)] text-slate-950">
      <LandingHeader />
      <main className="landing-scroll-container lg:h-[calc(100svh-var(--landing-header-height))] lg:overflow-y-auto lg:snap-y lg:snap-mandatory lg:scroll-smooth">
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
