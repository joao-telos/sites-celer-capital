import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Numeros } from "@/components/numeros";
import { Processo } from "@/components/processo";
import { Sobre } from "@/components/sobre";
import { Valores } from "@/components/valores";
import { Faq } from "@/components/faq";
import { Atendimento } from "@/components/atendimento";
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
        <Atendimento />
        <Faq />
        <Formulario />
      </main>
      <Footer />
    </>
  );
}
