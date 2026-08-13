"use client";

import { Fragment } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

/*
  A tagline é a assinatura institucional da marca. Esta frase era a linha
  de apoio da seção Sobre até 2026-08-12 — saiu de lá ao virar tagline,
  senão apareceria duas vezes na mesma página.
*/
const LINHAS = [
  { cor: "text-navy", texto: "Com celeridade e compromisso," },
  { cor: "text-navy-bright", texto: "abrimos portas e impulsionamos negócios." },
];

/*
  Não usa o componente Reveal de propósito: ele renderiza um <div>, e <div>
  dentro de <h2> é HTML inválido. Embrulhar o <h2> inteiro num Reveal
  revelaria tudo de uma vez, que é o oposto do pedido.

  Um observer só, no <h2>, com o escalonamento vindo de transitionDelay por
  linha. O inline-block é necessário porque transform não se aplica a
  elemento inline.

  A escala é `text-stat` (48 → 68), não `text-display` (44 → 88): a linha
  mais longa tem 40 caracteres, e em caixa alta a 88px ela passaria de
  1900px de largura, contra 1216px de container. Em `text-stat` cabe no
  desktop e quebra sozinha no celular.

  prefers-reduced-motion já é coberto pela regra global do globals.css:
  aqui a animação é transição CSS, não JS.
*/
export function Atendimento() {
  const { ref, inView } = useInViewOnce<HTMLHeadingElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section id="atendimento" className="surface-wash-down">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center sm:px-10 lg:py-10">
        <h2
          ref={ref}
          className="font-heading text-stat mx-auto max-w-[24ch] font-bold uppercase"
        >
          {LINHAS.map((linha, i) => (
            <Fragment key={linha.cor}>
              {/* Espaço real entre as linhas. A linha seguinte é "block", o
                  que quebra visualmente mas não insere separador no
                  textContent — sem isto o leitor de tela anuncia
                  "compromisso,abrimos". */}
              {i > 0 ? " " : null}
              <span
                style={{ transitionDelay: `${i * 0.15}s` }}
                className={cn(
                  "block transition-all duration-500 ease-out",
                  linha.cor,
                  inView
                    ? "translate-y-0 opacity-100 blur-none"
                    : "translate-y-2 opacity-0 blur-sm"
                )}
              >
                {linha.texto}
              </span>
            </Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}
