"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  className?: string;
  /** "default" for ice/white backgrounds, "onRed" for red section backgrounds */
  variant?: "default" | "onRed";
}

const STYLES = {
  default: {
    bg: "#FDE8E7",
    bar: "#E83A33",
    text: "#E83A33",
  },
  onRed: {
    bg: "#C42E29",
    bar: "#FACCCB",
    text: "#FFFFFF",
  },
} as const;

export function Highlight({ children, className, variant = "default" }: HighlightProps) {
  const s = STYLES[variant];

  return (
    <motion.span
      className={cn("relative inline-block cursor-default", className)}
      whileHover={{ scale: 1.02 }}
      style={{ willChange: "transform" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle background */}
      <span
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: "0 -0.15em",
          zIndex: 0,
          borderRadius: "0.2em",
          background: s.bg,
        }}
      />
      {/* Bottom accent bar */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: "0.06em",
          left: "0.08em",
          right: "0.08em",
          height: "0.06em",
          zIndex: 0,
          borderRadius: "1em",
          background: s.bar,
        }}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          color: s.text,
          display: "inline-block",
        }}
      >
        {children}
      </span>
    </motion.span>
  );
}
