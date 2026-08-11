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
 * Retrato sem fundo dentro de um quadrado navy, dissolvendo na base.
 *
 * A foto chega já recortada (WebP com alfa). O quadrado devolve à imagem
 * o fundo que ela perdeu, agora na cor da marca em vez do cenário
 * original — que era um interior de restaurante e não tinha nada a ver
 * com o público que a seção descreve.
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
      className={cn(
        "relative aspect-square overflow-hidden rounded-[2rem]",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)",
      }}
    >
      {/*
        Brilho atrás da cabeça. Sem ele o recorte fica chapado sobre o
        gradiente: a silhueta some no navy escuro justamente na altura do
        terno, que é escuro também.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 46% at 50% 30%, rgb(255 255 255 / 0.16) 0%, transparent 70%)",
        }}
      />

      {/*
        object-cover com o topo ancorado: o recorte é retrato (0.6) e o
        quadrado corta a partir da cintura. A folga acima da cabeça já vem
        embutida no arquivo, não em padding — assim o enquadramento não
        depende do tamanho em que o quadrado é renderizado.

        A máscara dissolve a base. Sem ela a barra de corte apareceria como
        uma linha reta atravessando o paletó.
      */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-top"
        style={{
          maskImage: "linear-gradient(to bottom, #000 62%, transparent 97%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 62%, transparent 97%)",
        }}
      />
    </div>
  );
}
