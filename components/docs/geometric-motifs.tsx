// Huemint-inspired geometric motifs for Union docs
// Quarter circle, Leaf shape, Circle-in-square, Grid mosaic
// All use currentColor so callers control tone via text-* classes.

import { cn } from "@/lib/utils";

type SvgProps = React.SVGProps<SVGSVGElement>;

export function QuarterCircle({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
      className={cn("inline-block", className)}
      {...props}
    >
      <path d="M0 0 H32 A32 32 0 0 0 0 32 Z" />
    </svg>
  );
}

export function LeafShape({ className, ...props }: SvgProps) {
  // Two opposing quarter-circles forming a vesica piscis / leaf
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden
      className={cn("inline-block", className)}
      {...props}
    >
      <path d="M0 0 A64 64 0 0 1 64 64 A64 64 0 0 1 0 0 Z" />
    </svg>
  );
}

export function CircleInSquare({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("inline-block", className)}
      {...props}
    >
      <rect width="32" height="32" fill="currentColor" opacity="0.12" />
      <circle cx="16" cy="16" r="10" fill="currentColor" />
    </svg>
  );
}

// Decorative mosaic: 4x4 grid of cells, each cell renders one of three motifs.
// Pattern is hand-tuned, not random, to feel intentional.
const MOSAIC_PATTERN: Array<"red" | "charcoal" | "ice" | "qc-tl" | "qc-tr" | "qc-br" | "qc-bl" | "leaf"> = [
  "ice", "qc-br", "red", "ice",
  "qc-tl", "charcoal", "ice", "leaf",
  "red", "ice", "qc-bl", "ice",
  "ice", "leaf", "ice", "qc-tr",
];

export function GridMosaic({
  className,
  cell = 36,
  ...props
}: SvgProps & { cell?: number }) {
  const size = cell * 4;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden
      className={cn("inline-block", className)}
      {...props}
    >
      {MOSAIC_PATTERN.map((kind, i) => {
        const x = (i % 4) * cell;
        const y = Math.floor(i / 4) * cell;
        switch (kind) {
          case "red":
            return <rect key={i} x={x} y={y} width={cell} height={cell} fill="#E83A33" />;
          case "charcoal":
            return <rect key={i} x={x} y={y} width={cell} height={cell} fill="#262725" />;
          case "ice":
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={cell}
                height={cell}
                fill="#EDF2FA"
                stroke="#DCE4F2"
                strokeWidth={1}
              />
            );
          case "qc-tl":
            return (
              <g key={i}>
                <rect x={x} y={y} width={cell} height={cell} fill="#EDF2FA" />
                <path d={`M${x} ${y} H${x + cell} A${cell} ${cell} 0 0 0 ${x} ${y + cell} Z`} fill="#262725" />
              </g>
            );
          case "qc-tr":
            return (
              <g key={i}>
                <rect x={x} y={y} width={cell} height={cell} fill="#EDF2FA" />
                <path
                  d={`M${x + cell} ${y} V${y + cell} A${cell} ${cell} 0 0 0 ${x} ${y} Z`}
                  fill="#E83A33"
                />
              </g>
            );
          case "qc-br":
            return (
              <g key={i}>
                <rect x={x} y={y} width={cell} height={cell} fill="#EDF2FA" />
                <path
                  d={`M${x + cell} ${y + cell} H${x} A${cell} ${cell} 0 0 0 ${x + cell} ${y} Z`}
                  fill="#262725"
                />
              </g>
            );
          case "qc-bl":
            return (
              <g key={i}>
                <rect x={x} y={y} width={cell} height={cell} fill="#EDF2FA" />
                <path
                  d={`M${x} ${y + cell} V${y} A${cell} ${cell} 0 0 1 ${x + cell} ${y + cell} Z`}
                  fill="#E83A33"
                />
              </g>
            );
          case "leaf":
            return (
              <g key={i}>
                <rect x={x} y={y} width={cell} height={cell} fill="#EDF2FA" />
                <path
                  d={`M${x} ${y} A${cell} ${cell} 0 0 1 ${x + cell} ${y + cell} A${cell} ${cell} 0 0 1 ${x} ${y} Z`}
                  fill="#262725"
                />
              </g>
            );
          default:
            return null;
        }
      })}
    </svg>
  );
}

// Section eyebrow: red dot + uppercase tracked label
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-union",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-union" />
      {children}
    </div>
  );
}
