"use client";

import type { ReactNode } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const HIDDEN_TRANSLATE: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-2",
  down: "-translate-y-2",
  left: "translate-x-2",
  right: "-translate-x-2",
};

/**
 * Scroll-triggered fade/slide-in, plain CSS transition + native
 * IntersectionObserver — no animation library. Reduced motion is handled
 * entirely by the global `prefers-reduced-motion` rule in globals.css
 * (a real CSS transition, unlike the Motion-driven component this replaced).
 */
export function Reveal({ children, delay = 0, direction = "up" }: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        "transition-all duration-500 ease-out",
        inView
          ? "translate-x-0 translate-y-0 opacity-100 blur-none"
          : cn("opacity-0 blur-sm", HIDDEN_TRANSLATE[direction])
      )}
    >
      {children}
    </div>
  );
}
