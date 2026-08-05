"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccordionPanel {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface InteractiveAccordionProps {
  panels: AccordionPanel[];
  className?: string;
}

/*
  O ângulo varia por índice para a fileira ler como família sem virar seis
  painéis idênticos. As duas cores são as da marca, via token.
*/
const ANGULOS = [135, 150, 120, 165, 105, 140];

function gradienteDoPainel(index: number) {
  const angulo = ANGULOS[index % ANGULOS.length];
  return `linear-gradient(${angulo}deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)`;
}

/**
 * Acordeão horizontal dirigido por hover e por foco de teclado. Abaixo de
 * `md` o acordeão dá lugar a uma grade estática — texto rotacionado a 90°
 * em coluna estreita não funciona no celular.
 *
 * Só um dos dois blocos está no DOM visível por vez (o outro fica em
 * `display:none`, que também o remove da árvore de acessibilidade), então
 * não há anúncio duplicado para leitores de tela.
 */
export function InteractiveAccordion({
  panels,
  className,
}: InteractiveAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden",
          className
        )}
      >
        {panels.map((panel, i) => {
          const Icon = panel.icon;
          return (
            <li
              key={panel.id}
              className="rounded-2xl px-6 py-6 text-left"
              style={{ background: gradienteDoPainel(i) }}
            >
              <Icon className="size-6 text-gold" aria-hidden="true" />
              <h3 className="font-heading text-h3 mt-4 font-bold text-white">
                {panel.title}
              </h3>
              <p className="text-body mt-2 font-light text-white/75">
                {panel.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div className={cn("hidden gap-3 md:flex", className)}>
        {panels.map((panel, i) => {
          const Icon = panel.icon;
          const isActive = i === activeIndex;

          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              style={{ background: gradienteDoPainel(i), flexBasis: 0 }}
              className={cn(
                "relative h-[480px] cursor-pointer overflow-hidden rounded-3xl text-left transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                isActive ? "grow-[3]" : "grow"
              )}
            >
              <span className="absolute inset-x-0 top-0 flex justify-center pt-7">
                <Icon
                  className={cn(
                    "size-6 shrink-0 transition-colors duration-300",
                    isActive ? "text-gold" : "text-white/70"
                  )}
                  aria-hidden="true"
                />
              </span>

              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 px-7 pb-7 transition-opacity duration-300",
                  isActive
                    ? "opacity-100 delay-150"
                    : "pointer-events-none opacity-0"
                )}
              >
                <span className="font-heading block text-[1.75rem] font-bold text-white lg:text-[2rem]">
                  {panel.title}
                </span>
                <span className="text-body mt-2 block font-light text-white/75">
                  {panel.description}
                </span>
              </span>

              {/* Título rotacionado do estado fechado. aria-hidden porque o
                  bloco acima já carrega título e descrição para o leitor. */}
              <span
                aria-hidden="true"
                className={cn(
                  "font-heading text-h3 absolute bottom-24 left-1/2 -translate-x-1/2 rotate-90 font-bold whitespace-nowrap text-white/80 transition-opacity duration-300",
                  isActive
                    ? "pointer-events-none opacity-0"
                    : "opacity-100 delay-150"
                )}
              >
                {panel.title}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
