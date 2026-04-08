"use client";

/**
 * LandingCanvas — Fixed full-viewport Fibonacci Sphere
 *
 * Architecture: position:fixed, z-index:-1
 * - Solid sections (z:1, bg:#070d0a) cover it → canvas hidden
 * - Reveal gaps (transparent) → canvas visible
 * - Scroll interaction: velocity boost → Lerp back to base speed
 * - Scale pulse: 1.06 on scroll-down, 0.97 on scroll-up → ease back to 1.0
 * - Mouse parallax: gentle sphere tilt toward cursor
 */

import { useEffect, useRef } from "react";

/* ── Constants ──────────────────────────────────────────────── */
const N          = 150;          // particle count
const FOV        = 450;          // field of view (px)
const CDIST      = 82;           // connection distance threshold (px)
const CDIST_SQ   = CDIST * CDIST;

// Base auto-rotation (rad / frame)
const BASE_VX    = 0.00042;
const BASE_VY    = 0.00175;

// Lerp factors
const LERP_VEL   = 0.045;        // velocity eases back to base
const LERP_MOUSE = 0.032;        // mouse parallax smoothing
const LERP_SCALE = 0.055;        // scale ease

// Scroll-to-rotation multiplier (낮출수록 스크롤 반응 느려짐)
const SCROLL_BOOST_Y = 0.00018;
const SCROLL_BOOST_X = 0.00006;

// Colors (rgb) — #75BFA0 nodes, #408A71 lines
const RN = 117, GN = 191, BN = 160;
const RL = 64,  GL = 138, BL = 113;

/* ── Types ──────────────────────────────────────────────────── */
interface P3 { bx: number; by: number; bz: number; x: number; y: number; z: number }
interface P2 { x: number; y: number; a: number }

/* ── Helpers ────────────────────────────────────────────────── */
function buildSphere(r: number): P3[] {
  const PHI  = Math.PI * (3 - Math.sqrt(5)); // golden angle
  const pts: P3[] = [];
  for (let i = 0; i < N; i++) {
    const ny    = 1 - (i / (N - 1)) * 2;
    const nr    = Math.sqrt(Math.max(0, 1 - ny * ny));
    const theta = PHI * i;
    const bx    = Math.cos(theta) * nr * r;
    const by    = ny * r;
    const bz    = Math.sin(theta) * nr * r;
    pts.push({ bx, by, bz, x: bx, y: by, z: bz });
  }
  return pts;
}

/**
 * 4-pointed star path (삐죽한 십자형 별)
 * outer: 외곽 꼭지 반지름, inner: 오목한 안쪽 반지름 (outer * 0.28 정도)
 */
function star4(ctx: CanvasRenderingContext2D, x: number, y: number, outer: number, inner: number) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 4; // 45° 간격, -45° 오프셋으로 꼭지를 위쪽에
    const r     = i % 2 === 0 ? outer : inner;
    const px    = x + Math.cos(angle) * r;
    const py    = y + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** Rotate in-place: Y-axis then X-axis */
function rotateY(p: P3, cy: number, sy: number, cx: number, sx: number) {
  const tx =  p.bx * cy - p.bz * sy;
  const tz  =  p.bz * cy + p.bx * sy;
  p.x =  tx;
  p.y =  p.by * cx - tz * sx;
  p.z =  tz * cx + p.by * sx;
}

