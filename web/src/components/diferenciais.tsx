import { Reveal } from "@/components/motion/reveal";

const ROWS = [
  {
    label: "Prazo de aprovação",
    celer: "Horas",
    banco: "5 a 15 dias úteis",
  },
  {
    label: "Base da análise",
    celer: "Qualidade dos recebíveis",
    banco: "Histórico de crédito, score, garantias",
  },
  {
    label: "Burocracia",
    celer: "Mínima. WhatsApp resolve.",
    banco: "Formulários, documentações, visitas",
  },
  {
    label: "Atendimento",
    celer: "Direto com quem decide",
    banco: "Call center, protocolo, fila",
  },
];

export function Diferenciais() {
  return (
    <section id="diferenciais">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 lg:py-24">
        <Reveal>
          <div className="mx-auto mb-12 max-w-xl text-center lg:mb-14">
            <p className="mb-4 flex items-center justify-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gold uppercase">
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
              Por que a Celer
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
            </p>
            <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
              O que muda quando você não vai ao banco.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-3xl bg-white px-6 py-2 shadow-[0_20px_60px_-30px_rgba(1,30,46,0.25)] sm:px-10">
            <table className="w-full min-w-[480px] border-collapse">
              <caption className="sr-only">
                Comparação entre a Celer Capital e um banco tradicional em
                prazo de aprovação, base da análise, burocracia e
                atendimento
              </caption>
              <thead>
                <tr className="border-b border-navy/8">
                  <th scope="col" className="w-1/3 py-4 text-left">
                    <span className="sr-only">Critério</span>
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 py-4 text-left text-[9px] font-bold tracking-[0.25em] text-gold uppercase"
                  >
                    Celer Capital
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 py-4 text-left text-[9px] font-bold tracking-[0.25em] text-navy/30 uppercase"
                  >
                    Banco tradicional
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-navy/[0.05] last:border-0">
                    <th
                      scope="row"
                      className="py-6 pr-4 text-left text-xs font-semibold text-navy/70"
                    >
                      {row.label}
                    </th>
                    <td className="py-6 pr-4 text-sm text-navy">{row.celer}</td>
                    <td className="py-6 text-sm leading-[1.5] font-light text-navy/65 line-through decoration-navy/25">
                      <span className="sr-only">Não: </span>
                      {row.banco}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
