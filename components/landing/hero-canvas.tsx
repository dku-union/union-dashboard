"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Union Sphere — Fibonacci Particle Sphere Canvas Animation
   Design: Gemini-assisted | Implementation: Canvas 2D + rAF

   150 nodes distributed with the Golden Ratio across a 3D
   sphere surface. Continuous multi-axis rotation. Nodes within
   80px draw glowing green connection lines. Z-depth drives
   opacity and size, creating a natural 3D illusion.
   Mouse parallax gently tilts the sphere.
───────────────────────────────────────────────────────────── */

const PARTICLE_COUNT = 150;
const FOV = 400;
const CONNECT_DIST = 80;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

// Palette  (#75BFA0 nodes, #408A71 lines)
const R_NODE = 117, G_NODE = 191, B_NODE = 160;
const R_LINE = 64,  G_LINE = 138, B_LINE = 113;

interface P3 { bx: number; by: number; bz: number; x: number; y: number; z: number }
interface P2 { x: number; y: number; a: number }

function buildSphere(r: number): P3[] {
  const PHI = Math.PI * (3 - Math.sqrt(5)); // golden angle
  const pts: P3[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ny = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
    const nr = Math.sqrt(Math.max(0, 1 - ny * ny));
    const theta = PHI * i;
    const bx = Math.cos(theta) * nr * r;
    const by = ny * r;
    const bz = Math.sin(theta) * nr * r;
    pts.push({ bx, by, bz, x: bx, y: by, z: bz });
  }
  return pts;
}

function rotate(p: P3, cx: number, sx: number, cy: number, sy: number) {
  // Y rotation first
  const tx = p.bx * cy - p.bz * sy;
  const tz = p.bz * cy + p.bx * sy;
  // X rotation
  p.x = tx;
  p.y = p.by * cx - tz * sx;
  p.z = tz  * cx + p.by * sx;
}

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let pts: P3[] = [];
    let raf = 0;
    let ax = 0, ay = 0;
    let txOff = 0, tyOff = 0; // target mouse offsets
    let cxOff = 0, cyOff = 0; // current (lerped) offsets

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = Math.min(W, H) * 0.38;
      pts = buildSphere(r);
    };

    const onResize = () => { setup(); };
    const onMouse  = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx   = rect.left + rect.width  * 0.72;
      const cy   = rect.top  + rect.height * 0.50;
      txOff = ((e.clientY - cy) / (rect.height * 0.5)) *  0.35;
      tyOff = ((e.clientX - cx) / (rect.width  * 0.5)) *  0.35;
    };

    setup();
    window.addEventListener("resize",    onResize, { passive: true });
    window.addEventListener("mousemove", onMouse,  { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Continuous drift
      ax += 0.00045;
      ay += 0.0018;

      // Smooth mouse parallax
      cxOff += (txOff - cxOff) * 0.035;
      cyOff += (tyOff - cyOff) * 0.035;

      const totalX = ax + cxOff;
      const totalY = ay + cyOff;
      const cosx = Math.cos(totalX), sinx = Math.sin(totalX);
      const cosy = Math.cos(totalY), siny = Math.sin(totalY);

      const oCX = W * 0.72;
      const oCY = H * 0.50;

      // Project
      const proj: P2[] = new Array(PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = pts[i];
        rotate(p, cosx, sinx, cosy, siny);
        const scale = FOV / (FOV + p.z);
        const alpha = Math.max(0.04, (scale - 0.5) * 2.2);
        proj[i] = { x: p.x * scale + oCX, y: p.y * scale + oCY, a: alpha };

        // Draw node
        const r = Math.max(0.4, 2.8 * scale);
        ctx.beginPath();
        ctx.arc(proj[i].x, proj[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R_NODE},${G_NODE},${B_NODE},${alpha})`;
        ctx.fill();
      }

      // Draw connections
      ctx.lineWidth = 0.9;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const a = proj[i];
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const b  = proj[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= CONNECT_DIST_SQ) continue;

          const dist  = Math.sqrt(d2);
          const alpha = (1 - dist / CONNECT_DIST) * Math.min(a.a, b.a) * 0.75;
          if (alpha < 0.025) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${R_LINE},${G_LINE},${B_LINE},${alpha})`;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  );
}
