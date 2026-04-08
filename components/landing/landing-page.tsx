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

export function LandingPage() {
  return (
    <div className="bg-[#EDF2FA] text-[#262725] overflow-x-clip">
      <LandingHeader />
      <main>
        <div className="sticky top-0 z-[1]"><LandingHero /></div>
        <div className="sticky top-0 z-[2]"><LandingServiceIntro /></div>
        <div className="sticky top-0 z-[3]"><LandingImpactStats /></div>
        <div className="sticky top-0 z-[4]"><LandingMarquee /></div>
        <div className="sticky top-0 z-[5]"><LandingFeatureBento /></div>
        <div className="sticky top-0 z-[6]"><LandingMiniAppCatalog /></div>
        <div className="sticky top-0 z-[7]"><LandingHowItWorks /></div>
        <div className="sticky top-0 z-[8]"><LandingUseCases /></div>
        <div className="sticky top-0 z-[9]"><LandingFaqCta /></div>
      </main>
    </div>
  );
}
