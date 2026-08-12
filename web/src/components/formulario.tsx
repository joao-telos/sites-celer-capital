"use client";

import Script from "next/script";
import { useCallback } from "react";

import { Reveal } from "@/components/motion/reveal";

const EMBED = "https://tally.so/widgets/embed.js";

const SRC =
  "https://tally.so/embed/XxAJGL" +
  "?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

export function Formulario() {
  /*
    O snippet que o Tally entrega roda `document.body.appendChild` num
    <script> inline, coisa que o App Router não executa em JSX. Aqui o
    carregamento fica com o next/script e a inicialização com esta função.

    O fallback importa: se o embed.js não carregar — bloqueador de anúncio,
    rede ruim, o domínio do Tally fora do ar — copiar o data-tally-src para
    o src ainda renderiza o formulário dentro do iframe. Perde só a altura
    dinâmica, e a altura fixa do iframe cobre o formulário inteiro. Sem
    isso, uma falha de script deixaria um iframe vazio no lugar do único
    ponto de captação da página.
  */
  const carregaEmbeds = useCallback(() => {
    // Liga a altura dinâmica e o encaminhamento de eventos do Tally.
    window.Tally?.loadEmbeds();

    /*
      E preenche o src de qualquer iframe que tenha sobrado sem ele. O
      snippet do Tally faz isto só quando o próprio Tally não carregou,
      mas o loadEmbeds() é lazy por dentro: se o observador dele não
      disparar, o iframe fica vazio para sempre. Aqui não fica.

      Isto não antecipa requisição: o loading="lazy" do iframe é nativo,
      então o navegador só busca de fato quando a seção chega perto da
      viewport. O :not([src]) faz o laço não encostar no que o Tally já
      resolveu.
    */
    document
      .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
      .forEach((frame) => {
        const origem = frame.dataset.tallySrc;
        if (origem) frame.src = origem;
      });
  }, []);

  return (
    <section id="formulario" className="surface-wash-down">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:py-10">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-heading text-h2 text-center font-bold text-navy">
              Prefere que a gente ligue?
            </h2>
            <p className="text-body mx-auto mt-5 max-w-[68ch] text-center font-light text-navy/70">
              Preencha os dados da sua empresa e o time comercial entra em
              contato.
            </p>

            <div className="mt-10">
              <iframe
                data-tally-src={SRC}
                loading="lazy"
                width="100%"
                height={763}
                title="Formulário de contato da Celer Capital"
                className="w-full border-0"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/*
        afterInteractive, não lazyOnload. O lazyOnload espera tempo ocioso
        via requestIdleCallback, e numa aba que nunca fica ociosa o script
        simplesmente não chega — o formulário some. Este é o único ponto de
        captação da página; ele carrega logo depois da hidratação.

        onError chama a mesma função de propósito: é o caminho que aciona o
        fallback do iframe quando o script do Tally não vem.
      */}
      <Script
        src={EMBED}
        strategy="afterInteractive"
        onLoad={carregaEmbeds}
        onError={carregaEmbeds}
      />
    </section>
  );
}
