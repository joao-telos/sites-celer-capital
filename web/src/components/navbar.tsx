"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#processo", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#solucoes", label: "Soluções" },
];

// TODO: confirmar com o cliente se esta é a URL definitiva de login da plataforma
const LOGIN_URL = "https://digital.celercapital.com.br/#/authentication/login";

export function Navbar() {
  const scrolled = useScrolled();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4">
      <nav
        aria-label="Navegação principal"
        className={cn(
          "flex w-full items-center justify-between transition-[max-width,margin,padding,border-radius,background-color,box-shadow] duration-300 ease-out",
          scrolled
            ? "mt-3 max-w-3xl rounded-full bg-navy/95 px-5 py-2 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-md"
            : "mt-0 max-w-7xl rounded-none bg-transparent px-3 py-6"
        )}
      >
        <a
          href="#"
          aria-label="Celer Capital — página inicial"
          className={cn(
            "relative shrink-0 overflow-hidden transition-[width] duration-300 ease-out",
            scrolled ? "h-8 w-8" : "h-9 w-[150px]"
          )}
        >
          <Image
            src="/logo/celer-horizontal.png"
            alt=""
            fill
            priority
            sizes="150px"
            className={cn(
              "object-contain object-left transition-opacity duration-300",
              scrolled ? "opacity-0" : "opacity-100"
            )}
          />
          <Image
            src="/logo/celer-icon.png"
            alt=""
            fill
            sizes="32px"
            className={cn(
              "object-contain object-left transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-0"
            )}
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium tracking-wide text-white/50 transition-colors hover:text-white/85"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-auto rounded-full border-white/25 bg-transparent px-4 py-2 text-[10px] font-bold tracking-wider text-white/70 uppercase transition-colors hover:bg-white/10 hover:text-white"
            )}
          >
            Login
          </a>
          <a
            href="#whatsapp-pendente" // TODO: confirmar número de WhatsApp com o cliente antes de publicar
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-auto rounded-full bg-gold px-4 py-2 text-[10px] font-bold tracking-wider text-navy uppercase hover:bg-gold-light"
            )}
          >
            Antecipar agora
            <ArrowRight className="size-3" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  );
}
