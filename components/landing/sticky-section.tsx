"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface StickySectionProps {
  children: ReactNode;
  zIndex: number;
}

/**
 * Smart sticky wrapper for landing page card-stack scroll effect.
 *
 * - Sections that fit within the viewport: sticky top-0 (card-stack).
 * - Sections taller than the viewport: normal scroll (position: relative)
 *   so the user can see all content. z-index is preserved, so the next
 *   section still visually covers this one as it scrolls past.
 */
export function StickySection({ children, zIndex }: StickySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calc = () => {
      setSticky(el.offsetHeight <= window.innerHeight);
    };

    calc();

    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={sticky ? "sticky top-0" : "relative"}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}
