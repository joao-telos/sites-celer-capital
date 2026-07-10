"use client";

import type { ReactNode } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Wrapper fino sobre o BlurFade do Magic UI que resolve prefers-reduced-motion
 * no ponto de uso — o BlurFade/TextAnimate animam via Motion (JS), então a
 * regra CSS global de reduced-motion em globals.css não os alcança sozinha.
 * Enquanto a preferência ainda não foi lida (null, no primeiro render), assume
 * animado — evita flash de conteúdo estático antes da hidratação.
 */
export function Reveal({ children, delay = 0, direction }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <BlurFade inView delay={delay} direction={direction}>
      {children}
    </BlurFade>
  );
}
