"use client";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppMock } from "@/components/whatsapp-mock";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// TODO: substituir por logos reais de clientes/parceiros assim que o cliente confirmar quais podem ser exibidos
const PARTNER_LOGOS = ["Parceiro A", "Parceiro B", "Parceiro C", "Parceiro D"];

export function Hero() {
  const reducedMotion = useReducedMotion();
  const headlineLine1 = "O capital que já é seu não deveria";
  const headlineLine2 = "esperar.";

  return (
    <section className="relative overflow-hidden bg-navy">
      {/* brilho radial sutil no canto superior direito — puramente decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(153,101,21,0.12)_0%,transparent_65%)]"
      />

      <div className="grid lg:grid-cols-[55%_45%]">
        {/* Painel esquerdo — headline, CTA. Textura pontilhada só a partir de lg (regra de UI/UX: desligar decoração em telas pequenas) */}
        <div className="relative z-10 flex flex-col justify-center gap-7 px-6 py-16 sm:px-10 lg:bg-dot-grid lg:px-16 lg:py-24">
          <Reveal delay={0}>
            <Badge
              variant="outline"
              className="gap-2 rounded-none border-gold/40 bg-transparent px-0 py-0 text-[10px] font-bold tracking-[0.2em] text-gold uppercase"
            >
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
              Securitizadora
            </Badge>
          </Reveal>

          <h1 className="font-heading text-[2.125rem] leading-[1.05] font-semibold text-white sm:text-5xl lg:text-[3.5rem]">
            {reducedMotion ? (
              <>
                {headlineLine1}
                <br />
                <span className="text-gold italic">{headlineLine2}</span>
              </>
            ) : (
              <>
                <TextAnimate as="span" by="word" animation="slideUp" duration={0.6} once>
                  {headlineLine1}
                </TextAnimate>{" "}
                <br />
                <TextAnimate
                  as="span"
                  by="word"
                  animation="slideUp"
                  duration={0.3}
                  delay={0.65}
                  once
                  className="text-gold italic"
                  segmentClassName="text-gold italic"
                >
                  {headlineLine2}
                </TextAnimate>
              </>
            )}
          </h1>

          <Reveal delay={0.15}>
            <p className="max-w-[420px] text-sm font-light leading-[1.8] text-white/50 sm:text-base">
              Antecipe seus recebíveis e libere capital imediato para o seu
              negócio — sem a burocracia bancária, sem perguntas
              desnecessárias.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#whatsapp-pendente" // TODO: confirmar número de WhatsApp com o cliente antes de publicar
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-auto rounded-none bg-gold px-7 py-3.5 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-gold-light"
                )}
              >
                Antecipar meus recebíveis
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
              <a
                href="#processo"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-auto rounded-none border-white/20 bg-transparent px-6 py-3.5 text-[10px] font-bold tracking-wider text-white/60 uppercase hover:bg-white/5 hover:text-white"
                )}
              >
                Ver como funciona
              </a>
            </div>
          </Reveal>
        </div>

        {/* Painel direito — mockup de WhatsApp */}
        <div className="relative z-10 flex items-center justify-center border-t border-gold/10 bg-gradient-to-br from-[#031a28] via-[#051f30] to-[#07273b] px-6 py-16 lg:border-t-0 lg:border-l lg:px-10">
          <Reveal delay={0.35} direction="up">
            <WhatsAppMock />
          </Reveal>
        </div>
      </div>

      {/* Faixa de parceiros */}
      <Reveal delay={0.45}>
        <div className="relative z-10 border-t border-white/5 px-6 py-8 text-center sm:px-10 lg:px-16">
          <p className="mb-4 text-xs tracking-wide text-white/30">
            {/* TODO: confirmar com o cliente se há parceiros/clientes que podem ser citados nominalmente */}
            Empresas que já confiam na Celer
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {PARTNER_LOGOS.map((name) => (
              <li key={name} className="text-sm font-semibold text-white/30">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
