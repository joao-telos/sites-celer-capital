import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

const SITUATIONS = [
  {
    number: "01",
    border: "border-l-gold",
    title: "Caixa apertado, recebíveis a prazo",
    text: "Sua operação vendeu bem, mas o dinheiro só entra no mês que vem. O capital de giro não espera.",
  },
  {
    number: "02",
    border: "border-l-teal",
    title: "Oportunidade que não pode esperar",
    text: "Fornecedor com desconto à vista, estoque para repor, contrato novo para bancar. Velocidade é vantagem competitiva.",
  },
  {
    number: "03",
    border: "border-l-navy/30",
    title: "O banco não foi uma opção viável",
    text: "Burocracia excessiva, prazo longo, exigências que travam. A Celer analisa o recebível, não o seu CNPJ na Serasa.",
  },
  {
    number: "04",
    border: "border-l-silver",
    title: "Gestão de fluxo de caixa recorrente",
    text: "Empresas que vendem muito a prazo usam antecipação como ferramenta estratégica de capital de giro — não como emergência.",
  },
];

export function ParaQuem() {
  return (
    <section id="para-quem" className="bg-cream">
      <div className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <div className="mb-12 max-w-xl lg:mb-14">
            <p className="mb-4 flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gold uppercase">
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
              Para quem
            </p>
            <h2 className="font-heading text-[1.75rem] leading-[1.2] font-semibold text-navy sm:text-3xl lg:text-4xl">
              Situações em que a Celer resolve.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-px sm:grid-cols-2">
          {SITUATIONS.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.08}>
              <Card
                className={`relative gap-0 rounded-none border-0 border-l-4 bg-white py-0 shadow-none ring-0 ${item.border}`}
              >
                <CardContent className="px-8 py-9">
                  <span
                    aria-hidden="true"
                    className="font-heading pointer-events-none absolute top-6 right-6 text-5xl font-light text-navy/5"
                  >
                    {item.number}
                  </span>
                  <h3 className="relative mb-2.5 max-w-[80%] text-sm font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="relative max-w-[85%] text-xs leading-[1.7] font-light text-[#666]">
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
