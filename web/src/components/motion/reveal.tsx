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
 * no ponto de uso — o BlurFade anima via Motion (JS), então a regra CSS
 * global de reduced-motion em globals.css não o alcança sozinha.
 * `TextAnimate` (Magic UI) foi removido do projeto: travava depois de animar
 * só o primeiro segmento (bug reproduzível, não resolvido a fundo — ver
 * commit que trocou o H1 do Hero por este mesmo Reveal).
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
