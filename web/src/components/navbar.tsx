import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#processo", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#diferenciais", label: "Diferenciais" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-navy/90 backdrop-blur-sm">
      <nav
        aria-label="Navegação principal"
        className="flex h-16 items-center justify-between px-6 sm:px-10 lg:px-16"
      >
        <a href="#" className="flex items-center gap-3">
          <svg
            viewBox="0 0 30 30"
            fill="none"
            className="size-7"
            aria-hidden="true"
          >
            <path
              d="M15 2L26 8.5V21.5L15 28L4 21.5V8.5Z"
              stroke="var(--color-gold)"
              strokeWidth="1.2"
            />
            <path
              d="M11 9L11 21M11 9L18 9M11 15L17 15"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M13 11L13 23M13 11L20 11M13 17L19 17"
              stroke="var(--color-gold)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold text-white">
              Celer
            </span>
            <span className="text-[7px] font-bold tracking-[0.35em] text-gold uppercase">
              Capital
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[11px] font-medium tracking-wide text-white/45 transition-colors hover:text-white/80"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#whatsapp-pendente" // TODO: confirmar número de WhatsApp com o cliente antes de publicar
          className={cn(
            buttonVariants({ size: "sm" }),
            "h-auto rounded-none bg-gold px-4 py-2.5 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-gold-light"
          )}
        >
          Antecipar agora
          <ArrowRight className="size-3" aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
