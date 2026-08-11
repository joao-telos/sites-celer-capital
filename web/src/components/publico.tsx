import { Reveal } from "@/components/motion/reveal";

/*
  Substituiu a seção Soluções, que trazia o diagrama de feixes ligando
  duplicatas, notas, cheques e contratos até a Celer. Os quatro tipos de
  recebível não se perderam: o passo 1 da seção Processo já os nomeia.

  Herdou o `surface-wash-down` da seção que saiu. As seções alternam wash,
  então trocar o sentido aqui obrigaria a rederivar a alternância até o
  CTA Final.

  A copy é do cliente e é verbatim. Inclusive o travessão, que o manual
  desaconselha em texto visível: copy do cliente ganha da regra de estilo.
*/
export function Publico() {
  return (
    <section id="publico" className="surface-wash-down">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center sm:px-10 lg:py-10">
        <Reveal>
          <h2 className="font-heading text-h2 mx-auto max-w-[20ch] font-bold text-navy">
            Pensada para quem decide sozinho.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          {/*
            Um traço dourado curto entre título e corpo. A seção não tem
            foto nem diagrama, então sem ele o bloco vira dois parágrafos
            soltos no meio de uma página que, em toda seção vizinha, tem
            algo para olhar.
          */}
          <div
            aria-hidden="true"
            className="mx-auto mt-8 h-px w-24 bg-linear-to-r from-transparent via-gold to-transparent"
          />
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lead mx-auto mt-8 max-w-[62ch] font-light text-navy/70">
            Quem chega até a Celer já fechou o pedido, já emitiu a nota e já
            sentiu o prazo de 90 dias apertar o caixa. São donos de indústria e
            distribuidora que resolvem tudo sem comitê, sem sócio pra dividir a
            decisão, sem tempo pra explicar o negócio duas vezes. A Celer
            entende que esse dinheiro já é seu — o trabalho é fazer ele chegar
            antes que o problema apareça.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
