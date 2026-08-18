"use client";

import { Fragment } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

/*
  A tagline é a assinatura institucional da marca. Esta frase era a linha
  de apoio da seção Sobre até 2026-08-12 — saiu de lá ao virar tagline,
  senão apareceria duas vezes na mesma página.

  As quebras são declaradas, não deixadas para o navegador: o cliente
  pediu exatamente três linhas. As duas últimas ficam em navy-bright
  porque formam uma oração só — a cor separa o "como" do "o quê", que era
  o sentido das duas cores quando a tagline tinha duas linhas.
*/
const LINHAS = [
  { cor: "text-navy", texto: "Com celeridade e compromisso," },
  { cor: "text-navy-bright", texto: "abrimos portas e" },
  { cor: "text-navy-bright", texto: "impulsionamos negócios." },
];

/*
  Não usa o componente Reveal de propósito: ele renderiza um <div>, e <div>
  dentro de <h2> é HTML inválido. Embrulhar o <h2> inteiro num Reveal
  revelaria tudo de uma vez, que é o oposto do pedido.

  Um observer só, no <h2>, com o escalonamento vindo de transitionDelay por
  linha. O inline-block é necessário porque transform não se aplica a
  elemento inline.

  A escala é `text-stat` (48 → 68), não `text-display` (44 → 88), porque
  a linha mais longa é larga: medida no navegador, "COM CELERIDADE E
  COMPROMISSO," ocupa 730px com a fonte no teto de 68px.

  Consequência medida, e que não dá para esconder: as três linhas só
  aparecem como três a partir de cerca de 810px de viewport. Em 1024px
  são três; em 768px a primeira reparte e viram quatro; em 375px viram
  sete. Forçar três em qualquer largura exigiria a fonte cair para perto
  de 21px no celular, menor que o H2 das seções — a assinatura da marca
  ficaria menor que os títulos, e por isso não foi feito.

  Ao conferir isso no navegador, conte linha com `Range.getClientRects()`
  agrupando por `top`. Estes spans são `block`, e `getClientRects()` no
  elemento devolve uma caixa por bloco, não por linha: ele responde "1"
  mesmo quando o texto reparte em três.

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
          className="font-heading text-stat font-bold uppercase"
        >
          {LINHAS.map((linha, i) => (
            <Fragment key={linha.texto}>
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
