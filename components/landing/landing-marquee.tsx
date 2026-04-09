"use client";

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

const A = [...RIBBON_A, ...RIBBON_A, ...RIBBON_A];
const B = [...RIBBON_B, ...RIBBON_B, ...RIBBON_B];

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
  items, top, rotateDeg, animClass, ribbonBg, ribbonBorder,
  textColor, textStroke, separatorColor, zIndex,
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
                color:            textColor,
                WebkitTextStroke: textStroke ?? "0",
              }}
            >
              {text}
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

export function LandingMarquee() {
  return (
    <section
      aria-hidden
      style={{
        position:        "relative",
        height:          "420px",
        backgroundColor: "#E83A33",
        overflow:        "hidden",
      }}
    >
      {/* Ribbon A — Charcoal fill, white text */}
      <Ribbon
        items={A}
        top="40%"
        rotateDeg={-4}
        animClass="animate-marquee-left"
        ribbonBg="#262725"
        textColor="#FFFFFF"
        separatorColor="#EDF2FA"
        zIndex={10}
      />

      {/* Ribbon B — transparent, white stroke text */}
      <Ribbon
        items={B}
        top="60%"
        rotateDeg={4}
        animClass="animate-marquee-right"
        ribbonBg="transparent"
        ribbonBorder="1.5px solid #EDF2FA"
        textColor="transparent"
        textStroke="1.5px #EDF2FA"
        separatorColor="#EDF2FA"
        zIndex={0}
      />
    </section>
  );
}
