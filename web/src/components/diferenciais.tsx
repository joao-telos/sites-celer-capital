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
    <section id="diferenciais" className="relative overflow-hidden bg-navy">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 size-[320px] rounded-full bg-[radial-gradient(circle,rgba(153,101,21,0.06)_0%,transparent_65%)]"
      />

      <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal>
          <div className="mb-12 max-w-xl lg:mb-14">
            <p className="mb-4 flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gold uppercase">
              <span className="h-px w-5 bg-gold" aria-hidden="true" />
              Por que a Celer
            </p>
            <h2 className="font-heading text-[1.75rem] leading-[1.2] font-semibold text-white sm:text-3xl lg:text-4xl">
              O que muda quando você não vai ao banco.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <caption className="sr-only">
                Comparação entre a Celer Capital e um banco tradicional em
                prazo de aprovação, base da análise, burocracia e
                atendimento
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="w-1/3 py-3 text-left">
                    <span className="sr-only">Critério</span>
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 py-3 text-left text-[9px] font-bold tracking-[0.25em] text-gold uppercase"
                  >
                    Celer Capital
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 py-3 text-left text-[9px] font-bold tracking-[0.25em] text-white/25 uppercase"
                  >
                    Banco tradicional
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.06]">
                    <th
                      scope="row"
                      className="py-7 pr-4 text-left text-xs font-semibold text-white/50"
                    >
                      {row.label}
                    </th>
                    <td className="py-7 pr-4 text-sm text-white">
                      {row.celer}
                    </td>
                    <td className="py-7 text-sm leading-[1.5] font-light text-white/25 line-through decoration-white/10">
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
