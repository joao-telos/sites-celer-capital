import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Processo } from "@/components/processo";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Processo />
      </main>
    </>
  );
}
