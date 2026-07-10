import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function CtaFinal() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-ink py-20 text-center sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(153,101,21,0.09)_0%,transparent_65%)]"
      />

      <Reveal>
        <div className="relative z-10 mx-auto max-w-lg px-6">
          <p className="mb-5 flex items-center justify-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-gold uppercase">
            <span className="h-px w-5 bg-gold" aria-hidden="true" />
            Próximo passo
          </p>
          <h2 className="font-heading text-2xl leading-[1.15] font-bold text-white sm:text-3xl lg:text-[2.75rem]">
            Quanto capital está parado nos seus recebíveis agora?
          </h2>
          <p className="mt-5 text-sm leading-[1.8] font-light text-white/40">
            Manda uma mensagem. Analisamos sem compromisso e respondemos com o
            que é possível fazer — rápido.
          </p>
          <a
            href="#whatsapp-pendente" // TODO: confirmar número de WhatsApp com o cliente antes de publicar
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-9 h-auto rounded-full bg-whatsapp px-9 py-4 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-whatsapp/90"
            )}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Falar pelo WhatsApp
          </a>
          <p className="mt-5 text-[9px] tracking-wider text-white/20 uppercase">
            Sem compromisso · Sem consulta de crédito · Resposta rápida
          </p>
        </div>
      </Reveal>
    </section>
  );
}
