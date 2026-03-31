import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface LandingSectionProps extends ComponentPropsWithoutRef<"section"> {
  fullHeight?: boolean;
  contentClassName?: string;
}

export function LandingSection({
  children,
  className,
  contentClassName,
  fullHeight = false,
  ...props
}: LandingSectionProps) {
  return (
    <section
      className={cn(
        "px-4 sm:px-6 lg:px-8",
        fullHeight &&
          "landing-full-section lg:snap-start lg:min-h-[calc(100svh-var(--landing-header-height))] lg:scroll-mt-[var(--landing-header-height)] lg:py-8",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl",
          fullHeight && "flex min-h-[inherit] flex-col justify-center",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
