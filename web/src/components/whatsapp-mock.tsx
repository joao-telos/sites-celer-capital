"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const REPLY_DELAY_MS = 1400;

/**
 * Prova visual de que o WhatsApp é o canal real de conversão — não um widget
 * funcional. `role="img"` + `aria-label` garantem que leitores de tela
 * recebam uma descrição única em vez de tentar navegar pelas "mensagens".
 * O indicador de "digitando" toca uma única vez (nunca em loop) antes da
 * resposta aparecer — ver docs/superpowers/specs/2026-07-09-hero-section-design.md.
 */
export function WhatsAppMock() {
  const reducedMotion = useReducedMotion();
  const [timerElapsed, setTimerElapsed] = useState(false);

  useEffect(() => {
    // Reduced motion: nothing to schedule, `showReply` below resolves via
    // the `reducedMotion ||` short-circuit instead of a synchronous setState here.
    if (reducedMotion) return;

    const timer = setTimeout(() => setTimerElapsed(true), REPLY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const showReply = reducedMotion || timerElapsed;

  return (
    <Card
      role="img"
      aria-label="Simulação de conversa no WhatsApp: um cliente pergunta se a Celer antecipa recebíveis, e a Celer responde confirmando."
      className="w-full max-w-[320px] gap-0 rounded-2xl border border-gold/20 bg-navy/40 py-0 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm"
    >
      {/* aria-hidden no conteúdo inteiro: a Card acima já expõe uma única descrição via aria-label — sem isso, leitores de tela também anunciariam cada bolha/parágrafo individualmente */}
      <div aria-hidden="true">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
            <MessageCircle className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">Celer Capital</p>
            <p className="text-xs text-white/40">online</p>
          </div>
        </div>

        <CardContent className="flex flex-col gap-3 px-4 py-5">
          <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-sm text-white/90">
            Vi que vocês antecipam recebíveis, é isso?
          </div>

          {!showReply && (
            <div className="flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2.5">
              <span className="typing-dot size-1.5 rounded-full bg-white/60 [animation-delay:0ms]" />
              <span className="typing-dot size-1.5 rounded-full bg-white/60 [animation-delay:120ms]" />
              <span className="typing-dot size-1.5 rounded-full bg-white/60 [animation-delay:240ms]" />
            </div>
          )}

          {showReply && (
            <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-whatsapp/90 px-3 py-2 text-sm text-white">
              Isso mesmo — manda os dados que a gente analisa e te responde rápido.
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
