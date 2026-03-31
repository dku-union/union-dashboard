"use client";

import { useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const PARTICLE_COUNT = 3500;
const TEXT_LINES = ["아이디어를", "현실로"];
const CONVERGE_MS = 2400;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 12;

/** 6-color palette: blue, cyan, violet, rose, white, mint */
const PALETTE: [number, number, number][] = [
  [96, 165, 250],   // blue
  [34, 211, 238],   // cyan
  [167, 139, 250],  // violet
  [251, 113, 133],  // rose
  [240, 240, 255],  // white-ish
  [52, 211, 153],   // mint
];

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface Particle {
  x: number;
  y: number;
  /** target — normalised 0-1 */
  tx: number;
  ty: number;
  /** random origin — normalised 0-1 */
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  isText: boolean;
  /** convergence stagger 0-1 */
  delay: number;
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
export function LandingParticleText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const visibleRef = useRef(false);
  const t0Ref = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const subtitleRef = useRef<HTMLDivElement>(null);
  const subtitleDone = useRef(false);

  /* ─── Bootstrap ─── */
  useEffect(() => {
    let ver = 0;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const boot = async (v: number) => {
      const { prepareWithSegments, layoutWithLines } = await import(
        "@chenglou/pretext"
      );
      if (v !== ver) return;

      const { width: cw, height: ch } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;

      const family =
        "'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif";
      const maxW = cw * 0.7;

      /* ── font size via binary search ── */
      const off = document.createElement("canvas");
      const oc = off.getContext("2d")!;
      let lo = 24;
      let hi = Math.min(cw * 0.16, 180);
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        oc.font = `800 ${mid}px ${family}`;
        const widest = Math.max(
          ...TEXT_LINES.map((l) => oc.measureText(l).width),
        );
        if (widest <= maxW) lo = mid;
        else hi = mid;
      }

      const fs = lo;
      const font = `800 ${fs}px ${family}`;
      const lh = fs * 1.15;

      /* ── pretext layout ── */
      const prepared = prepareWithSegments(TEXT_LINES.join("\n"), font, {
        whiteSpace: "pre-wrap",
      });
      const { lines } = layoutWithLines(prepared, maxW, lh);

      /* ── pixel sampling ── */
      const totalH = lines.length * lh;
      off.width = Math.ceil(cw);
      off.height = Math.ceil(ch);
      oc.clearRect(0, 0, off.width, off.height);
      oc.font = font;
      oc.fillStyle = "#fff";
      oc.textBaseline = "top";
      const baseY = (ch - totalH) / 2 - ch * 0.05;

      for (let li = 0; li < lines.length; li++) {
        const text = lines[li].text.replace(/\n$/, "");
        if (!text) continue;
        const lineW = oc.measureText(text).width;
        oc.fillText(text, (cw - lineW) / 2, baseY + li * lh);
      }

      const img = oc.getImageData(0, 0, off.width, off.height);
      const pts: { x: number; y: number }[] = [];
      const step = Math.max(1, Math.round(fs / 55));

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (img.data[(y * off.width + x) * 4 + 3] > 128) {
            pts.push({ x: x / cw, y: y / ch });
          }
        }
      }

      // shuffle
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }

      if (v !== ver) return;

      /* ── build particles ── */
      const textN = Math.min(pts.length, Math.floor(PARTICLE_COUNT * 0.88));
      const ambientN = PARTICLE_COUNT - textN;
      const all: Particle[] = [];

      for (let i = 0; i < textN; i++) {
        const pos = pts[i % pts.length];
        const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        all.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          tx: pos.x,
          ty: pos.y,
          sx: Math.random(),
          sy: Math.random(),
          vx: 0,
          vy: 0,
          size: 1.8 + Math.random() * 2,
          r,
          g,
          b,
          alpha: 0.85 + Math.random() * 0.15,
          isText: true,
          delay: Math.random() * 0.35,
        });
      }

      for (let i = 0; i < ambientN; i++) {
        const x = Math.random() * cw;
        const y = Math.random() * ch;
        const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        all.push({
          x,
          y,
          tx: 0,
          ty: 0,
          sx: 0,
          sy: 0,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 0.6 + Math.random() * 1.2,
          r,
          g,
          b,
          alpha: 0.15 + Math.random() * 0.25,
          isText: false,
          delay: 0,
        });
      }

      particlesRef.current = all;

      /* ── reduced motion → static frame ── */
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        const ctx2 = canvas.getContext("2d")!;
        ctx2.save();
        ctx2.scale(dpr, dpr);
        // glow pass
        for (const p of all) {
          if (!p.isText) continue;
          ctx2.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha * 0.08})`;
          ctx2.beginPath();
          ctx2.arc(p.tx * cw, p.ty * ch, p.size * 1.8, 0, Math.PI * 2);
          ctx2.fill();
        }
        // core pass
        for (const p of all) {
          if (!p.isText) continue;
          const half = p.size * 0.5;
          const br = p.size * 0.3;
          ctx2.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
          ctx2.beginPath();
          ctx2.roundRect(p.tx * cw - half, p.ty * ch - half, p.size, p.size, br);
          ctx2.fill();
        }
        ctx2.restore();
        if (subtitleRef.current) {
          subtitleRef.current.style.opacity = "1";
          subtitleRef.current.style.transform = "translateX(-50%) translateY(0)";
          subtitleRef.current.style.transition = "none";
        }
        return;
      }

      /* ── animation loop ── */
      const tick = () => {
        if (v !== ver) return;
        const cvs = canvasRef.current;
        if (!cvs) {
          requestAnimationFrame(tick);
          return;
        }

        const ctx = cvs.getContext("2d")!;
        const dp = window.devicePixelRatio || 1;
        const w = cvs.width / dp;
        const h = cvs.height / dp;
        const now = performance.now();
        const elapsed = visibleRef.current ? now - t0Ref.current : 0;
        const mouse = mouseRef.current;

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.save();
        ctx.scale(dp, dp);

        // ── 1) update positions ──
        for (let i = 0; i < all.length; i++) {
          const p = all[i];

          if (p.isText) {
            const dMs = p.delay * CONVERGE_MS;
            const raw = Math.max(
              0,
              Math.min(1, (elapsed - dMs) / (CONVERGE_MS * 0.6)),
            );
            const ease = easeOutExpo(raw);

            const shimX = Math.sin(now * 0.0008 + i * 0.5) * 1.5 * ease;
            const shimY = Math.cos(now * 0.001 + i * 0.7) * 1.2 * ease;

            let gx = (p.sx + (p.tx - p.sx) * ease) * w + shimX;
            let gy = (p.sy + (p.ty - p.sy) * ease) * h + shimY;

            if (ease > 0.4) {
              const dx = gx - mouse.x;
              const dy = gy - mouse.y;
              const d2 = dx * dx + dy * dy;
              const r2 = MOUSE_RADIUS * MOUSE_RADIUS;
              if (d2 < r2 && d2 > 1) {
                const d = Math.sqrt(d2);
                const f = (1 - d / MOUSE_RADIUS) * MOUSE_FORCE * ease;
                gx += (dx / d) * f;
                gy += (dy / d) * f;
              }
            }

            p.vx += (gx - p.x) * 0.1;
            p.vy += (gy - p.y) * 0.1;
            p.vx *= 0.84;
            p.vy *= 0.84;
            p.x += p.vx;
            p.y += p.vy;
            // stash eased alpha for draw passes
            (p as Particle & { _a: number })._a =
              p.alpha * Math.min(1, ease * 2.5);
          } else {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;
            (p as Particle & { _a: number })._a = p.alpha;
          }
        }

        // ── 2) glow pass (subtle) ──
        for (let i = 0; i < all.length; i++) {
          const p = all[i] as Particle & { _a: number };
          if (!p.isText) continue;
          const gr = p.size * 1.8;
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p._a * 0.08})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
          ctx.fill();
        }

        // ── 3) core pass (rounded rects) ──
        for (let i = 0; i < all.length; i++) {
          const p = all[i] as Particle & { _a: number };
          const s = p.isText
            ? p.size
            : p.size * (0.8 + 0.2 * Math.sin(now * 0.002 + i));
          const half = s * 0.5;
          const br = s * 0.3; // border-radius ≈ 30%
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p._a})`;
          ctx.beginPath();
          ctx.roundRect(p.x - half, p.y - half, s, s, br);
          ctx.fill();
        }

        ctx.restore();

        // reveal subtitle after convergence
        if (
          elapsed > CONVERGE_MS * 0.75 &&
          !subtitleDone.current &&
          subtitleRef.current
        ) {
          subtitleDone.current = true;
          subtitleRef.current.style.opacity = "1";
          subtitleRef.current.style.transform =
            "translateX(-50%) translateY(0)";
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    /* ── observers ── */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visibleRef.current) {
          visibleRef.current = true;
          t0Ref.current = performance.now();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(container);

    document.fonts.ready.then(() => boot(ver));

    const ro = new ResizeObserver(() => {
      ver++;
      subtitleDone.current = false;
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = "0";
        subtitleRef.current.style.transform =
          "translateX(-50%) translateY(12px)";
      }
      if (visibleRef.current) {
        t0Ref.current = performance.now() - CONVERGE_MS * 2;
      }
      document.fonts.ready.then(() => boot(ver));
    });
    ro.observe(container);

    return () => {
      ver++;
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  /* ─── Pointer handlers ─── */
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  const onTouch = useCallback((e: React.TouchEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    const t = e.touches[0];
    if (!r || !t) return;
    mouseRef.current = { x: t.clientX - r.left, y: t.clientY - r.top };
  }, []);

  /* ─── Render ─── */
  return (
    <section
      ref={containerRef}
      className="landing-particle-section relative w-full overflow-hidden lg:snap-start lg:min-h-[calc(100svh-var(--landing-header-height))] lg:scroll-mt-[var(--landing-header-height)]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onTouch}
    >
      <h2 className="sr-only">{TEXT_LINES.join(" ")}</h2>

      {/* Dot grid */}
      <div className="landing-particle-grid absolute inset-0" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      {/* Subtitle — slides up after particles converge */}
      <div
        ref={subtitleRef}
        className="absolute bottom-[15%] left-1/2 z-20 w-full max-w-lg px-6 text-center"
        style={{
          opacity: 0,
          transform: "translateX(-50%) translateY(12px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        <p className="text-base text-slate-400/80 tracking-wide sm:text-lg">
          Union과 함께 당신의 미니앱을
          <br className="sm:hidden" /> 전국 캠퍼스에 출시하세요
        </p>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #080e1c 100%)",
        }}
      />
    </section>
  );
}
