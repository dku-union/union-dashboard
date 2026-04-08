"use client";

/* ─────────────────────────────────────────────────────────────
 * LandingMarquee — "Intersecting Ribbons"
 *
 * Two diagonal ticker ribbons crossing in an X-shape:
 *   Ribbon A — mint fill, -8 deg, scrolls left
 *   Ribbon B — transparent / outlined, +8 deg, scrolls right
 * ───────────────────────────────────────────────────────────── */

const RIBBON_A: string[] = [
  "CONNECT EVERYTHING",
  "CAMPUS LIFE REIMAGINED",
  "BUILD TOGETHER",
  "ONE PLATFORM",
  "INFINITE POSSIBILITIES",
];

const RIBBON_B: string[] = [
  "OPEN CAMPUS",
  "STUDENT POWER",
  "EVERY MOMENT",
  "YOUR UNION",
  "BEYOND LIMITS",
];

/* Duplicate 3× so the seamless-loop never shows a gap */
const A = [...RIBBON_A, ...RIBBON_A, ...RIBBON_A];
const B = [...RIBBON_B, ...RIBBON_B, ...RIBBON_B];

/* ── Shared text / separator styles ─────────────────────── */
const BASE_SPAN: React.CSSProperties = {
  display:       "inline-flex",
  alignItems:    "center",
  gap:           "24px",
  margin:        "0 36px",
  fontSize:      "clamp(1.75rem, 3vw, 3rem)",
  fontWeight:    900,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  lineHeight:    1,
  fontFamily:    "var(--font-display)",
  userSelect:    "none",
};

/* ── Individual ribbon strip ─────────────────────────────── */
interface RibbonProps {
  items:          string[];
  top:            string;
  rotateDeg:      number;
  animClass:      "animate-marquee-left" | "animate-marquee-right";
  ribbonBg:       string;
  ribbonBorder?:  string;
  textColor:      string;
  textStroke?:    string;
  separatorColor: string;
  zIndex:         number;
}

function Ribbon({
  items,
  top,
  rotateDeg,
  animClass,
  ribbonBg,
  ribbonBorder,
  textColor,
  textStroke,
  separatorColor,
  zIndex,
}: RibbonProps) {
  return (
    <div
      style={{
        position:  "absolute",
        top,
        left:      "-50%",
        width:     "200%",
        transform: `translateY(-50%) rotate(${rotateDeg}deg)`,
        zIndex,
      }}
    >
      <div
        style={{
          backgroundColor: ribbonBg,
          borderTop:       ribbonBorder,
          borderBottom:    ribbonBorder,
          padding:         "20px 0",
          overflow:        "hidden",
        }}
      >
        <div
          className={animClass}
          style={{ display: "flex", whiteSpace: "nowrap" }}
        >
          {items.map((text, i) => (
            <span
              key={i}
              style={{
                ...BASE_SPAN,
                color:             textColor,
                WebkitTextStroke:  textStroke ?? "0",
              }}
            >
              {text}
              {/* decorative four-point star separator */}
              <span
                style={{
                  color:            separatorColor,
                  WebkitTextStroke: "0",
                  fontSize:         "1rem",
                  lineHeight:       1,
                }}
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────── */
export function LandingMarquee() {
  return (
    <section
      aria-hidden
      style={{
        position:        "relative",
        height:          "440px",
        backgroundColor: "#070d0a",
        overflow:        "hidden",
      }}
    >
      {/* ── Ribbon A — mint, tilted left, scrolls left ────── */}
      <Ribbon
        items={A}
        top="40%"
        rotateDeg={-8}
        animClass="animate-marquee-left"
        ribbonBg="#75BFA0"
        textColor="#070d0a"
        separatorColor="#285A48"
        zIndex={10}
      />

      {/* ── Ribbon B — outlined, tilted right, scrolls right  */}
      <Ribbon
        items={B}
        top="60%"
        rotateDeg={8}
        animClass="animate-marquee-right"
        ribbonBg="transparent"
        ribbonBorder="1.5px solid #408A71"
        textColor="transparent"
        textStroke="1.5px #52A882"
        separatorColor="#408A71"
        zIndex={0}
      />
    </section>
  );
}
