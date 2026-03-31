"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════
   Physics constants
   ═══════════════════════════════════════════ */
const TRAIL_MAX = 20;
const REPULSION_RADIUS = 150;
const REPULSION_FORCE = 55;
const SPRING = 0.055;
const DAMPING = 0.82;
const TRAIL_DECAY = 0.9;
const LINE_HEIGHT_FACTOR = 1.12;

const DISPLAY_LINES = ["UNION", "슈퍼앱", "플랫폼"];
const DISPLAY_TEXT = DISPLAY_LINES.join("\n");

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface CharData {
  char: string;
  ox: number;
  oy: number;
  w: number;
  line: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
export function LandingPretextHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charsRef = useRef<CharData[]>([]);
  const physicsRef = useRef<{ dx: number; dy: number; vx: number; vy: number }[]>([]);
  const nodesRef = useRef<HTMLSpanElement[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef(0);
  const fontSizeRef = useRef(100);
  const reducedMotionRef = useRef(false);

  const [chars, setChars] = useState<CharData[]>([]);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  /* ─── Measure text layout using pretext ─── */
  useEffect(() => {
    let cancelled = false;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const measure = async () => {
      const root = rootRef.current;
      if (!root || cancelled) return;

      // Dynamic import — avoids SSR canvas crash
      const { prepareWithSegments, layoutWithLines } = await import(
        "@chenglou/pretext"
      );
      if (cancelled) return;

      const { width: cw, height: ch } = root.getBoundingClientRect();
      const padX = Math.max(cw * 0.07, 24);
      const maxW = cw - padX * 2;
      const family =
        "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif";

      // Binary-search for the largest font size that fits
      const offscreen = document.createElement("canvas");
      const ctx = offscreen.getContext("2d")!;
      let lo = 28;
      let hi = Math.min(cw * 0.22, 260);

      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        ctx.font = `800 ${mid}px ${family}`;
        const widest = Math.max(
          ...DISPLAY_LINES.map((l) => ctx.measureText(l).width),
        );
        if (widest <= maxW) lo = mid;
        else hi = mid;
      }

      const fs = lo;
      fontSizeRef.current = fs;
      const font = `800 ${fs}px ${family}`;
      const lh = fs * LINE_HEIGHT_FACTOR;

      // pretext handles Unicode segmentation, bidi, and line-breaking
      const prepared = prepareWithSegments(DISPLAY_TEXT, font, {
        whiteSpace: "pre-wrap",
      });
      const { lines } = layoutWithLines(prepared, maxW, lh);

      // Build per-character positions
      ctx.font = font;
      const totalH = lines.length * lh;
      const baseY = (ch - totalH) / 2;
      const result: CharData[] = [];

      for (let li = 0; li < lines.length; li++) {
        const text = lines[li].text.replace(/\n$/, "");
        if (!text) continue;

        const lineW = ctx.measureText(text).width;
        let x = (cw - lineW) / 2;
        const y = baseY + li * lh;

        for (const g of [...text]) {
          if (g === " ") {
            x += ctx.measureText(" ").width;
            continue;
          }
          const gw = ctx.measureText(g).width;
          result.push({ char: g, ox: x, oy: y, w: gw, line: li });
          x += gw;
        }
      }

      if (cancelled) return;

      charsRef.current = result;
      physicsRef.current = result.map(() => ({
        dx: reducedMotionRef.current ? 0 : (Math.random() - 0.5) * 30,
        dy: reducedMotionRef.current ? 0 : 18 + Math.random() * 22,
        vx: 0,
        vy: 0,
      }));
      nodesRef.current = [];

      setChars(result);
      setReady(true);
      requestAnimationFrame(() => setTimeout(() => setEntered(true), 60));
    };

    document.fonts.ready.then(measure);

    const ro = new ResizeObserver(() => {
      setReady(false);
      setEntered(false);
      document.fonts.ready.then(measure);
    });
    if (rootRef.current) ro.observe(rootRef.current);

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  /* ─── Canvas DPI sync ─── */
  useEffect(() => {
    const sync = () => {
      const c = canvasRef.current;
      const r = rootRef.current;
      if (!c || !r) return;
      const { width, height } = r.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = width * dpr;
      c.height = height * dpr;
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  /* ─── Pointer helpers ─── */
  const pushTrail = useCallback((x: number, y: number) => {
    const trail = trailRef.current;
    trail.unshift({ x, y, alpha: 1 });
    if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const r = rootRef.current?.getBoundingClientRect();
      if (!r) return;
      pushTrail(e.clientX - r.left, e.clientY - r.top);
    },
    [pushTrail],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const r = rootRef.current?.getBoundingClientRect();
      const t = e.touches[0];
      if (!r || !t) return;
      pushTrail(t.clientX - r.left, t.clientY - r.top);
    },
    [pushTrail],
  );

  /* ─── Physics loop ─── */
  useEffect(() => {
    if (!ready || reducedMotionRef.current) return;

    const tick = () => {
      const data = charsRef.current;
      const phys = physicsRef.current;
      const trail = trailRef.current;
      const nodes = nodesRef.current;
      const fs = fontSizeRef.current;

      // Decay trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha *= TRAIL_DECAY;
        if (trail[i].alpha < 0.005) trail.splice(i, 1);
      }

      // Update each character
      for (let i = 0; i < data.length; i++) {
        const c = data[i];
        const p = phys[i];
        let fx = 0;
        let fy = 0;

        for (const t of trail) {
          const cx = c.ox + c.w * 0.5 + p.dx;
          const cy = c.oy + fs * 0.5 + p.dy;
          const ddx = cx - t.x;
          const ddy = cy - t.y;
          const d2 = ddx * ddx + ddy * ddy;
          const r2 = REPULSION_RADIUS * REPULSION_RADIUS;

          if (d2 < r2 && d2 > 1) {
            const d = Math.sqrt(d2);
            const strength =
              (1 - d / REPULSION_RADIUS) * REPULSION_FORCE * t.alpha;
            fx += (ddx / d) * strength;
            fy += (ddy / d) * strength;
          }
        }

        // Spring back
        fx -= p.dx * SPRING;
        fy -= p.dy * SPRING;

        p.vx = (p.vx + fx) * DAMPING;
        p.vy = (p.vy + fy) * DAMPING;
        p.dx += p.vx;
        p.dy += p.vy;

        // Direct DOM update (skip React re-renders)
        const el = nodes[i];
        if (el) {
          el.style.transform = `translate3d(${p.dx}px,${p.dy}px,0)`;
        }
      }

      // Draw trail on canvas
      const cvs = canvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        // Glow orbs
        for (let i = 0; i < trail.length; i++) {
          const t = trail[i];
          const r = 5 + (1 - i / TRAIL_MAX) * 22;
          const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
          grad.addColorStop(0, `rgba(96,165,250,${t.alpha * 0.6})`);
          grad.addColorStop(0.45, `rgba(59,130,246,${t.alpha * 0.2})`);
          grad.addColorStop(1, "rgba(59,130,246,0)");
          ctx.beginPath();
          ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Connecting line
        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let j = 1; j < trail.length; j++) {
            ctx.lineTo(trail[j].x, trail[j].y);
          }
          ctx.strokeStyle = `rgba(96,165,250,${(trail[0]?.alpha ?? 0) * 0.1})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  return (
    <section
      ref={rootRef}
      id="pretext-hero"
      className="landing-pretext-section relative w-full overflow-hidden lg:snap-start lg:min-h-[calc(100svh-var(--landing-header-height))] lg:scroll-mt-[var(--landing-header-height)]"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{ cursor: "none" }}
    >
      {/* Accessible text for screen readers */}
      <h2 className="sr-only">{DISPLAY_LINES.join(" ")}</h2>

      {/* Grid background */}
      <div className="landing-pretext-grid absolute inset-0" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Characters */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {ready &&
          chars.map((c, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) nodesRef.current[i] = el;
              }}
              className="absolute will-change-transform select-none"
              style={{
                left: c.ox,
                top: c.oy,
                fontSize: fontSizeRef.current,
                fontWeight: 800,
                fontFamily:
                  "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif",
                lineHeight: 1,
                color:
                  c.line === 0
                    ? "rgba(96,165,250,0.9)"
                    : "rgba(226,232,240,0.85)",
                opacity: entered ? 1 : 0,
                transition: `opacity 0.6s ease-out ${i * 0.03}s`,
              }}
            >
              {c.char}
            </span>
          ))}
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, #06090f 100%)",
        }}
      />

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
        style={{
          opacity: entered ? 0.4 : 0,
          transition: "opacity 1.2s ease-out 1.5s",
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500">
          Scroll
        </span>
        <svg
          className="w-4 h-4 text-slate-500 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
