import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Processo } from "@/components/processo";
import { ParaQuem } from "@/components/para-quem";
import { Sobre } from "@/components/sobre";
import { Valores } from "@/components/valores";
import { Solucoes } from "@/components/solucoes";
import { Atendimento } from "@/components/atendimento";
import { CtaFinal } from "@/components/cta-final";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Processo />
        <ParaQuem />
        <Sobre />
        <Valores />
        <Solucoes />
        <Atendimento />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
