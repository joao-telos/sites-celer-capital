import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const SEGMENTS = [
  {
    number: "01",
    tint: "bg-linear-to-br from-navy/[0.07] to-navy/[0.015]",
    numberColor: "text-navy/10",
    highlight: false,
    hook: "Fechou o contrato. O pagamento só vem depois.",
    text: "Entregou o produto ou prestou o serviço, mas o combinado foi receber em 30, 60 ou 90 dias. O trabalho está feito, o caixa ainda não sentiu.",
  },
  {
    number: "02",
    tint: "bg-linear-to-br from-navy/[0.08] to-navy/[0.02]",
    numberColor: "text-navy/10",
    highlight: false,
    hook: "Apareceram clientes novos. O caixa aguenta mais um?",
    text: "Cada contrato novo a prazo é bom sinal, mas atender todos ao mesmo tempo exige caixa disponível, e nem sempre dá pra saber se ele aguenta.",
  },
  {
    number: "03",
    tint: "bg-linear-to-br from-gold/[0.16] to-gold/[0.05]",
    numberColor: "text-gold/25",
    highlight: true,
    hook: "Já ouviu não do banco?",
    text: "Score baixo, limite negado ou histórico manchado não são o fim da linha. A Celer analisa o recebível, não o seu CNPJ na Serasa.",
  },
];

export function ParaQuem() {
  return (
    <section id="para-quem" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <h2 className="font-heading mx-auto mb-10 max-w-xl text-center text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:mb-12 lg:text-4xl">
            Feita pra quem vende a prazo e não pode esperar.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SEGMENTS.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.08}>
              <Card
                className={`relative h-full gap-0 rounded-3xl border-0 bg-transparent py-0 shadow-none ring-0 ${item.tint} ${item.highlight ? "border-t-4 border-gold" : ""}`}
              >
                <CardContent className="px-7 py-9 text-left">
                  <span
                    aria-hidden="true"
                    className={`font-heading pointer-events-none absolute top-6 right-6 text-5xl font-light ${item.numberColor}`}
                  >
                    {item.number}
                  </span>
                  <h3 className="relative mb-2.5 max-w-[85%] text-base font-bold text-navy">
                    {item.hook}
                  </h3>
                  <p className="relative text-sm leading-[1.6] font-light text-navy/70">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
