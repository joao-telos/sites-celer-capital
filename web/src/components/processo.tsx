import { Reveal } from "@/components/motion/reveal";
import { RetratoRecortado } from "@/components/ui/retrato-recortado";

const STEPS = [
  {
    title: "Seu cliente fecha o contrato com parcelamento",
    text: "Você vende a prazo: nota fiscal, cheque pré, duplicata. O pagamento virá em 30, 60 ou 90 dias. O recebível existe, o caixa ainda não.",
  },
  {
    title: "Você cede os recebíveis à Celer",
    text: "Nos envia os documentos pelo WhatsApp. Analisamos a qualidade dos recebíveis, não o seu histórico bancário.",
  },
  {
    title: "Proposta em horas, não em dias",
    text: "Você recebe a proposta com taxa, prazo e valor líquido. Transparente. Se fizer sentido, confirma na hora.",
  },
  {
    title: "Capital na sua conta",
    text: "O valor é transferido. Seu negócio volta a ter liquidez para operar, crescer ou aproveitar oportunidades.",
  },
  {
    // TODO: confirmar com o cliente se a cobrança do devedor no vencimento é feita pela Celer
    title: "A Celer cuida do restante",
    text: "No vencimento, cobramos diretamente do seu cliente. Você não precisa se preocupar com a gestão da cobrança.",
  },
];

export function Processo() {
  return (
    <section id="processo" className="surface-wash-down relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 z-0 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,26,75,0.06)_0%,transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
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
