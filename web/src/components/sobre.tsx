import { Reveal } from "@/components/motion/reveal";
import { SOBRE_BOX_GRADIENT } from "@/components/ui/gradient-background";

/*
  Missão e Visão agora são caixas cream sólidas dentro da caixa navy. Os
  tints em gradiente que elas usavam antes (navy suave e gold suave) foram
  desenhados para caixa translúcida sobre fundo claro: aqui o fundo atrás
  delas é a caixa navy, onde um tint navy translúcido sumiria e o dourado
  brigaria com a seção Números logo abaixo.
*/
const PILARES = [
  {
    title: "Missão",
    text: "Impulsionar empresas por meio da antecipação de recebíveis e de soluções financeiras inteligentes, oferecendo agilidade, segurança e compromisso para fortalecer negócios, gerar oportunidades e construir parcerias duradouras.",
  },
  {
    title: "Visão",
    text: "Ser a principal parceira financeira das empresas brasileiras, sendo referência em antecipação de recebíveis e reconhecida pela confiança, agilidade e excelência, ampliando nossa atuação com soluções financeiras estratégicas que impulsionem o crescimento sustentável de nossos clientes.",
  },
];

/*
  Duas exceções deliberadas ao manual de marca, ambas pedido do cliente e
  registradas em docs/brand-guidelines.md:
  1. É a única seção com título alinhado à esquerda — o manual pede blocos
     de seção centralizados.
  2. O parágrafo explica brevemente o mecanismo da antecipação, que o pivô
     v3 tinha removido do site por considerar redundante para o público.

  O gradiente da caixa usa 135°, não os 90° dos dois bookends: aqueles são
  fundo de seção inteira, onde o movimento horizontal funciona na largura
  toda; uma caixa arredondada lê melhor na diagonal.
*/
export function Sobre() {
  return (
    <section id="sobre" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <div
            className="rounded-[2rem] px-8 py-12 sm:px-12 lg:px-14 lg:py-14"
            style={{ background: SOBRE_BOX_GRADIENT }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="text-left">
                <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-white sm:text-3xl lg:text-4xl">
                  Sobre nós
                </h2>
                <p className="mt-5 text-lg leading-[1.35] font-light text-white sm:text-xl">
                  Com celeridade e compromisso, abrimos portas e impulsionamos
                  negócios.
                </p>
                <p className="mt-5 max-w-lg text-base leading-[1.6] font-light text-white/70">
                  Sua empresa não precisa esperar 30, 60 ou 90 dias para receber
                  pelas vendas já realizadas. Com a Celer, suas vendas a prazo
                  se transformam em capital imediato para impulsionar o seu
                  negócio.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {PILARES.map((pilar) => (
                  <div
                    key={pilar.title}
                    className="rounded-2xl bg-cream px-7 py-7"
                  >
                    <h3 className="font-heading text-xl font-bold text-navy">
                      {pilar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] font-light text-navy/70">
                      {pilar.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
