import { Reveal } from "@/components/motion/reveal";

export function Atendimento() {
  return (
    <section id="atendimento">
      <div className="mx-auto max-w-2xl px-6 py-12 text-center sm:px-10 lg:py-16">
        <Reveal>
          <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
            Receba seu crédito quando você precisa dele
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-[1.6] font-light text-navy/70 sm:text-lg">
            Do outro lado, tem alguém que entende a urgência do seu negócio e
            resolve no seu tempo: rápido, direto, sem processo engessado.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
