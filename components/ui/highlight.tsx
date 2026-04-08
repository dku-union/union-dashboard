"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  className?: string;
}

export function Highlight({ children, className }: HighlightProps) {
  return (
    <motion.span
      className={cn("relative inline-block cursor-default", className)}
      whileHover={{ scale: 1.02 }}
      style={{ willChange: "transform" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow underline + subtle background */}
      <span
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: "0 -0.18em",
          zIndex: 0,
          borderRadius: "0.15em",
          background:
            "linear-gradient(135deg, rgba(64,138,113,0.22) 0%, rgba(117,191,160,0.10) 100%)",
        }}
      />
      {/* Bottom accent bar */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: "0.04em",
          left: "0.05em",
          right: "0.05em",
          height: "0.08em",
          zIndex: 0,
          borderRadius: "1em",
          background:
            "linear-gradient(90deg, #408A71 0%, #75BFA0 50%, #408A71 100%)",
          boxShadow: "0 0 20px rgba(82,168,130,0.5), 0 0 40px rgba(64,138,113,0.25)",
        }}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          color: "#B0E4CC",
          display: "inline-block",
        }}
      >
        {children}
      </span>
    </motion.span>
  );
}
