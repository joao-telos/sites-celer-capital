import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
  Os tokens da escala tipográfica moram no namespace `text-*`, o mesmo que
  o tailwind-merge usa para cor de texto. Sem ensiná-lo, ele trata
  `text-body` como cor e descarta o tamanho quando a mesma className
  também traz `text-white/70`.
*/
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "micro",
            "caption",
            "body",
            "lead",
            "card",
            "node",
            "h2",
            "stat",
            "display",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