/* ════════════════════════════════════════════════════════════ */
export function LandingCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* ── State ────────────────────────────────────────────── */
    let W = 0, H = 0, dpr = 1;
    let pts: P3[] = [];
    let raf = 0;

    // Rotation angles (accumulated)
    let ax = 0, ay = 0;
    // Current angular velocities
    let vx = BASE_VX, vy = BASE_VY;
    // Extra scroll-driven boost (decays each frame)
    let bx = 0, by = 0;
    // Drift timer (구 중심 부유 운동)
    let tick = 0;

    // Mouse parallax offsets
    let txOff = 0, tyOff = 0;
    let cxOff = 0, cyOff = 0;

    // Drag-to-rotate
    let isDragging = false;
    let dragLastX  = 0;
    let dragLastY  = 0;
    let dragVX     = 0;   // 마지막 drag velocity X (inertia용)
    let dragVY     = 0;   // 마지막 drag velocity Y (inertia용)

    // Scale pulse
    let scale   = 1.0;
    let tScale  = 1.0;
    let scaleTid: ReturnType<typeof setTimeout> | null = null;

    // Particle escape animation
    // escT[i]: 0 = idle, 0→π = animating (sin 곡선으로 out→in)
    const escT      = new Float32Array(N);       // 진행 시간
    const escActive = new Uint8Array(N);         // 1 = 탈출 중
    const escDir    = new Int8Array(N);          // +1 = 바깥, -1 = 안쪽

    // Scroll tracking
    let lastY   = 0;

    /* ── Setup ────────────────────────────────────────────── */
    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W   = window.innerWidth;
      H   = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 모바일: 화면 짧은 쪽 37% / 넓은 화면: 최대 280px로 캡
      const r = Math.min(Math.min(W, H) * 0.37, 280);
      pts = buildSphere(r);
    };

    /* ── Event handlers ───────────────────────────────────── */
    const onResize = () => setup();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragLastX  = e.clientX;
      dragLastY  = e.clientY;
      dragVX = dragVY = 0;
      canvas.style.cursor = "grabbing";
    };

    const onMouse = (e: MouseEvent) => {
      if (isDragging) {
        // 드래그: 마우스 이동량을 회전각에 직접 반영
        const dx = e.clientX - dragLastX;
        const dy = e.clientY - dragLastY;
        ay     += dx * 0.007;
        ax     += dy * 0.007;
        dragVY  = dx * 0.007;   // inertia용 마지막 속도 저장
        dragVX  = dy * 0.007;
        dragLastX = e.clientX;
        dragLastY = e.clientY;
      } else {
        // 드래그 아닐 때: 기존 parallax tilt
        const cx = W * 0.75;
        const cy = H * 0.50;
        txOff = ((e.clientY - cy) / (H * 0.5)) * 0.32;
        tyOff = ((e.clientX - cx) / (W * 0.5)) * 0.32;
      }
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = "grab";
      // 손을 뗄 때 drag 속도를 boost에 넣어 관성 효과
      by += dragVY * 6;
      bx += dragVX * 6;
    };

    const onScroll = () => {
      const cur   = window.scrollY;
      const delta = cur - lastY;
      lastY       = cur;

      // Boost rotation proportional to scroll speed
      by += delta * SCROLL_BOOST_Y;
      bx += Math.abs(delta) * SCROLL_BOOST_X;

      // Scale pulse
      tScale = delta > 0 ? 1.03 : 0.98;
      if (scaleTid) clearTimeout(scaleTid);
      scaleTid = setTimeout(() => { tScale = 1.0; }, 160);
    };

    /* ── Draw loop ────────────────────────────────────────── */
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // -- Velocity: ease back to base, then add decaying boost
      vx  = vx + (BASE_VX - vx) * LERP_VEL;
      vy  = vy + (BASE_VY - vy) * LERP_VEL;
      bx *= 0.80;
      by *= 0.80;

      // 드래그 중엔 자동 회전 정지 (직접 ax/ay를 mousemove에서 변경)
      if (!isDragging) {
        ax += vx + bx;
        ay += vy + by;
      }

      // -- Mouse parallax
      cxOff += (txOff - cxOff) * LERP_MOUSE;
      cyOff += (tyOff - cyOff) * LERP_MOUSE;

      // -- Scale ease
      scale += (tScale - scale) * LERP_SCALE;

      const totalX = ax + cxOff;
      const totalY = ay + cyOff;
      const cosx = Math.cos(totalX), sinx = Math.sin(totalX);
      const cosy = Math.cos(totalY), siny = Math.sin(totalY);

      // 구 중심 부유 — 서로 다른 주기의 sin/cos로 8자형 궤도
      // 0.012 rad/frame → 60fps 기준 약 8초에 1사이클
      tick++;
      const driftX = Math.sin(tick * 0.012) * 38;   // ±38px 수평
      const driftY = Math.cos(tick * 0.008) * 24;   // ±24px 수직

      const OCX = W * 0.75 + driftX;
      const OCY = H * 0.50 + driftY;

      /* ── Escape trigger (랜덤하게 파티클 탈출 시작) ──────── */
      for (let i = 0; i < N; i++) {
        if (!escActive[i]) {
          if (Math.random() < 0.003) {
            escActive[i] = 1;
            escT[i]      = 0;
            escDir[i]    = Math.random() < 0.5 ? 1 : -1; // 바깥 or 안쪽 랜덤
          }
        } else {
          escT[i] += 0.028;              // 0→π까지 약 112프레임 ≈ 1.9초
          if (escT[i] >= Math.PI) { escT[i] = 0; escActive[i] = 0; }
        }
      }

      /* ── Project 3D → 2D ──────────────────────────────── */
      const proj: P2[] = new Array(N);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        rotateY(p, cosy, siny, cosx, sinx);

        // 탈출 진행률 0→1→0 (sin 곡선)
        const escProg   = escActive[i] ? Math.sin(escT[i]) : 0;
        // 바깥 +18%, 안쪽 -13% — 미세한 범위
        const escFactor = 1 + escProg * (escDir[i] === 1 ? 0.04 : -0.03);

        const ex = p.x * escFactor;
        const ey = p.y * escFactor;
        const ez = p.z * escFactor;

        const pScale = FOV / (FOV + ez);

        // Scale pulse: expand/contract around sphere center
        const rawX = ex * pScale + OCX;
        const rawY = ey * pScale + OCY;
        const x2d  = OCX + (rawX - OCX) * scale;
        const y2d  = OCY + (rawY - OCY) * scale;

        // Depth → opacity
        const alpha  = Math.max(0.04, (pScale - 0.52) * 2.3);
        const radius = Math.max(0.35, 2.7 * pScale * scale);

        proj[i] = { x: x2d, y: y2d, a: alpha };

        // 탈출 중: 색상을 green → white 로 lerp
        const rC = Math.round(RN + (255 - RN) * escProg);
        const gC = Math.round(GN + (255 - GN) * escProg);
        const bC = Math.round(BN + (255 - BN) * escProg);

        // ── 원형 soft glow ─────────────────────────────
        const glowR = radius * 1.5;
        const grd   = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, glowR);
        grd.addColorStop(0,   `rgba(${rC},${gC},${bC},${alpha * 0.55})`);
        grd.addColorStop(0.4, `rgba(${rC},${gC},${bC},${alpha * 0.18})`);
        grd.addColorStop(1,   `rgba(${rC},${gC},${bC},0)`);
        ctx.beginPath();
        ctx.arc(x2d, y2d, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // ── 4꼭지 별 코어 ──────────────────────────────
        const outer = radius * 1.4;
        const inner = outer * 0.22;
        star4(ctx, x2d, y2d, outer, inner);
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${alpha})`;
        ctx.fill();
      }

      /* ── Connections ──────────────────────────────────── */
      ctx.lineWidth = 0.85;
      for (let i = 0; i < N; i++) {
        const a = proj[i];
        for (let j = i + 1; j < N; j++) {
          const b  = proj[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= CDIST_SQ) continue;

          const dist  = Math.sqrt(d2);
          const alpha = (1 - dist / CDIST) * Math.min(a.a, b.a) * 0.72;
          if (alpha < 0.022) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${RL},${GL},${BL},${alpha})`;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    /* ── Init ─────────────────────────────────────────────── */
    lastY = window.scrollY;
    setup();
    draw();

    window.addEventListener("resize",    onResize,     { passive: true });
    window.addEventListener("mousemove", onMouse,      { passive: true });
    window.addEventListener("scroll",    onScroll,     { passive: true });
    canvas.addEventListener("mousedown", onMouseDown,  { passive: true });
    window.addEventListener("mouseup",   onMouseUp,    { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll",    onScroll);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup",   onMouseUp);
      if (scaleTid) clearTimeout(scaleTid);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset:    0,
        width:    "100%",
        height:   "100%",
        zIndex:   1,
        cursor:   "grab",
      }}
      aria-hidden
    />
  );
}
