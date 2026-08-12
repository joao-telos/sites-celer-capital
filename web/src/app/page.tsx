import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Numeros } from "@/components/numeros";
import { Processo } from "@/components/processo";
import { Sobre } from "@/components/sobre";
import { Valores } from "@/components/valores";
import { Publico } from "@/components/publico";
import { Faq } from "@/components/faq";
import { Atendimento } from "@/components/atendimento";
import { CtaFinal } from "@/components/cta-final";
import { Footer } from "@/components/footer";
import { Formulario } from "@/components/formulario";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Processo />
        <Sobre />
        <Numeros />
        <Valores />
        <Publico />
        <Atendimento />
        <Faq />
        <CtaFinal />
        <Formulario />
      </main>
      <Footer />
    </>
  );
}
