import { LandingCanvas }        from "@/components/landing/landing-canvas";
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

/*
 * Layout Architecture
 * ───────────────────────────────────────────────────────────────
 *  z: -1  │  <LandingCanvas>  — fixed, full-viewport sphere
 *  z:  1  │  <SolidSection>   — bg:#070d0a, covers canvas
 *  z:  0  │  <RevealGap>      — transparent, canvas visible
 * ───────────────────────────────────────────────────────────────
 * SolidSection box-shadow bleeds 80px into adjacent gaps → fog edge
 * RevealGap 35vh → sphere emerges between sections as user scrolls
 */

/** Content section that hides the canvas — box-shadow creates fog edge */
function SolidSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position:        "relative",
        zIndex:          1,
        backgroundColor: "#070d0a",
        boxShadow:       "0 -80px 80px 0 #070d0a, 0 80px 80px 0 #070d0a",
      }}
    >
      {children}
    </div>
  );
}

/** Transparent gap — the fixed canvas sphere is visible here */
function RevealGap() {
  return (
    <div
      style={{
        height:   "35vh",
        position: "relative",
        zIndex:   0,
      }}
    />
  );
}

export function LandingPage() {
  return (
    <div className="text-white">

      {/*
       * ── z-layer stack ────────────────────────────────────────
       *  z: -2  │  Backdrop — dark page background (position:fixed)
       *  z: -1  │  LandingCanvas — sphere (position:fixed)
       *  z:  ①  │  non-positioned block (content wrapper, transparent)
       *            ↳ RevealGap     → transparent → canvas visible
       *            ↳ SolidSection  → bg:#070d0a, z:1 → canvas hidden
       *  z: 50  │  Header
       * ─────────────────────────────────────────────────────── */}

      {/* Dark page backdrop — BEHIND canvas */}
      <div
        style={{
          position:        "fixed",
          inset:           0,
          backgroundColor: "#070d0a",
          zIndex:          -2,
        }}
        aria-hidden
      />

      {/* ── Global fixed canvas (sphere) ─────────────────── */}
      <LandingCanvas />

      {/* ── Sticky header ────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 50 }}>
        <LandingHeader />
      </div>

      <main>
        {/*
         * Hero: transparent section — canvas sphere visible on right.
         * Left-side gradient overlay inside hero ensures text legibility.
         */}
        <LandingHero />

        {/* ── Sphere reveal #1 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingServiceIntro />
        </SolidSection>

        {/* ── Sphere reveal #2 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingImpactStats />
        </SolidSection>

        {/* ── Sphere reveal #3 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingMarquee />
        </SolidSection>

        {/* ── Sphere reveal #3b ────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingFeatureBento />
        </SolidSection>

        {/* ── Sphere reveal #4 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingMiniAppCatalog />
        </SolidSection>

        {/* ── Sphere reveal #5 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingHowItWorks />
        </SolidSection>

        {/* ── Sphere reveal #6 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingUseCases />
        </SolidSection>

        {/* ── Sphere reveal #7 ─────────────────────────── */}
        <RevealGap />

        <SolidSection>
          <LandingFaqCta />
        </SolidSection>
      </main>
    </div>
  );
}
