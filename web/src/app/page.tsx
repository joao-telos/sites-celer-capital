import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Processo } from "@/components/processo";
import { ParaQuem } from "@/components/para-quem";
import { Diferenciais } from "@/components/diferenciais";
import { QuebraObjecao } from "@/components/quebra-objecao";
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
        <Diferenciais />
        <QuebraObjecao />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
