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
    image: "/fotos/celeridade.webp",
    title: "Celeridade",
    description: "Operação confirmada até meio-dia, dinheiro transferido no mesmo dia.",
    icon: Zap,
  },
  {
    id: "confianca",
    image: "/fotos/confianca.webp",
    title: "Confiança",
    description: "A proposta que você recebe é o valor final, sem encargo aparecendo no fechamento.",
    icon: ShieldCheck,
  },
  {
    id: "compromisso",
    image: "/fotos/compromisso.webp",
    title: "Compromisso",
    description: "Quando não dá para aprovar, você ouve isso rápido e sabe o motivo.",
    icon: Target,
  },
  {
    id: "parceria",
    image: "/fotos/parceria.webp",
    title: "Parceria",
    description: "A gente aprende como sua empresa vende, e a segunda operação é mais simples que a primeira.",
    icon: Handshake,
  },
  {
    id: "crescimento",
    image: "/fotos/crescimento.webp",
    title: "Crescimento",
    description: "Quem antecipa com regularidade opera em condições melhores.",
    icon: TrendingUp,
  },
  {
    id: "excelencia",
    image: "/fotos/excelencia.webp",
    title: "Excelência",
    description: "Cada operação passa por uma pessoa, não por aprovação automática.",
    icon: Award,
  },
];

export function Valores() {
  return (
    <section id="valores" className="surface-wash-up">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
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
