"use client";

import { forwardRef, useRef, type RefObject } from "react";
import Image from "next/image";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Reveal } from "@/components/motion/reveal";

// Beams connect to these 1px anchors (pinned to the shape's edge) instead of
// the shape's center — otherwise the line visually cuts across the label.
function Anchor({
  innerRef,
  side,
}: {
  innerRef: RefObject<HTMLDivElement | null>;
  side: "left" | "right";
}) {
  return (
    <div
      ref={innerRef}
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 size-px -translate-y-1/2",
        side === "left" ? "left-0" : "right-0"
      )}
    />
  );
}

const SolutionNode = forwardRef<HTMLDivElement, { label: string }>(
  ({ label }, ref) => (
    <div className="relative">
      <div className="w-32 rounded-2xl border border-navy/10 bg-linear-to-b from-white to-cream px-4 py-3 text-center text-[11px] leading-tight font-bold text-navy shadow-md shadow-navy/5 sm:w-44 sm:px-5 sm:py-4 sm:text-sm lg:w-48 lg:text-base">
        {label}
      </div>
      <Anchor innerRef={ref as RefObject<HTMLDivElement | null>} side="right" />
    </div>
  )
);
SolutionNode.displayName = "SolutionNode";

export function Solucoes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatasRef = useRef<HTMLDivElement>(null);
  const notasRef = useRef<HTMLDivElement>(null);
  const chequesRef = useRef<HTMLDivElement>(null);
  const contratosRef = useRef<HTMLDivElement>(null);
  const celerInRef = useRef<HTMLDivElement>(null);
  const celerOutRef = useRef<HTMLDivElement>(null);
  const clientInRef = useRef<HTMLDivElement>(null);

  return (
    <section id="solucoes" className="surface-wash-down">
      <div className="mx-auto max-w-3xl px-6 py-12 text-center sm:px-10 lg:py-16">
        <Reveal>
          <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
            Qualquer um desses vira capital direto na sua conta.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={containerRef}
            className="relative mx-auto mt-10 w-full max-w-2xl sm:mt-12"
          >
            <div className="flex flex-row items-stretch justify-between gap-4 sm:gap-10 lg:gap-14">
              <div className="flex flex-col justify-center gap-4 sm:gap-6">
                <SolutionNode ref={duplicatasRef} label="Duplicatas" />
                <SolutionNode ref={notasRef} label="Notas fiscais a prazo" />
                <SolutionNode ref={chequesRef} label="Cheques pré-datados" />
                <SolutionNode
                  ref={contratosRef}
                  label="Contratos e mensalidades"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-navy shadow-lg shadow-navy/20 sm:size-28 lg:size-32">
                  <div className="relative size-9 sm:size-14 lg:size-16">
                    <Image
                      src="/logo/celer-icon.png"
                      alt="Celer Capital"
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                  <Anchor innerRef={celerInRef} side="left" />
                  <Anchor innerRef={celerOutRef} side="right" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-navy/15 bg-white shadow-sm sm:size-20 lg:size-24">
                  <User
                    className="size-6 text-navy sm:size-8 lg:size-9"
                    aria-hidden="true"
                  />
                  <Anchor innerRef={clientInRef} side="left" />
                </div>
                <span className="text-xs font-bold tracking-wide text-navy/60 uppercase sm:text-sm">
                  Você
                </span>
              </div>
            </div>

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={duplicatasRef}
              toRef={celerInRef}
              delay={0}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={notasRef}
              toRef={celerInRef}
              delay={0.25}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={chequesRef}
              toRef={celerInRef}
              delay={0.5}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={contratosRef}
              toRef={celerInRef}
              delay={0.75}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={celerOutRef}
              toRef={clientInRef}
              delay={1}
              gradientStartColor="var(--color-navy)"
              gradientStopColor="var(--color-gold)"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-base leading-[1.6] font-light text-navy/70 sm:mt-10 sm:text-lg">
            Você manda o documento, a Celer analisa e libera o valor.
            Simples assim.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
