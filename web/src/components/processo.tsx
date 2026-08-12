import { Reveal } from "@/components/motion/reveal";
import { RetratoRecortado } from "@/components/ui/retrato-recortado";

const STEPS = [
  {
    title: "Você vende a prazo",
    text: "Seu cliente compra e paga em 30, 60 ou 90 dias. A venda está feita, a nota está emitida, o dinheiro ainda não chegou.",
  },
  {
    title: "Manda os documentos pelo WhatsApp",
    text: "Duplicata, nota fiscal ou cheque, o que você tiver da venda. A análise é da qualidade do recebível e de quem vai pagar por ele.",
  },
  {
    title: "Proposta em horas, não em dias",
    text: "Taxa, prazo e valor líquido na mesma mensagem. Esse é o valor final: não tem taxa de análise, taxa de cadastro nem encargo aparecendo no fechamento. Se fizer sentido, você confirma na hora.",
  },
  {
    title: "O dinheiro na sua conta",
    text: "Operação confirmada até meio-dia, transferência no mesmo dia. Seu caixa volta a rodar: paga o fornecedor, compra o material, aceita o pedido grande.",
  },
  {
    // A pendência "confirmar se a cobrança no vencimento é feita pela Celer"
    // foi respondida pelo cliente em 2026-08-06: é.
    title: "A cobrança é com a gente",
    text: "No vencimento, a Celer cobra direto do seu cliente. Você não entra nessa conversa.",
  },
];

export function Processo() {
  return (
    <section id="processo" className="surface-wash-down relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 z-0 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,26,75,0.06)_0%,transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <Reveal>
          <div className="mb-14 text-center lg:mb-16">
            <h2 className="font-heading text-h2 font-bold text-navy">
              Do contrato fechado ao capital na conta.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-14">
          <ol className="relative flex flex-col">
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-6 w-px bg-gold/30"
            />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <li className="grid grid-cols-[48px_1fr] gap-6 pb-11 last:pb-0 sm:gap-7">
                  <span className="font-heading relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-white text-2xl font-bold text-gold-dark shadow-sm">
                    {i + 1}
                  </span>
                  <div className="pt-1.5 text-left">
                    <h3 className="text-h3 mb-1.5 font-bold text-navy">
                      {step.title}
                    </h3>
                    <p className="text-body max-w-[68ch] font-light text-navy/70">
                      {step.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <RetratoRecortado
            src="/fotos/dono.webp"
            alt="Dono de empresa segurando um tablet"
            sizes="(min-width: 1024px) 22rem, 100vw"
            className="lg:sticky lg:top-28"
          />
        </div>
      </div>
    </section>
  );
}
