import { Reveal } from "@/components/motion/reveal";

/*
  Missão e Visão reusam a mesma dupla de tints de "Para Quem" (navy suave +
  gold suave) para a seção não introduzir vocabulário visual novo.
*/
const PILARES = [
  {
    title: "Missão",
    tint: "bg-linear-to-br from-navy/[0.07] to-navy/[0.015]",
    text: "Impulsionar empresas por meio da antecipação de recebíveis e de soluções financeiras inteligentes, oferecendo agilidade, segurança e compromisso para fortalecer negócios, gerar oportunidades e construir parcerias duradouras.",
  },
  {
    title: "Visão",
    tint: "bg-linear-to-br from-gold/[0.16] to-gold/[0.05]",
    text: "Ser a principal parceira financeira das empresas brasileiras, sendo referência em antecipação de recebíveis e reconhecida pela confiança, agilidade e excelência, ampliando nossa atuação com soluções financeiras estratégicas que impulsionem o crescimento sustentável de nossos clientes.",
  },
];

/*
  Duas exceções deliberadas ao manual de marca, ambas pedido do cliente
  (2026-07-31) e registradas em docs/brand-guidelines.md:
  1. É a única seção com título alinhado à esquerda — o manual pede blocos
     de seção centralizados.
  2. O parágrafo explica brevemente o mecanismo da antecipação, que o pivô
     v3 tinha removido do site por considerar redundante para o público.
*/
export function Sobre() {
  return (
    <section id="sobre" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <div className="text-left">
              <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
                Sobre nós
              </h2>
              <p className="mt-5 text-lg leading-[1.35] font-light text-navy sm:text-xl">
                Com celeridade e compromisso, abrimos portas e impulsionamos
                negócios.
              </p>
              <p className="mt-5 max-w-lg text-base leading-[1.6] font-light text-navy/70">
                Sua empresa não precisa esperar 30, 60 ou 90 dias para receber
                pelas vendas já realizadas. Com a Celer, suas vendas a prazo se
                transformam em capital imediato para impulsionar o seu negócio.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {PILARES.map((pilar, i) => (
              <Reveal key={pilar.title} delay={0.1 + i * 0.08}>
                <div className={`rounded-3xl px-7 py-8 ${pilar.tint}`}>
                  <h3 className="font-heading text-xl font-bold text-navy">
                    {pilar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] font-light text-navy/70">
                    {pilar.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
