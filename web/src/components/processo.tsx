import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    color: "gold" as const,
    title: "Seu cliente fecha o contrato com parcelamento",
    text: "Você vende a prazo — nota fiscal, cheque pré, duplicata. O pagamento virá em 30, 60 ou 90 dias. O recebível existe, o caixa ainda não.",
  },
  {
    color: "gold" as const,
    title: "Você cede os recebíveis à Celer",
    text: "Nos envia os documentos pelo WhatsApp. Analisamos a qualidade dos recebíveis — não o seu histórico bancário.",
  },
  {
    color: "navy" as const,
    title: "Proposta em horas, não em dias",
    text: "Você recebe a proposta com taxa, prazo e valor líquido. Transparente. Se fizer sentido, confirma na hora.",
  },
  {
    color: "navy" as const,
    title: "Capital na sua conta",
    text: "O valor é transferido. Seu negócio volta a ter liquidez para operar, crescer ou aproveitar oportunidades.",
  },
  {
    color: "muted" as const,
    // TODO: confirmar com o cliente se a cobrança do devedor no vencimento é feita pela Celer
    title: "A Celer cuida do restante",
    text: "No vencimento, cobramos diretamente do seu cliente. Você não precisa se preocupar com a gestão da cobrança.",
  },
];

const DOT_STYLES = {
  gold: "border-gold bg-gold/10 text-gold-dark",
  navy: "border-navy bg-navy/10 text-navy",
  muted: "border-navy/15 bg-navy/5 text-navy/35",
};

export function Processo() {
  return (
    <section id="processo" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,26,75,0.06)_0%,transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 sm:px-10 lg:py-24">
        <Reveal>
          <div className="mb-14 text-center lg:mb-16">
            <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
              Do contrato fechado ao capital na conta.
            </h2>
          </div>
        </Reveal>

        <ol className="relative flex flex-col">
          <div
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-5 w-px bg-gradient-to-b from-gold via-navy/40 to-navy/5"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <li className="grid grid-cols-[40px_1fr] gap-6 pb-11 last:pb-0 sm:gap-7">
                <span
                  className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] font-heading text-xl font-bold ${DOT_STYLES[step.color]}`}
                >
                  {i + 1}
                </span>
                <div className="pt-1.5 text-left">
                  <h3 className="mb-1.5 text-[15px] font-bold tracking-[0.2px] text-navy">
                    {step.title}
                  </h3>
                  <p className="max-w-[440px] text-xs leading-[1.7] font-light text-navy/70">
                    {step.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
