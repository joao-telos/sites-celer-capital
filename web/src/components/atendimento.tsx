import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const POINTS = [
  "Atendimento direto com quem decide — sem call center, sem protocolo.",
  "Análise focada no seu recebível, não em burocracia que não tem a ver com o seu negócio.",
  "Resposta rápida, porque o problema não espera.",
];

export function Atendimento() {
  return (
    <section id="atendimento">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10 lg:py-24">
        <Reveal>
          <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
            Receba seu crédito quando você precisa dele
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-[1.7] font-light text-navy/70">
            Do outro lado, tem alguém que entende a urgência do seu negócio e
            resolve no seu tempo — rápido, direto, sem processo engessado.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mx-auto mt-10 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-start sm:justify-center sm:gap-8">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex max-w-[220px] items-start gap-2.5 text-left"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-gold-dark"
                  aria-hidden="true"
                />
                <span className="text-xs leading-[1.6] text-navy/70">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
