import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PhotoSlotProps {
  /** Classe de proporção do Tailwind, ex: "aspect-[4/5]". */
  aspect: string;
  /** O que a foto precisa mostrar. Aparece no placeholder. */
  descricao: string;
  /** Fundo onde o slot vive. "dark" para dentro da caixa navy da Sobre. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Espaço reservado para fotografia que o cliente ainda não forneceu.
 *
 * É deliberadamente visível e descritivo, em vez de um bloco cinza mudo
 * ou de uma imagem de banco de imagens. O projeto decidiu em 2026-07-31
 * não usar stock: o manual aponta o visual próprio como o diferencial
 * real da marca, e stock genérico trabalha contra isso.
 *
 * Um buraco declarado é mais honesto que um buraco disfarçado.
 */
/*
  O slot vive em dois contextos: sobre o wash claro (Processo) e dentro da
  caixa navy (Sobre). Um prop de tom mantém as duas paletas aqui dentro,
  em vez de obrigar o chamador a recolorir os filhos por seletor de
  descendente — o que exigiria conhecer a estrutura interna do componente.
*/
const TONS = {
  light: {
    caixa: "border-navy/20 bg-navy/[0.03]",
    icone: "text-navy/40",
    rotulo: "text-navy/70",
    descricao: "text-navy/70",
  },
  dark: {
    caixa: "border-white/25 bg-white/[0.06]",
    icone: "text-white/40",
    rotulo: "text-white/75",
    descricao: "text-white/75",
  },
} as const;

export function PhotoSlot({
  aspect,
  descricao,
  tone = "light",
  className,
}: PhotoSlotProps) {
  const t = TONS[tone];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center",
        t.caixa,
        aspect,
        className
      )}
    >
      <ImageIcon className={cn("size-8", t.icone)} aria-hidden="true" />
      <p
        className={cn(
          "text-caption font-bold tracking-wide uppercase",
          t.rotulo
        )}
      >
        Foto pendente
      </p>
      <p className={cn("text-body max-w-[34ch] font-light", t.descricao)}>
        {descricao}
      </p>
    </div>
  );
}
