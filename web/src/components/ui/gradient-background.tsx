import { cn } from "@/lib/utils";

/*
  Gradientes de marca dos dois "bookends" escuros da página. Os dois fazem o
  mesmo movimento horizontal; o do CTA Final é uma oitava mais escuro, para
  as duas pontas da página rimarem sem ficarem idênticas.
*/
export const HERO_GRADIENT =
  "linear-gradient(90deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)";

export const CTA_GRADIENT =
  "linear-gradient(90deg, var(--color-ink) 0%, var(--color-navy) 100%)";

interface GradientBackgroundProps {
  /** Valor CSS completo de `background` — normalmente um linear-gradient(). */
  gradient: string;
  className?: string;
}

/**
 * Camada de fundo absoluta para seções com gradiente. A seção precisa ser
 * `relative`, e o conteúdo por cima precisa de `relative z-10` — elementos
 * estáticos pintam abaixo de elementos posicionados.
 */
export function GradientBackground({
  gradient,
  className,
}: GradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{ background: gradient }}
    />
  );
}
