import { Check, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const LOAN_POINTS = [
  "Você pega dinheiro emprestado — cria uma dívida nova",
  "Juros incidem sobre o tempo que o dinheiro fica com você",
  "O banco avalia seu histórico de crédito e score",
];

const CELER_POINTS = [
  "Você recebe algo que já é seu — o recebível já existe",
  "A Celer compra o recebível a um desconto, sem juros compostos",
  "A análise é sobre o recebível, não sobre o seu histórico bancário",
];

export function QuebraObjecao() {
  return (
    <section id="nao-e-emprestimo" className="bg-white">
      <div className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <div className="mx-auto mb-14 max-w-xl text-center lg:mb-16">
            <p className="mb-4 flex items-center justify-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gold uppercase">
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
              Quebra de objeção
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
            </p>
            <h2 className="font-heading text-[1.75rem] leading-[1.2] font-semibold text-navy sm:text-3xl lg:text-4xl">
              Antecipação não é dívida.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-[1.7] font-light text-[#666]">
              É a dúvida mais comum de quem nunca antecipou recebíveis — e a
              resposta é simples: é receber hoje o que já é seu por direito.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Reveal delay={0}>
            <Card className="h-full gap-0 rounded-none border-0 bg-[#F5F5F2] py-0 shadow-none ring-0">
              <CardContent className="flex h-full flex-col px-8 py-9">
                <h3 className="mb-5 text-sm font-bold tracking-wide text-navy/70 uppercase">
                  Empréstimo
                </h3>
                <ul className="flex flex-col gap-4">
                  {LOAN_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <X
                        className="mt-0.5 size-4 shrink-0 text-navy/40"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-[1.6] text-navy/70">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="h-full gap-0 rounded-none border-0 border-t-4 border-gold bg-navy py-0 shadow-none ring-0">
              <CardContent className="flex h-full flex-col px-8 py-9">
                <h3 className="mb-5 text-sm font-bold tracking-wide text-gold uppercase">
                  Antecipação com a Celer
                </h3>
                <ul className="flex flex-col gap-4">
                  {CELER_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-gold"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-[1.6] text-white/80">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
