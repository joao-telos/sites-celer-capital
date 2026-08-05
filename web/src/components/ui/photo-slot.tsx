import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PhotoSlotProps {
  /** Classe de proporção do Tailwind, ex: "aspect-[4/5]". */
  aspect: string;
  /** O que a foto precisa mostrar. Aparece no placeholder. */
  descricao: string;
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
export function PhotoSlot({ aspect, descricao, className }: PhotoSlotProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-navy/20 bg-navy/[0.03] p-6 text-center",
        aspect,
        className
      )}
    >
      <ImageIcon className="size-8 text-navy/30" aria-hidden="true" />
      <p className="text-caption font-bold tracking-wide text-navy/60 uppercase">
        Foto pendente
      </p>
      <p className="text-body max-w-[34ch] font-light text-navy/65">
        {descricao}
      </p>
    </div>
  );
}
