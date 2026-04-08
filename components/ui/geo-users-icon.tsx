"use client";

/*
 * GeoUserIcon — Single-person silhouette in Huemint geometric style
 *
 * 6 cols × 6 rows grid. Same quarter-circle + solid cell system as UnionGeoLogo.
 *
 * Circular head (2×2 Red quarter-circles, centered).
 * Leaf-shaped shoulder motifs (Charcoal left, Red right).
 * Alternating checkerboard body with rounded bottom corners.
 *
 *   ·  ·  ╲R╱R ·  ·     head top (circle)
 *   ·  ·  ╱R╲R ·  ·     head bottom
 *   ╲C╱C  ·  ·  ╲R╱R   shoulders (leaf motifs)
 *   █C█R █C█R █C█R      body
 *   █R█C █R█C █R█C      body
 *   ╱R█C █R█C █R╲C      body bottom
 */

const R = "#E83A33";
const C = "#262725";

type Cell =
  | { t: "s"; c: string }
  | { t: "q"; c: string; d: "tl" | "tr" | "bl" | "br" }
  | { t: "e" };

// Shorthand helpers
const E: Cell = { t: "e" };
const SR: Cell = { t: "s", c: R };
const SC: Cell = { t: "s", c: C };

// Red quarter-circles
const rTL: Cell = { t: "q", c: R, d: "tl" };
const rTR: Cell = { t: "q", c: R, d: "tr" };
const rBL: Cell = { t: "q", c: R, d: "bl" };
const rBR: Cell = { t: "q", c: R, d: "br" };

// Charcoal quarter-circles
const cTL: Cell = { t: "q", c: C, d: "tl" };
const cTR: Cell = { t: "q", c: C, d: "tr" };
const cBL: Cell = { t: "q", c: C, d: "bl" };
const cBR: Cell = { t: "q", c: C, d: "br" };

// 4 columns × 7 rows
const GRID: Cell[][] = [
  [E,   rBR, rBL, E  ],  // r0 — head top (circle)
  [E,   rTR, rTL, E  ],  // r1 — head bottom
  [E,   E,   E,   E  ],  // r2 — gap (face-body separation)
  [cBR, cBL, rBR, rBL],  // r3 — shoulders (leaf motifs)
  [SC,  SR,  SC,  SR ],  // r4 — body
  [SR,  SC,  SR,  SC ],  // r5 — body
  [rTL, SC,  SC,  cTR],  // r6 — body bottom curves
];

function qcPath(x: number, y: number, s: number, d: string): string {
  switch (d) {
    case "tl": return `M ${x} ${y} L ${x+s} ${y} A ${s} ${s} 0 0 1 ${x} ${y+s} Z`;
    case "tr": return `M ${x+s} ${y} L ${x} ${y} A ${s} ${s} 0 0 0 ${x+s} ${y+s} Z`;
    case "bl": return `M ${x} ${y+s} L ${x} ${y} A ${s} ${s} 0 0 1 ${x+s} ${y+s} Z`;
    case "br": return `M ${x+s} ${y+s} L ${x+s} ${y} A ${s} ${s} 0 0 1 ${x} ${y+s} Z`;
    default:   return "";
  }
}

interface GeoUserIconProps {
  /** Cell size in px — total: 4×cell wide, 7×cell tall */
  cellSize?: number;
  className?: string;
}

export function GeoUserIcon({ cellSize = 6, className }: GeoUserIconProps) {
  const s = cellSize;
  const W = 4 * s;
  const H = 7 * s;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className={className}
      role="img"
      aria-label="User"
    >
      {GRID.map((row, r) =>
        row.map((cell, c) => {
          if (cell.t === "e") return null;
          const x = c * s;
          const y = r * s;

          if (cell.t === "s") {
            return <rect key={`${r}-${c}`} x={x} y={y} width={s} height={s} fill={cell.c} />;
          }

          return <path key={`${r}-${c}`} d={qcPath(x, y, s, cell.d)} fill={cell.c} />;
        })
      )}
    </svg>
  );
}
