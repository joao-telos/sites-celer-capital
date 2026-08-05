import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import {
  CTA_GRADIENT,
  GradientBackground,
} from "@/components/ui/gradient-background";

export function CtaFinal() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden py-20 text-center sm:py-24 lg:py-28"
    >
      <GradientBackground gradient={CTA_GRADIENT} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,134,34,0.09)_0%,transparent_65%)]"
      />

      <Reveal>
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-h2 font-bold text-white">
            Quanto capital está parado nos seus recebíveis agora?
          </h2>
          <p className="text-body mt-5 font-light text-white/70">
            Manda uma mensagem. Analisamos sem compromisso e respondemos
            rápido com o que é possível fazer.
          </p>
          <a
            href="https://wa.me/5541995699494?text=Ol%C3%A1%2C%20tudo%20bem%3F%0AVim%20do%20site%20e%20quero%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Celer%20Capital!"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-caption mt-9 h-auto rounded-full bg-whatsapp px-9 py-4 font-bold tracking-wider text-white uppercase hover:bg-whatsapp/90"
            )}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Falar pelo WhatsApp
          </a>
          <p className="text-micro mt-5 tracking-wider text-white/70 uppercase">
            Sem compromisso · Sem consulta de crédito · Resposta rápida
          </p>
        </div>
      </Reveal>
    </section>
  );
}
