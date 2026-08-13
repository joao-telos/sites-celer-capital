import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { WhatsappFlutuante } from "@/components/ui/whatsapp-flutuante";

// Coolvetica (display) é carregada via @font-face em globals.css — não é
// Google Font, então não passa por next/font/google como o Roboto.
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celer Capital | O capital que já é seu não deveria esperar",
  description:
    "Celer Capital antecipa recebíveis de indústrias e distribuidoras em Curitiba, entregando capital imediato sem a burocracia bancária.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} h-full antialiased`}>
      <head>
        {/* Coolvetica Regular/Bold aparecem acima da dobra (Hero) em toda visita — preload evita o flash de fallback */}
        <link
          rel="preload"
          href="/fonts/coolvetica-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/coolvetica-bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <WhatsappFlutuante />
      </body>
    </html>
  );
}
