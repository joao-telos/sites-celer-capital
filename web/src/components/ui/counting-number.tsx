"use client";

import { useEffect, useRef, useState } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

interface CountingNumberProps {
  target: number;
  from?: number;
  durationMs?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Contagem animada com requestAnimationFrame, sem biblioteca de animação —
 * o projeto removeu o `motion` no pivô de 2026-07-10 e não voltou atrás.
 *
 * Dispara ao entrar na tela (useInViewOnce), não no mount: uma contagem que
 * roda com a seção fora do viewport termina antes de alguém ver.
 *
 * prefers-reduced-motion precisa de tratamento explícito aqui. A regra
 * global em globals.css zera transições e animações CSS, mas não alcança
 * uma contagem dirigida por JS.
 */
export function CountingNumber({
  target,
  from = 0,
  durationMs = 1800,
  className,
}: CountingNumberProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const [value, setValue] = useState(from);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const semMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const inicio = performance.now();
    const passo = (agora: number) => {
      // setState fica dentro do callback do rAF (não direto no corpo do
      // effect) para não disparar o lint react-hooks/set-state-in-effect,
      // que reclama de cascading renders quando setState roda sincronamente
      // no corpo do effect.
      if (semMovimento) {
        setValue(target);
        return;
      }
      const progresso = Math.min((agora - inicio) / durationMs, 1);
      setValue(Math.round(from + (target - from) * easeOutCubic(progresso)));
      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(passo);
      }
    };
    frameRef.current = requestAnimationFrame(passo);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, from, target, durationMs]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString("pt-BR")}
    </span>
  );
}
