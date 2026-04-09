"use client";

import { useEffect, useRef } from "react";

/* ─── Layout ─── */
const S = 72;
const COLS = 4;
const ROWS = 5;
const MOSAIC_W = COLS * S;
const MOSAIC_H = ROWS * S;
const PAD_TOP = 200;
const PAD_RIGHT = 200;
const PAD_BOT = 150;

/* ─── Colors ─── */
const DARK = "#262725";
const RED = "#E83A33";
const SPARK_COLOR = "#EF6560"; // red-400: warm ember glow
const HS = S / 2;

/* ─── Grid ─── */
type G = { t: string; c: string; d?: string };
const GRID: G[][] = [
  [{ t: "q", c: RED, d: "tl" }, { t: "s", c: DARK }, { t: "q", c: RED, d: "tr" }, { t: "e", c: "" }],
  [{ t: "s", c: RED }, { t: "q", c: DARK, d: "br" }, { t: "e", c: "" }, { t: "q", c: DARK, d: "tl" }],
  [{ t: "q", c: DARK, d: "tr" }, { t: "e", c: "" }, { t: "s", c: RED }, { t: "q", c: DARK, d: "bl" }],
  [{ t: "e", c: "" }, { t: "q", c: RED, d: "tl" }, { t: "q", c: DARK, d: "br" }, { t: "s", c: DARK }],
  [{ t: "e", c: "" }, { t: "s", c: RED }, { t: "q", c: RED, d: "tr" }, { t: "q", c: DARK, d: "tl" }],
];

/* ─── Types ─── */
interface Cell {
  type: "solid" | "quarter";
  color: string;
  corner?: string;
  ox: number; oy: number;
  x: number; y: number;
  vx: number; vy: number;
  rot: number; vr: number;
  fadeDelay: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
}

interface FlyBlock {
  cell: Cell;
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  delay: number;
  dur: number;
  bounceV: number;
  maxForce: number;
  sparkCount: number;
  phase: "wait" | "flight" | "bounce" | "settled";
  trail: { x: number; y: number; t: number }[];
}

