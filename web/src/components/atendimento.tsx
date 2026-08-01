"use client";

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
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <h2
          ref={ref}
          className="font-heading text-4xl leading-[1.05] font-bold uppercase sm:text-6xl lg:text-7xl"
        >
          {LINHAS.map((linha, indiceLinha) => {
            const palavrasAntes = LINHAS.slice(0, indiceLinha).reduce(
              (total, l) => total + l.palavras.length,
              0
            );

            return (
              <span key={linha.cor} className={cn("block", linha.cor)}>
                {linha.palavras.map((palavra, indicePalavra) => (
                  <span
                    key={palavra}
                    style={{
                      transitionDelay: `${(palavrasAntes + indicePalavra) * 0.12}s`,
                    }}
                    className={cn(
                      "mr-[0.25em] inline-block transition-all duration-500 ease-out last:mr-0",
                      inView
                        ? "translate-y-0 opacity-100 blur-none"
                        : "translate-y-2 opacity-0 blur-sm"
                    )}
                  >
                    {palavra}
                  </span>
                ))}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
