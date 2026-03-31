"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type LandingRevealVariant = "fade-up" | "fade-in" | "image";

const motionComponents = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  p: motion.p,
  section: motion.section,
} satisfies Record<string, ElementType>;

interface LandingRevealProps<T extends ElementType = "div">
  extends ComponentPropsWithoutRef<T> {
  as?: T;
  children: ReactNode;
  className: string;
  delay?: number;
  duration?: number;
  distance?: number;
  variant?: LandingRevealVariant;
}

export function LandingReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  distance = 28,
  duration = 0.7,
  variant = "fade-up",
  ...props
}: LandingRevealProps<T>) {
  const reduceMotion = useReducedMotion();
  const MotionComponent =
    motionComponents[(as ?? "div") as keyof typeof motionComponents] ?? motion.div;

  const hidden =
    variant === "image"
      ? { opacity: 0, y: distance, scale: 0.94 }
      : variant === "fade-in"
        ? { opacity: 0 }
        : { opacity: 0, y: distance };

  const visible =
    variant === "image"
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
        }
      : {
          opacity: 1,
          y: 0,
        };

  return (
    <MotionComponent
      className={cn("will-change-transform", className)}
      initial={reduceMotion ? false : hidden}
      whileInView={reduceMotion ? undefined : visible}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduceMotion
          ? undefined
          : {
              delay,
              duration,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
