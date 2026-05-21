import { LandingFaqCta }         from "@/components/landing/landing-faq-cta";
import { LandingFeatureBento }   from "@/components/landing/landing-feature-bento";
import { LandingHeader }         from "@/components/landing/landing-header";
import { LandingHero }           from "@/components/landing/landing-hero";
import { LandingHowItWorks }     from "@/components/landing/landing-how-it-works";
import { LandingImpactStats }    from "@/components/landing/landing-impact-stats";
import { LandingMarquee }        from "@/components/landing/landing-marquee";
import { LandingMiniAppCatalog } from "@/components/landing/landing-miniapp-catalog";
import { LandingServiceIntro }   from "@/components/landing/landing-service-intro";
import { LandingUseCases }       from "@/components/landing/landing-use-cases";
import { StickySection }         from "@/components/landing/sticky-section";

export function LandingPage() {
  return (
    <div className="bg-[#EDF2FA] text-[#262725] overflow-x-clip">
      <LandingHeader />
      <main>
        <StickySection zIndex={1}><LandingHero /></StickySection>
        <StickySection zIndex={2}><LandingServiceIntro /></StickySection>
        <StickySection zIndex={3}><LandingImpactStats /></StickySection>
        <StickySection zIndex={4}><LandingMarquee /></StickySection>
        <StickySection zIndex={5}><LandingFeatureBento /></StickySection>
        <StickySection zIndex={6}><LandingMiniAppCatalog /></StickySection>
        <StickySection zIndex={7}><LandingHowItWorks /></StickySection>
        <StickySection zIndex={8}><LandingUseCases /></StickySection>
        <StickySection zIndex={9}><LandingFaqCta /></StickySection>
      </main>
    </div>
  );
}
