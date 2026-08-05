"use client";

import {
  Award,
  Handshake,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import {
  InteractiveAccordion,
  type AccordionPanel,
} from "@/components/ui/interactive-accordion";

/*
  Compromisso usa Target, e não um segundo ícone de aperto de mão, para não
  colidir visualmente com Parceria.
*/
const VALORES: AccordionPanel[] = [
  {
    id: "celeridade",
    title: "Celeridade",
    description: "Agilidade com responsabilidade em cada solução.",
    icon: Zap,
  },
  {
    id: "confianca",
    title: "Confiança",
    description: "Transparência, ética e credibilidade em todas as relações.",
    icon: ShieldCheck,
  },
  {
    id: "compromisso",
    title: "Compromisso",
    description: "Dedicação para superar expectativas e gerar resultados.",
    icon: Target,
  },
  {
    id: "parceria",
    title: "Parceria",
    description: "Construímos relações sólidas que impulsionam resultados.",
    icon: Handshake,
  },
  {
    id: "crescimento",
    title: "Crescimento",
    description: "Evoluímos junto com nossos clientes e parceiros.",
    icon: TrendingUp,
  },
  {
    id: "excelencia",
    title: "Excelência",
    description: "Qualidade e melhoria contínua em tudo o que fazemos.",
    icon: Award,
  },
];

export function Valores() {
  return (
    <section id="valores" className="surface-wash-up">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <h2 className="font-heading text-h2 mb-10 text-center font-bold text-navy lg:mb-12">
            Nossos valores
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <InteractiveAccordion panels={VALORES} />
        </Reveal>
      </div>
    </section>
  );
}
