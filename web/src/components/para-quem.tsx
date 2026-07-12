import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const SEGMENTS = [
  {
    number: "01",
    tint: "bg-navy/[0.05]",
    numberColor: "text-navy/10",
    highlight: false,
    hook: "Fechou o pedido, mas o aço já venceu.",
    text: "Você vendeu a prazo pra outra empresa. O pagamento vem em 30 a 120 dias. Matéria-prima, folha e aluguel não esperam esse prazo.",
  },
  {
    number: "02",
    tint: "bg-navy/[0.06]",
    numberColor: "text-navy/10",
    highlight: false,
    hook: "Comprou estoque, vendeu a prazo, e agora?",
    text: "Ciclo de caixa longo: compra hoje, vende amanhã, recebe daqui a 90 dias. Nas datas de pico, esse intervalo trava a operação bem na hora que ela mais precisa girar.",
  },
  {
    number: "03",
    tint: "bg-navy/[0.05]",
    numberColor: "text-navy/10",
    highlight: false,
    hook: "Contrato fechado não é dinheiro em caixa.",
    text: "Prestou o serviço, assinou o contrato, mas o pagamento só cai daqui a 30 ou 60 dias.",
  },
  {
    number: "04",
    tint: "bg-gold/[0.12]",
    numberColor: "text-gold/25",
    highlight: true,
    hook: "Já ouviu não do banco?",
    text: "Score baixo, limite negado ou histórico manchado não são o fim da linha. A Celer analisa o recebível, não o seu CNPJ na Serasa.",
  },
];

export function ParaQuem() {
  return (
    <section id="para-quem">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:py-24">
        <Reveal>
          <h2 className="font-heading mx-auto mb-12 max-w-xl text-center text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:mb-14 lg:text-4xl">
            Feita pra quem vende a prazo e não pode esperar.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SEGMENTS.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.08}>
              <Card
                className={`relative h-full gap-0 rounded-3xl border-0 py-0 shadow-none ring-0 ${item.tint} ${item.highlight ? "border-t-4 border-gold" : ""}`}
              >
                <CardContent className="px-8 py-9 text-left">
                  <span
                    aria-hidden="true"
                    className={`font-heading pointer-events-none absolute top-6 right-7 text-5xl font-light ${item.numberColor}`}
                  >
                    {item.number}
                  </span>
                  <h3 className="relative mb-2.5 max-w-[80%] text-sm font-bold text-navy">
                    {item.hook}
                  </h3>
                  <p className="relative max-w-[85%] text-xs leading-[1.7] font-light text-navy/70">
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
