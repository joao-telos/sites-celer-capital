"use client";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy px-6 pt-32 pb-20 text-center sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(153,101,21,0.12)_0%,transparent_65%)]"
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <Badge
          variant="outline"
          className="mb-7 gap-2 rounded-full border-gold/40 bg-transparent px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-gold uppercase"
        >
          <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
          Securitizadora
        </Badge>

        <h1 className="font-heading text-[2.125rem] leading-[1.1] font-bold text-white sm:text-5xl lg:text-[3.5rem]">
          O capital que já é seu não deveria
          <br />
          <span className="text-gold italic">esperar.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-sm leading-[1.8] font-light text-white/50 sm:text-base">
          Antecipe seus recebíveis e libere capital imediato para o seu
          negócio — sem a burocracia bancária, sem perguntas
          desnecessárias.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#whatsapp-pendente" // TODO: confirmar número de WhatsApp com o cliente antes de publicar
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-auto rounded-full bg-gold px-7 py-3.5 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-gold-light"
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
