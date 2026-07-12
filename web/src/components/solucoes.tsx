"use client";

import { forwardRef, useRef } from "react";
import Image from "next/image";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Reveal } from "@/components/motion/reveal";

const SolutionNode = forwardRef<
  HTMLDivElement,
  { label: string; className?: string }
>(({ label, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 w-[108px] rounded-2xl border border-navy/10 bg-navy/[0.04] px-3 py-2.5 text-center text-[10px] leading-tight font-bold text-navy shadow-sm sm:w-36 sm:px-4 sm:py-3 sm:text-xs",
      className
    )}
  >
    {label}
  </div>
));
SolutionNode.displayName = "SolutionNode";

export function Solucoes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatasRef = useRef<HTMLDivElement>(null);
  const notasRef = useRef<HTMLDivElement>(null);
  const chequesRef = useRef<HTMLDivElement>(null);
  const contratosRef = useRef<HTMLDivElement>(null);
  const celerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);

  return (
    <section id="solucoes">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="sr-only">
          O que a Celer antecipa e como o capital chega até você
        </h2>

        <Reveal>
          <div
            ref={containerRef}
            className="relative mx-auto flex h-[400px] w-full max-w-lg items-center justify-center overflow-hidden sm:h-[440px]"
          >
            <div className="flex size-full flex-row items-stretch justify-between gap-3 sm:gap-8">
              <div className="flex flex-col justify-center gap-3 sm:gap-4">
                <SolutionNode ref={duplicatasRef} label="Duplicatas" />
                <SolutionNode ref={notasRef} label="Notas fiscais a prazo" />
                <SolutionNode ref={chequesRef} label="Cheques pré-datados" />
                <SolutionNode
                  ref={contratosRef}
                  label="Contratos e mensalidades"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div
                  ref={celerRef}
                  className="z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-navy shadow-lg shadow-navy/20 sm:size-20"
                >
                  <div className="relative size-7 sm:size-10">
                    <Image
                      src="/logo/celer-icon.png"
                      alt="Celer Capital"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  ref={clientRef}
                  className="z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-navy/15 bg-white shadow-sm sm:size-16"
                >
                  <User
                    className="size-5 text-navy sm:size-6"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[10px] font-bold tracking-wide text-navy/60 uppercase sm:text-xs">
                  Você
                </span>
              </div>
            </div>

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={duplicatasRef}
              toRef={celerRef}
              delay={0}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={notasRef}
              toRef={celerRef}
              delay={0.25}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={chequesRef}
              toRef={celerRef}
              delay={0.5}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={contratosRef}
              toRef={celerRef}
              delay={0.75}
              gradientStartColor="var(--color-gold)"
              gradientStopColor="var(--color-gold-dark)"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={celerRef}
              toRef={clientRef}
              delay={1}
              gradientStartColor="var(--color-navy)"
              gradientStopColor="var(--color-gold)"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
