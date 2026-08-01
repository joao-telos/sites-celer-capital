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
 * roda com a seção fora do viewport termina antes de alguém ver. O
 * `rootMargin` passado aqui precisa ficar igual ao do `Reveal` que embrulha
 * a seção (ver numeros.tsx) — senão o contador dispara ~10vh antes da caixa
 * ficar visível e já está pela metade quando ela aparece.
 *
 * prefers-reduced-motion precisa de tratamento explícito aqui. A regra
 * global em globals.css zera transições e animações CSS, mas não alcança
 * uma contagem dirigida por JS.
 *
 * O estado inicial é `target`, não `from`. numeros.tsx é Server Component,
 * então esse valor inicial é o que vai pro HTML servido — se fosse `from`
 * (0 por padrão), qualquer coisa que não execute JS e role a tela (crawler,
 * preview de link, view-source, JS desligado) leria os números
 * institucionais da empresa como zero. Como o efeito abaixo só roda quando
 * `inView` vira true, o valor fica parado em `target` até a seção entrar na
 * tela — a primeira renderização do rAF já calcula um progresso perto de 0,
 * o que devolve algo próximo de `from`, e a contagem sobe dali. Não muda o
 * resultado visual da animação, só o que aparece antes dela começar. Não
 * "simplificar" de volta pra `useState(from)`.
 */
export function CountingNumber({
  target,
  from = 0,
  durationMs = 1800,
  className,
}: CountingNumberProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>({
    rootMargin: "0px 0px -10% 0px",
  });
  const [value, setValue] = useState(target);
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
