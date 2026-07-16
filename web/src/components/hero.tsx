"use client";

import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy px-6 pt-32 pb-20 text-center sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,134,34,0.12)_0%,transparent_65%)]"
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <h1 className="font-heading text-[2.125rem] leading-[1.1] font-bold text-white sm:text-5xl lg:text-[3.5rem]">
          O capital que já é seu
          <br />
          <span className="font-light text-gold">não deveria esperar.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-[1.6] font-light text-white/50 sm:text-lg">
          Antecipe seus recebíveis e libere capital imediato para o seu
          negócio, sem a burocracia bancária e sem perguntas
          desnecessárias.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/5541995699494?text=Ol%C3%A1%2C%20tudo%20bem%3F%0AVim%20do%20site%20e%20quero%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Celer%20Capital!"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-auto rounded-full bg-gold px-7 py-3.5 text-[11px] font-bold tracking-wider text-navy uppercase hover:bg-gold-light"
            )}
          >
            Antecipar meus recebíveis
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href="#processo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-auto rounded-full border-white/20 bg-transparent px-6 py-3.5 text-[10px] font-bold tracking-wider text-white/60 uppercase hover:bg-white/5 hover:text-white"
            )}
          >
            Ver como funciona
          </a>
        </div>
      </div>
    </section>
  );
}
