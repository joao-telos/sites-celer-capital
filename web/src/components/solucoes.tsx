import { Banknote, FileSignature, FileText, Receipt } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const SOLUTIONS = [
  {
    icon: FileText,
    title: "Duplicatas",
    text: "Venda B2B a prazo, formalizada em duplicata. O caso mais comum na indústria e na distribuição.",
  },
  {
    icon: Receipt,
    title: "Notas fiscais a prazo",
    text: "Nota emitida, pagamento combinado pra daqui a 30, 60 ou 90 dias.",
  },
  {
    icon: Banknote,
    title: "Cheques pré-datados",
    text: "Cheque na mão, mas só compensa lá na frente.",
  },
  {
    icon: FileSignature,
    title: "Contratos e mensalidades",
    text: "Prestou o serviço, assinou o contrato, mas o pagamento é recorrente ou diferido. Vale tanto quanto uma nota fiscal.",
  },
];

export function Solucoes() {
  return (
    <section id="solucoes">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:py-20">
        {/* Título só para leitores de tela — o pedido foi não ter H2/subtítulo visíveis, mas a seção precisa de um nome acessível */}
        <h2 className="sr-only">O que a Celer antecipa</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOLUTIONS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <Card className="h-full gap-0 rounded-3xl border-0 bg-navy/[0.04] py-0 shadow-none ring-0">
                <CardContent className="flex h-full flex-col items-start gap-4 px-8 py-9 text-left">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-[1.7] font-light text-navy/70">
                      {item.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
