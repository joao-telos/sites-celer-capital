import Image from "next/image";

import { cn } from "@/lib/utils";

interface RetratoRecortadoProps {
  src: string;
  alt: string;
  /** Largura renderizada, para o `sizes` do next/image. Ex.: "352px". */
  sizes: string;
  className?: string;
}

/**
 * Retrato sem fundo sobre um fundo em degradê da marca, com o ícone da
 * Celer grande atrás, como sombra.
 *
 * A foto chega já recortada (WebP com alfa). O degradê devolve à imagem o
 * fundo que ela perdeu, agora na cor da marca em vez do cenário original
 * — que era um interior de restaurante e não tinha nada a ver com o
 * público que a seção descreve.
 *
 * Cuidado registrado: o otimizador do Next devolve JPEG para navegador
 * que não anuncia WebP, e JPEG não tem canal alfa. Medido: com
 * `Accept: image/webp` o canto vem `rgba(0,0,0,0)`; sem, vem preto
 * opaco, e o recorte viraria um bloco preto sobre o navy. Na prática o
 * caminho é inalcançável, porque a máscara logo abaixo tem o mesmo
 * suporte de navegador que o WebP: quem não tem um não tem o outro, e a
 * peça já estaria quebrada de qualquer jeito. Se um dia a máscara sair
 * daqui, esta garantia sai junto.
 */
export function RetratoRecortado({
  src,
  alt,
  sizes,
  className,
}: RetratoRecortadoProps) {
  return (
    <div
      /*
        A proporção é a do arquivo (900x1432), não um quadrado. A foto é
        vertical e precisa aparecer inteira: num quadrado, `cover` cortaria
        na altura do peito e `contain` deixaria faixas vazias dos dois
        lados. Com a caixa na proporção da imagem, ela preenche de borda a
        borda sem perder nada.
      */
      className={cn(
        "relative aspect-[900/1432] overflow-hidden rounded-[2rem]",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)",
      }}
    >
      {/*
        Brilho atrás da cabeça. Sem ele o recorte fica chapado sobre o
        degradê: a silhueta some no navy escuro justamente na altura do
        terno, que é escuro também.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 40% at 50% 26%, rgb(255 255 255 / 0.16) 0%, transparent 70%)",
        }}
      />

      {/*
        O ícone da marca como sombra no fundo. Sangra pelas laterais de
        propósito: em opacidade baixa, um logo inteiro e centrado lê como
        logo mal posicionado, enquanto um recorte grande lê como textura.

        Fica atrás do recorte na ordem do DOM, então o corpo da pessoa
        passa por cima da metade de baixo do ícone.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[-18%] top-[6%] opacity-[0.15]"
      >
        <div className="relative aspect-[377/263] w-full">
          <Image
            src="/logo/celer-icon.png"
            alt=""
            fill
            sizes={sizes}
            className="object-contain"
          />
        </div>
      </div>

      {/*
        A máscara dissolve só a barra final. A foto termina na cintura, e
        sem isso o corte apareceria como uma linha reta atravessando o
        paletó. Começa em 88% para não comer conteúdo.
      */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        style={{
          maskImage: "linear-gradient(to bottom, #000 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 88%, transparent 100%)",
        }}
      />
    </div>
  );
}
