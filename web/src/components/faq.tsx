import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

/*
  Quatro perguntas, na ordem em que aparecem na cabeça de quem está
  decidindo. Copy do cliente, verbatim.
*/
const PERGUNTAS = [
  {
    pergunta: "Antecipar recebíveis é a mesma coisa que contratar um empréstimo?",
    resposta:
      "Não. São operações diferentes. A principal diferença está na origem do dinheiro: na antecipação, você adianta um valor que já tem a receber por uma venda a prazo, como boletos ou cartões. No empréstimo, você recebe dinheiro do banco e cria uma nova dívida.",
  },
  {
    pergunta: "Preciso ter score alto ou CNPJ sem restrição?",
    resposta:
      "Não necessariamente. Na antecipação, a análise considera principalmente o recebível e o perfil de quem irá pagá-lo. Por isso, empresas que enfrentam dificuldades para obter crédito tradicional podem ter outras alternativas de acesso a recursos por meio da antecipação de recebíveis.",
  },
  {
    pergunta: "Quais recebíveis a Celer antecipa?",
    resposta:
      "Duplicatas, cheques, recebíveis de cartão de crédito e outros contratos. Se sua empresa tem valores a receber, fale com a nossa equipe para avaliar a operação.",
  },
  {
    pergunta: "Meu cliente vai saber que antecipei?",
    resposta:
      "Sim. A cessão do crédito é formalizada e a cobrança do recebível passa a ser realizada pela Celer no vencimento. É um procedimento usual em operações de antecipação e não altera as condições comerciais acordadas com seu cliente.",
  },
];

/**
 * Perguntas frequentes, em `<details>` nativo.
 *
 * Nativo de propósito, e não um acordeão em React: abre e fecha sem
 * JavaScript, já vem com o teclado e o papel de acessibilidade corretos, e
 * o Ctrl+F do navegador encontra texto dentro de item fechado — coisa que
 * um acordeão controlado por estado perde, porque o conteúdo nem está no
 * DOM. Numa seção cuja função é responder objeção antes da conversa, ser
 * encontrável importa mais que a animação.
 *
 * Isso também mantém a seção como Server Component.
 */
export function Faq() {
  return (
    <section id="faq" className="surface-wash-up">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <Reveal>
          {/* Caixa alta pela CSS, não digitada no texto — mesmo motivo do
              título da seção Processo. */}
          <h2 className="font-heading text-h2 text-center font-bold text-navy uppercase">
            Principais dúvidas sobre antecipação de recebíveis
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
            {PERGUNTAS.map(({ pergunta, resposta }) => (
              <details
                key={pergunta}
                /*
                  `group` e `open:` deixam o estado aberto estilizável sem
                  JavaScript. O `[&::-webkit-details-marker]:hidden` no
                  summary tira o triângulo padrão do Safari, que o
                  `list-none` sozinho não remove.
                */
                className="group rounded-2xl border border-navy/10 bg-white/70 px-6 open:bg-white sm:px-7"
              >
                <summary className="text-h3 flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold text-navy focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                  {pergunta}
                  {/*
                    O mais vira xis quando abre. Para conferir isso no
                    navegador, desligue a transição antes de medir: com ela
                    ligada, `getComputedStyle(...).rotate` logo depois de
                    abrir devolve `0deg`, que é o primeiro quadro da
                    animação e não o valor final. Ler esse `0deg` como
                    "a regra não existe" custou um diagnóstico errado aqui.
                  */}
                  <Plus
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gold-dark transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="text-body max-w-[68ch] pb-6 font-light text-navy/70">
                  {resposta}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