/* ─── Cubic Bezier ─── */
function bez3(t: number, a: number, b: number, c: number, d: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

/* ─── Draw a single mosaic cell ─── */
function drawCell(ctx: CanvasRenderingContext2D, c: Cell, alpha: number) {
  if (alpha < 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(c.x + HS, c.y + HS);
  ctx.rotate(c.rot);
  ctx.fillStyle = c.color;
  ctx.beginPath();
  if (c.type === "solid") {
    ctx.roundRect(-HS, -HS, S, S, 2);
  } else {
    switch (c.corner) {
      case "tl":
        ctx.moveTo(-HS, -HS); ctx.lineTo(HS, -HS);
        ctx.arc(-HS, -HS, S, 0, Math.PI / 2);
        break;
      case "tr":
        ctx.moveTo(HS, -HS); ctx.lineTo(-HS, -HS);
        ctx.arc(HS, -HS, S, Math.PI, Math.PI / 2, true);
        break;
      case "bl":
        ctx.moveTo(-HS, HS); ctx.lineTo(-HS, -HS);
        ctx.arc(-HS, HS, S, -Math.PI / 2, 0);
        break;
      case "br":
        ctx.moveTo(HS, HS); ctx.lineTo(HS, -HS);
        ctx.arc(HS, HS, S, -Math.PI / 2, Math.PI, true);
        break;
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════
   HeroMosaicCanvas

   Two blocks arc in from different directions:
     Block 1 (RED)  — upper-left  → row 0 col 3
     Block 2 (DARK) — right side  → row 3 col 0
   Each impact scatters existing cells and settled blocks.
   ═══════════════════════════════════════════════════════════ */
export function HeroMosaicCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const cvs = canvasRef.current;
    if (!wrapper || !cvs) return;
    const _ctx = cvs.getContext("2d");
    if (!_ctx) return;
    const ctx = _ctx;

    /* ── Reduced-motion: static mosaic only ── */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      cvs.width = Math.round(MOSAIC_W * dpr);
      cvs.height = Math.round(MOSAIC_H * dpr);
      cvs.style.width = MOSAIC_W + "px";
      cvs.style.height = MOSAIC_H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      GRID.forEach((row, r) =>
        row.forEach((def, c) => {
          if (def.t === "e") return;
          drawCell(ctx, {
            type: def.t === "s" ? "solid" : "quarter",
            color: def.c, corner: def.d,
            ox: c * S, oy: r * S, x: c * S, y: r * S,
            vx: 0, vy: 0, rot: 0, vr: 0, fadeDelay: 0,
          }, 1);
        }),
      );
      return;
    }

    /* ── Dynamic canvas sizing ── */
    const rect = wrapper.getBoundingClientRect();
    const padLeft = Math.min(Math.max(rect.left + 30, 200), 900);
    const cw = MOSAIC_W + padLeft + PAD_RIGHT;
    const ch = MOSAIC_H + PAD_TOP + PAD_BOT;
    const mx = padLeft;
    const my = PAD_TOP;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    cvs.width = Math.round(cw * dpr);
    cvs.height = Math.round(ch * dpr);
    cvs.style.width = cw + "px";
    cvs.style.height = ch + "px";
    cvs.style.position = "absolute";
    cvs.style.left = -padLeft + "px";
    cvs.style.top = -PAD_TOP + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* ── Build mosaic cells ── */
    const cells: Cell[] = [];
    GRID.forEach((row, r) =>
      row.forEach((def, c) => {
        if (def.t === "e") return;
        const ox = mx + c * S;
        const oy = my + r * S;
        cells.push({
          type: def.t === "s" ? "solid" : "quarter",
          color: def.c, corner: def.d,
          ox, oy, x: ox, y: oy,
          vx: 0, vy: 0, rot: 0, vr: 0,
          fadeDelay: (r + c) * 70,
        });
      }),
    );

    /* ── Two flying blocks ── */
    const blocks: FlyBlock[] = [
      // Block 1: RED, upper-left → row 0 col 3
      {
        cell: {
          type: "solid", color: RED,
          ox: mx + 3 * S, oy: my,
          x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, fadeDelay: 0,
        },
        p0: { x: 20, y: 25 },
        p1: { x: padLeft * 0.3, y: -15 },
        p2: { x: mx + 3 * S + HS - S * 1.5, y: my * 0.35 },
        p3: { x: mx + 3 * S + HS, y: my + HS },
        delay: 2200,
        dur: 1200,
        bounceV: -5.5,
        maxForce: 18,
        sparkCount: 16,
        phase: "wait",
        trail: [],
      },
      // Block 2: DARK, right side → row 3 col 0
      {
        cell: {
          type: "solid", color: DARK,
          ox: mx, oy: my + 3 * S,
          x: 0, y: 0, vx: 0, vy: 0, rot: 0, vr: 0, fadeDelay: 0,
        },
        p0: { x: mx + MOSAIC_W + 120, y: my + S },
        p1: { x: mx + MOSAIC_W * 0.55, y: my - 20 },
        p2: { x: mx + S, y: my + 2 * S },
        p3: { x: mx + HS, y: my + 3 * S + HS },
        delay: 2800,
        dur: 1000,
        bounceV: -4,
        maxForce: 12,
        sparkCount: 10,
        phase: "wait",
        trail: [],
      },
    ];

    /* ── State ── */
    const t0 = performance.now();
    const FADE_DUR = 900;
    const BOUNCE_G = 0.3;
    const TRAIL_LIFE = 600;
    let impacted = false;
    const sparks: Spark[] = [];
    let floatPh = 0;
    let raf = 0;

    /* ── Animation loop ── */
    function frame(now: number) {
      ctx.clearRect(0, 0, cw, ch);
      const el = now - t0;

      // Float
      floatPh += 0.008;
      const fy = el > 1600 ? Math.sin(floatPh) * 5 : 0;

      /* ── Process each block ── */
      for (const b of blocks) {
        const bEl = el - b.delay;

        // wait → flight
        if (b.phase === "wait" && bEl > 0) b.phase = "flight";

        // Flight: follow bezier arc
        if (b.phase === "flight") {
          const rawT = Math.min(1, bEl / b.dur);
          const px = bez3(rawT, b.p0.x, b.p1.x, b.p2.x, b.p3.x);
          const py = bez3(rawT, b.p0.y, b.p1.y, b.p2.y, b.p3.y);
          b.cell.x = px - HS;
          b.cell.y = py - HS;
          b.cell.rot = rawT * Math.PI * 4; // 2 full rotations
          b.trail.push({ x: px, y: py, t: now });

          if (rawT >= 1) {
            b.phase = "bounce";
            b.cell.x = b.cell.ox;
            b.cell.y = b.cell.oy + fy;
            b.cell.vy = b.bounceV;
            b.cell.rot = 0;
            impacted = true;

            const ix = b.cell.ox + HS;
            const iy = b.cell.oy + fy + HS;

            // Scatter cells
            for (const c of cells) {
              const dx = c.x + HS - ix;
              const dy = c.y + HS - iy;
              const dist = Math.max(15, Math.hypot(dx, dy));
              const force = Math.min(b.maxForce, b.maxForce * 22 / dist);
              c.vx += (dx / dist) * force + (Math.random() - 0.5) * 2;
              c.vy += (dy / dist) * force + (Math.random() - 0.5) * 2;
              c.vr += (Math.random() - 0.5) * 0.2;
            }

            // Push already-settled blocks
            for (const ob of blocks) {
              if (ob === b || ob.phase === "wait" || ob.phase === "flight") continue;
              const dx = ob.cell.x + HS - ix;
              const dy = ob.cell.y + HS - iy;
              const dist = Math.max(15, Math.hypot(dx, dy));
              const force = Math.min(8, 150 / dist);
              ob.cell.vx += (dx / dist) * force;
              ob.cell.vy += (dy / dist) * force;
              ob.cell.vr += (Math.random() - 0.5) * 0.1;
            }

            // Sparks
            for (let i = 0; i < b.sparkCount; i++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 1.5 + Math.random() * 4;
              sparks.push({
                x: ix, y: iy,
                vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                life: 1, size: 2 + Math.random() * 3,
              });
            }
          }
        }

        // Bounce: gravity + surface collision
        if (b.phase === "bounce") {
          b.cell.vy += BOUNCE_G;
          b.cell.y += b.cell.vy;
          const surface = b.cell.oy + fy;
          if (b.cell.y >= surface) {
            b.cell.y = surface;
            b.cell.vy *= -0.35;
            if (Math.abs(b.cell.vy) < 1) {
              b.phase = "settled";
              b.cell.vy = 0;
            }
          }
        }

        // Settled: spring physics (responds to pushes from later impacts)
        if (b.phase === "settled") {
          const sp = 0.04;
          const dm = 0.9;
          b.cell.vx += (b.cell.ox - b.cell.x) * sp;
          b.cell.vy += (b.cell.oy + fy - b.cell.y) * sp;
          b.cell.vx *= dm;
          b.cell.vy *= dm;
          b.cell.x += b.cell.vx;
          b.cell.y += b.cell.vy;
          b.cell.vr += -b.cell.rot * sp * 0.5;
          b.cell.vr *= dm;
          b.cell.rot += b.cell.vr;
        }
      }

      /* ── Cells ── */
      for (const c of cells) {
        const fade = Math.min(1, Math.max(0, el - c.fadeDelay) / FADE_DUR);
        if (impacted) {
          const sp = 0.035;
          const dm = 0.91;
          c.vx += (c.ox - c.x) * sp;
          c.vy += (c.oy + fy - c.y) * sp;
          c.vx *= dm;
          c.vy *= dm;
          c.x += c.vx;
          c.y += c.vy;
          c.vr += -c.rot * sp * 0.5;
          c.vr *= dm;
          c.rot += c.vr;
        } else {
          c.x = c.ox;
          c.y = c.oy + fy;
        }
        drawCell(ctx, c, fade);
      }

      /* ── Trails (drawn on top of cells for visibility) ── */
      for (const b of blocks) {
        if (b.trail.length < 2) continue;
        ctx.lineCap = "round";
        for (let i = 1; i < b.trail.length; i++) {
          const age = now - b.trail[i].t;
          if (age > TRAIL_LIFE) continue;
          const ratio = 1 - age / TRAIL_LIFE;
          ctx.beginPath();
          ctx.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
          ctx.lineTo(b.trail[i].x, b.trail[i].y);
          ctx.strokeStyle = `rgba(232,58,51,${ratio * 0.4})`;
          ctx.lineWidth = ratio * 2.5;
          ctx.stroke();
        }
        while (b.trail.length > 0 && now - b.trail[0].t > TRAIL_LIFE) b.trail.shift();
      }

      /* ── Blocks ── */
      for (const b of blocks) {
        if (b.phase !== "wait") drawCell(ctx, b.cell, 1);
      }

      /* ── Sparks (single color: warm ember) ── */
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.life -= 0.02;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life * 0.7;
        ctx.fillStyle = SPARK_COLOR;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ width: MOSAIC_W, height: MOSAIC_H, overflow: "visible" }}
    >
      <canvas ref={canvasRef} className="pointer-events-none" aria-hidden />
    </div>
  );
}
