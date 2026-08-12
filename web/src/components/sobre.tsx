import Image from "next/image";

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
    text: "Transformar vendas já realizadas em capital disponível, para que pequenas e médias empresas não precisem interromper a operação por causa de um prazo de pagamento. Fazemos isso com processo curto, resposta rápida e uma pessoa acompanhando cada operação do começo ao fim.",
  },
  {
    title: "Visão",
    text: "Ser a primeira empresa em que o dono de indústria e de distribuidora do Paraná pensa quando o caixa aperta. Crescer junto com essas empresas, ampliando o que conseguimos oferecer conforme elas crescem, sem abrir mão do atendimento direto que nos trouxe até aqui.",
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
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] px-8 py-12 sm:px-12 lg:px-14 lg:py-14">
            {/*
              A foto é fundo, não conteúdo: aria-hidden e sem alt útil. O
              desfoque é sutil de propósito — o suficiente para a textura do
              aperto de mão não competir com o texto, e não tanto que a
              imagem vire mancha.

              scale-105 existe por causa do blur: o desfoque puxa pixels de
              fora da borda, e sem a folga aparece uma faixa clara nos
              quatro lados da caixa.
            */}
            <Image
              src="/fotos/sobre-fundo.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="scale-105 object-cover blur-[3px]"
            />

            {/*
              O gradiente da marca vira véu por cima da foto, em vez de
              fundo sólido. Em 0.88 o texto branco continua com o mesmo
              contraste de antes: o que passa é a forma da imagem, não o
              brilho dela.
            */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: SOBRE_BOX_GRADIENT, opacity: 0.88 }}
            />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="flex flex-col gap-6">
                <div className="text-left">
                  <h2 className="font-heading text-h2 font-bold text-white">
                    Sobre nós
                  </h2>
                  <p className="text-lead mt-5 font-light text-white">
                    Com celeridade e compromisso, abrimos portas e impulsionamos
                    negócios.
                  </p>
                  <p className="text-body mt-5 max-w-[68ch] font-light text-white/70">
                    A Celer nasceu em Curitiba, em 2017, dentro de um problema
                    que os sócios viram de perto ao longo de mais de 30 anos no
                    mercado de recebíveis: empresa saudável, com pedido fechado
                    e nota emitida, parada porque o banco olha o score e não
                    olha a venda.
                  </p>
                  <p className="text-body mt-4 max-w-[68ch] font-light text-white/70">
                    Desde então foram mais de R$ 1 bilhão antecipados para
                    indústrias e distribuidoras que faturam bem e ainda assim
                    ficam sem caixa no meio do mês. A operação continua a mesma
                    de quando começamos: você fala com uma pessoa, não com um
                    formulário.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {PILARES.map((pilar) => (
                  <div
                    key={pilar.title}
                    className="rounded-2xl bg-cream px-7 py-7"
                  >
                    <h3 className="font-heading text-h3 font-bold text-navy">
                      {pilar.title}
                    </h3>
                    <p className="text-body mt-3 max-w-[68ch] font-light text-navy/70">
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
