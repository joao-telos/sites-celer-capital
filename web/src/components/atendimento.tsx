"use client";

import { Fragment } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

/*
  A tagline é a assinatura institucional da marca. Saiu do rodapé nesta
  rodada: com esta seção, ela apareceria duas vezes separadas apenas pelo
  CTA Final, praticamente na mesma rolagem.
*/
const LINHAS = [
  { cor: "text-navy", palavras: ["Conectando", "Valor,"] },
  { cor: "text-navy-bright", palavras: ["Crescendo", "Juntos"] },
];

/*
  Não usa o componente Reveal de propósito: ele renderiza um <div>, e <div>
  dentro de <h2> é HTML inválido. Embrulhar o <h2> inteiro num Reveal
  revelaria tudo de uma vez, que é o oposto do pedido.

  Um observer só, no <h2>, com o escalonamento vindo de transitionDelay por
  palavra. O inline-block é necessário porque transform não se aplica a
  elemento inline.

  prefers-reduced-motion já é coberto pela regra global do globals.css:
  aqui a animação é transição CSS, não JS.
*/
export function Atendimento() {
  const { ref, inView } = useInViewOnce<HTMLHeadingElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section id="atendimento" className="surface-wash-up">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center sm:px-10 lg:py-10">
        <h2
          ref={ref}
          className="font-heading text-display font-bold uppercase"
        >
          {LINHAS.map((linha, indiceLinha) => {
            const palavrasAntes = LINHAS.slice(0, indiceLinha).reduce(
              (total, l) => total + l.palavras.length,
              0
            );

            return (
              <Fragment key={linha.cor}>
                {/* Mesmo motivo do espaço entre palavras: a linha seguinte
                    é "block" (quebra visual), mas isso não insere separador
                    no textContent entre a última palavra de uma linha e a
                    primeira da próxima ("Valor,Crescendo" sem isto). */}
                {indiceLinha > 0 ? " " : null}
                <span className={cn("block", linha.cor)}>
                  {linha.palavras.map((palavra, indicePalavra) => (
                    <Fragment key={palavra}>
                      {/* Espaço real entre as palavras, não margem. Spans
                          inline-block colados produzem textContent sem
                          separação ("ConectandoValor"), e é isso que o
                          leitor de tela anuncia e que o usuário copia. */}
                      {indicePalavra > 0 ? " " : null}
                      <span
                        style={{
                          transitionDelay: `${(palavrasAntes + indicePalavra) * 0.12}s`,
                        }}
                        className={cn(
                          "inline-block transition-all duration-500 ease-out",
                          inView
                            ? "translate-y-0 opacity-100 blur-none"
                            : "translate-y-2 opacity-0 blur-sm"
                        )}
                      >
                        {palavra}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </Fragment>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
