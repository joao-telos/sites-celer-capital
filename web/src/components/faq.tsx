import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

/*
  Seis perguntas, na ordem em que aparecem na cabeça de quem está
  decidindo. A terceira é onde o cadastro entra sem virar seção e sem
  prometer nada que não se cumpra.

  Copy do cliente, verbatim.
*/
const PERGUNTAS = [
  {
    pergunta: "Antecipar recebível é a mesma coisa que empréstimo?",
    resposta:
      "Não. No empréstimo o banco te dá dinheiro novo e você devolve com juros, e isso entra como dívida. Na antecipação você vende para a Celer um crédito que já é seu, de uma venda que já aconteceu. Não entra dívida nova no balanço e não tem IOF.",
  },
  {
    pergunta: "Preciso ter score alto ou CNPJ sem restrição?",
    resposta:
      "A análise principal é do recebível e de quem vai pagar por ele. Muita empresa que ouviu não do banco por causa de score consegue operar com a Celer, porque o que sustenta a operação é a venda que você já fez.",
  },
  {
    pergunta: "Quanto tempo leva até o dinheiro cair na conta?",
    resposta:
      "Operação enviada até meio-dia, transferência no mesmo dia. A primeira operação leva um pouco mais, porque envolve o cadastro da empresa. A partir da segunda, é sempre nesse ritmo.",
  },
  {
    pergunta: "Que tipo de recebível a Celer aceita?",
    resposta:
      "Duplicata, nota fiscal e cheque de venda B2B. Se você vendeu para outra empresa com prazo de 30 a 120 dias, provavelmente dá para antecipar. Na dúvida, manda no WhatsApp que a gente olha.",
  },
  {
    pergunta: "Preciso dar algum bem em garantia?",
    resposta:
      "Não. O recebível é a garantia da operação. Você não assina alienação de imóvel, de veículo nem de patrimônio pessoal.",
  },
  {
    pergunta: "Meu cliente vai saber que eu antecipei?",
    resposta:
      "Sim. A cessão do crédito é formalizada e a cobrança passa a ser feita pela Celer no vencimento. É um procedimento comum entre empresas e não muda nada na relação comercial que você já tem com ele.",
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
    <section id="faq" className="surface-wash-down">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <Reveal>
          <h2 className="font-heading text-h2 text-center font-bold text-navy">
            Perguntas que a gente ouve todo dia
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
