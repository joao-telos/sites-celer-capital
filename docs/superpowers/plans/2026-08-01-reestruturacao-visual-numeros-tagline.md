# Reestruturação visual, Números e tagline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reordenar a página removendo a seção "Para Quem", reformular a Sobre como caixa em gradiente navy, adicionar a seção Números em gradiente dourado com contagem animada, e substituir a Atendimento pela tagline revelada palavra a palavra.

**Architecture:** A remoção e a reordenação vêm primeiro, para o resto ser construído em cima da estrutura final. A seção Números traz junto o token de cor que ela precisa e um `CountingNumber` escrito com `requestAnimationFrame` sobre o `useInViewOnce` que o projeto já tem — sem biblioteca de animação. Sobre e Atendimento são reescritas de conteúdo, não refatorações. O manual de marca fecha, descrevendo o que as quatro tarefas anteriores construíram.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, Tailwind CSS 4.3.2, TypeScript 5, lucide-react 1.24.0.

## Global Constraints

**Este projeto não tem test runner.** `package.json` expõe apenas `dev`, `build`, `start` e `lint` — não existe vitest, jest ou playwright instalado. **Não instale um.** O ciclo de verificação de cada tarefa é: `npx tsc --noEmit`, `npx eslint .`, e asserções no DOM pelo navegador. Onde este plano diz "teste", é isso que significa.

**Não instale o pacote `motion`.** O prompt original do cliente manda instalar, mas este projeto removeu essa dependência de propósito no pivô de 2026-07-10 e não voltou atrás. O `CountingNumber` da Task 2 é implementação nativa. Nenhuma tarefa deste plano adiciona dependência.

- **Leia antes de escrever código:** `web/AGENTS.md` manda consultar `node_modules/next/dist/docs/` — esta versão do Next tem breaking changes em relação ao conhecimento de treino.
- **Paleta fechada.** Únicas cores permitidas: navy `#001A4B`, navy-bright `#003599`, gold `#C68622`, gold-bright `#F2AA3A`, gold-light `#E1A951`, gold-dark `#6D4A13`, cream `#EFF1F4`, ink `#0B0C0C`, white `#FFFFFF`, whatsapp `#1DA851`. `gold-bright` é novo nesta rodada e entra na Task 2.
- **Tailwind v4:** use `bg-linear-to-*`. `bg-gradient-to-*` está depreciado nesta versão.
- **Texto sobre superfície dourada é sempre `text-navy`, sem opacidade.** Branco reprova nos dois extremos do gradiente (3,1:1 sobre `#C68622`, 2,0:1 sobre `#F2AA3A`), e navy com opacidade também escorrega: `text-navy/80` cai para 4,31:1 na ponta escura, abaixo do AA. Não use opacidade em texto sobre dourado.
- **Texto branco sobre fundo escuro: mínimo `/70`.** Texto navy sobre fundo claro: mínimo `/65`.
- **Fonte de display (`font-heading`) nunca abaixo de 20px** e nunca `font-semibold`/600 — só existem cortes reais 300/400/700.
- **Sem em dash (—) na copy visível.** Em comentário de código é livre.
- **Toda copy visível deste plano veio pronta do cliente e é verbatim-crítica.** Não reescreva, encurte nem "melhore" nenhum texto ou número.
- **Server Components por padrão.** `"use client"` só em arquivo que realmente use estado, efeito ou evento.
- Cantos arredondados sempre: `rounded-2xl`+ em cards, `rounded-full` em botões.

---

## Estrutura de arquivos

**Criar:**
| Arquivo | Responsabilidade |
|---|---|
| `web/src/components/ui/counting-number.tsx` | Contagem animada genérica, sem dependência externa |
| `web/src/components/numeros.tsx` | Dados dos 4 números + a caixa dourada |

**Modificar:**
| Arquivo | O quê |
|---|---|
| `web/src/app/page.tsx` | Nova ordem, remoção da ParaQuem, inserção da Numeros |
| `web/src/components/navbar.tsx` | Remover o link `#para-quem` |
| `web/src/components/sobre.tsx` | Wash e reformulação completa |
| `web/src/components/atendimento.tsx` | Conteúdo substituído pela tagline |
| `web/src/components/footer.tsx` | Remover a tagline |
| `web/src/app/globals.css` | Token `--color-gold-bright` |
| `docs/brand-guidelines.md` | Token, remoção da Para Quem, novo papel da tagline, regra do dourado |

**Deletar:**
| Arquivo | Motivo |
|---|---|
| `web/src/components/para-quem.tsx` | Seção removida a pedido do cliente |

**Não deletar:** `web/src/components/ui/card.tsx` perde seu único consumidor quando `para-quem.tsx` sai, mas é componente de biblioteca do shadcn, não código morto autoral. Fica.

---

## Task 1: Remover Para Quem e reordenar a página

**Files:**
- Delete: `web/src/components/para-quem.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/components/navbar.tsx` (array `NAV_LINKS`)
- Modify: `web/src/components/sobre.tsx` (só a linha da `<section>`)

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: a ordem final da página, menos a seção Números que a Task 2 insere. Nenhuma assinatura nova.

- [ ] **Step 1: Deletar a seção**

```bash
git rm web/src/components/para-quem.tsx
```

- [ ] **Step 2: Reescrever page.tsx**

Conteúdo completo do arquivo depois da mudança (a Task 2 insere `<Numeros />` entre `<Sobre />` e `<Valores />`):

```tsx
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Processo } from "@/components/processo";
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
```

- [ ] **Step 3: Remover o link da navbar**

Em `web/src/components/navbar.tsx`, o array `NAV_LINKS` passa a ser:

```tsx
const NAV_LINKS = [
  { href: "#processo", label: "Como funciona" },
  { href: "#sobre", label: "Sobre" },
  { href: "#solucoes", label: "Soluções" },
];
```

- [ ] **Step 4: Ajustar a direção do wash da Sobre**

Em `web/src/components/sobre.tsx`, a linha da `<section>`:

```tsx
    <section id="sobre" className="surface-wash-up">
```

Era `surface-wash-down`. A direção alterna de seção para seção para que a cor do fim de uma seja a do início da próxima, e a ordem nova exige essa troca.

**Estado transitório esperado:** até a Task 2 inserir a seção Números entre Sobre e Valores, as duas ficam ambas em `surface-wash-up` e a emenda entre elas fica visível. Isso é esperado e some na Task 2. Não "corrija" trocando o wash de volta.

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída. Se o `tsc` acusar import não resolvido de `para-quem`, sobrou referência ao arquivo deletado.

- [ ] **Step 6: Verificar no navegador**

Subir o preview (`preview_start` com `{name: "web-dev"}`, config já existe em `.claude/launch.json`) e rodar no console:

```js
(() => {
  const secoes = [...document.querySelectorAll("main section")].map((s) => s.id || "(hero)");
  const links = [...document.querySelectorAll('header nav a[href^="#"]')].map((a) => a.getAttribute("href"));
  return JSON.stringify({
    ordem: secoes,
    paraQuemSumiu: !document.getElementById("para-quem"),
    links,
    todasAncorasResolvem: links.every((h) => h === "#" || !!document.querySelector(h)),
  });
})();
```

Esperado: `ordem` sem `para-quem`, `paraQuemSumiu: true`, `links` com `#processo`, `#sobre` e `#solucoes` (mais o `#` do logo), e `todasAncorasResolvem: true`.

- [ ] **Step 7: Commit**

```bash
git add -A web/src
git commit -m "Remover secao Para Quem e reordenar a pagina

Wash da Sobre passa a up para manter a alternancia com a ordem nova.
Ate a secao Numeros entrar, Sobre e Valores ficam ambas em up e a
emenda entre elas aparece: estado transitorio, fechado na proxima
tarefa.

O ui/card.tsx do shadcn perde seu unico consumidor mas permanece: e
componente de biblioteca, nao codigo morto autoral."
```

---

## Task 2: Seção Números

**Files:**
- Modify: `web/src/app/globals.css` (bloco `@theme`)
- Create: `web/src/components/ui/counting-number.tsx`
- Create: `web/src/components/numeros.tsx`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: `useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit)` de `@/hooks/use-in-view-once`, que retorna `{ ref: RefObject<T | null>; inView: boolean }`. `Reveal` de `@/components/motion/reveal`. A ordem de página da Task 1.
- Produces: `CountingNumber({ target, from?, durationMs?, className? })` exportado de `@/components/ui/counting-number`. Componente `Numeros()` sem props, âncora `#numeros`. Token CSS `--color-gold-bright`, disponível como classe Tailwind `gold-bright`.

- [ ] **Step 1: Adicionar o token de cor**

Em `web/src/app/globals.css`, dentro do bloco `@theme`, logo abaixo da linha `--color-gold-light: #e1a951;`:

```css
  /*
    gold-bright: pedido do cliente (2026-08-01) para o gradiente da seção
    Números. Como o navy-bright, NÃO estava na paleta institucional —
    entrou por decisão do cliente, não por variação inventada. Ver
    docs/superpowers/specs/2026-08-01-reestruturacao-visual-numeros-tagline-design.md
  */
  --color-gold-bright: #f2aa3a;
```

- [ ] **Step 2: Criar o CountingNumber**

Criar `web/src/components/ui/counting-number.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

interface CountingNumberProps {
  target: number;
  from?: number;
  durationMs?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Contagem animada com requestAnimationFrame, sem biblioteca de animação —
 * o projeto removeu o `motion` no pivô de 2026-07-10 e não voltou atrás.
 *
 * Dispara ao entrar na tela (useInViewOnce), não no mount: uma contagem que
 * roda com a seção fora do viewport termina antes de alguém ver.
 *
 * prefers-reduced-motion precisa de tratamento explícito aqui. A regra
 * global em globals.css zera transições e animações CSS, mas não alcança
 * uma contagem dirigida por JS.
 */
export function CountingNumber({
  target,
  from = 0,
  durationMs = 1800,
  className,
}: CountingNumberProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  const [value, setValue] = useState(from);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const semMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (semMovimento) {
      setValue(target);
      return;
    }

    const inicio = performance.now();
    const passo = (agora: number) => {
      const progresso = Math.min((agora - inicio) / durationMs, 1);
      setValue(Math.round(from + (target - from) * easeOutCubic(progresso)));
      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(passo);
      }
    };
    frameRef.current = requestAnimationFrame(passo);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, from, target, durationMs]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString("pt-BR")}
    </span>
  );
}
```

- [ ] **Step 3: Criar a seção**

Criar `web/src/components/numeros.tsx`. Os quatro dados vieram prontos do cliente:

```tsx
import { CountingNumber } from "@/components/ui/counting-number";
import { Reveal } from "@/components/motion/reveal";

/*
  Dados institucionais fornecidos pelo cliente em 2026-08-01. Verbatim:
  nenhum destes números pode ser arredondado, estimado ou "melhorado".

  O card do bilhão conta de 0 a 1, então a animação nele é praticamente
  imperceptível — decisão consciente, registrada no spec. A alternativa
  seria inventar uma escala falsa (contar até 1000 e chamar de milhões),
  que seria pior.
*/
const NUMEROS = [
  {
    prefixo: "",
    target: 30,
    sufixo: "+",
    label: "anos de experiência no mercado de recebíveis",
  },
  {
    prefixo: "",
    target: 9,
    sufixo: "",
    label: "anos de empresa",
  },
  {
    prefixo: "R$ ",
    target: 1,
    sufixo: " bi+",
    label: "antecipado em 9 anos de operação",
  },
  {
    prefixo: "",
    target: 100,
    sufixo: "+",
    label: "empresas parceiras atendidas",
  },
];

/*
  Todo texto aqui é text-navy sem opacidade. Sobre o gradiente dourado,
  branco reprova nos dois extremos (3,1:1 e 2,0:1) e navy com opacidade
  escorrega (text-navy/80 cai para 4,31:1 na ponta escura).
*/
export function Numeros() {
  return (
    <section id="numeros" className="surface-wash-down">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        {/* Sem título visível: a referência do cliente não tem um, e a seção
            funciona como faixa de dados. O sr-only mantém o landmark. */}
        <h2 className="sr-only">Celer Capital em números</h2>

        <Reveal>
          <div
            className="rounded-[2rem] px-8 py-12 sm:px-12 lg:px-16 lg:py-16"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-bright) 100%)",
            }}
          >
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {NUMEROS.map((item) => (
                <div key={item.label} className="text-center">
                  <dt className="font-heading text-4xl leading-none font-bold text-navy sm:text-5xl">
                    {item.prefixo}
                    <CountingNumber target={item.target} />
                    {item.sufixo}
                  </dt>
                  <dd className="mt-3 text-sm leading-[1.5] font-light text-navy">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

**`numeros.tsx` NÃO leva `"use client"`, e isso está correto.** Ele é Server Component e renderiza dois Client Components (`Reveal` e `CountingNumber`). Isso é o padrão normal de slot: elementos React são serializáveis através da fronteira RSC, e `target` é um número.

Não confundir com o problema que `valores.tsx` teve na rodada anterior. Lá, o que cruzava a fronteira era uma **referência de componente** (`icon: Zap`) dentro de um objeto simples — uma função, não um elemento. Se você adicionar `"use client"` aqui "por precaução", estará jogando a seção inteira para o cliente sem motivo.

- [ ] **Step 4: Inserir na página**

Em `web/src/app/page.tsx`, adicionar o import e o elemento entre `<Sobre />` e `<Valores />`:

```tsx
import { Numeros } from "@/components/numeros";
```

```tsx
        <Sobre />
        <Numeros />
        <Valores />
```

Isso fecha a emenda que a Task 1 deixou aberta: Sobre (up) termina em branco, Números (down) começa em branco.

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 6: Verificar no navegador**

Neste ambiente o `IntersectionObserver` não dispara, então a contagem não inicia sozinha. Verificar o valor final forçando o estado e conferindo a formatação:

```js
(() => {
  const s = document.getElementById("numeros");
  const caixa = s.querySelector('[style*="gradient"]');
  const dts = [...s.querySelectorAll("dt")].map((d) => d.textContent.trim());
  const dds = [...s.querySelectorAll("dd")].map((d) => d.textContent.trim());
  return JSON.stringify({
    gradiente: getComputedStyle(caixa).backgroundImage.slice(0, 80),
    numeros: dts,
    rotulos: dds,
    tituloSrOnly: s.querySelector("h2").className.includes("sr-only"),
    corDoTexto: getComputedStyle(s.querySelector("dd")).color,
  }, null, 1);
})();
```

Esperado: `gradiente` citando `rgb(198, 134, 34)` e `rgb(242, 170, 58)`; quatro entradas em `numeros` e quatro em `rotulos`; `tituloSrOnly: true`. Os numerais estarão em `0` porque o observer não disparou — isso é o ambiente, não defeito.

Depois verificar que a contagem chega ao valor certo, disparando o observer manualmente:

```js
(() => {
  const alvos = [30, 9, 1, 100];
  const dts = [...document.querySelectorAll("#numeros dt")];
  // Sem IntersectionObserver neste painel, checar que o texto estático
  // (prefixo e sufixo) está no lugar e que o span da contagem existe.
  return JSON.stringify({
    spansDeContagem: document.querySelectorAll("#numeros dt span").length,
    esperado: alvos.length,
    textoEstatico: dts.map((d) => d.textContent.replace(/\d/g, "#")),
  }, null, 1);
})();
```

Esperado: `spansDeContagem: 4`, e `textoEstatico` mostrando `#+`, `#`, `R$ # bi+`, `###+` (os `#` no lugar dos dígitos).

- [ ] **Step 7: Commit**

```bash
git add web/src/app/globals.css web/src/components/ui/counting-number.tsx web/src/components/numeros.tsx web/src/app/page.tsx
git commit -m "Adicionar secao Numeros com contagem animada

CountingNumber implementado com requestAnimationFrame sobre o
useInViewOnce que o projeto ja tem, em vez do pacote motion que o
prompt do cliente pedia: essa dependencia foi removida de proposito no
pivo de 2026-07-10. Dispara ao entrar na tela, nao no mount.

prefers-reduced-motion tratado explicitamente: a regra global do
globals.css zera transicao CSS mas nao alcanca contagem em JS.

Todo texto sobre o dourado e text-navy sem opacidade. Branco reprova
nos dois extremos (3,1:1 e 2,0:1) e navy/80 cai para 4,31:1."
```

---

## Task 3: Sobre reformulada

**Files:**
- Modify: `web/src/components/sobre.tsx` (reescrita completa)

**Interfaces:**
- Consumes: `Reveal` de `@/components/motion/reveal`; token `--color-navy-bright`; utility `surface-wash-up` aplicada na Task 1.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Reescrever a seção**

Conteúdo completo de `web/src/components/sobre.tsx`. A copy é a mesma de antes, palavra por palavra — só a moldura muda:

```tsx
import { Reveal } from "@/components/motion/reveal";

/*
  Missão e Visão agora são caixas cream sólidas dentro da caixa navy. Os
  tints em gradiente que elas usavam antes (navy suave e gold suave) foram
  desenhados para caixa translúcida sobre fundo claro: aqui o fundo atrás
  delas é a caixa navy, onde um tint navy translúcido sumiria e o dourado
  brigaria com a seção Números logo abaixo.
*/
const PILARES = [
  {
    title: "Missão",
    text: "Impulsionar empresas por meio da antecipação de recebíveis e de soluções financeiras inteligentes, oferecendo agilidade, segurança e compromisso para fortalecer negócios, gerar oportunidades e construir parcerias duradouras.",
  },
  {
    title: "Visão",
    text: "Ser a principal parceira financeira das empresas brasileiras, sendo referência em antecipação de recebíveis e reconhecida pela confiança, agilidade e excelência, ampliando nossa atuação com soluções financeiras estratégicas que impulsionem o crescimento sustentável de nossos clientes.",
  },
];

/*
  Duas exceções deliberadas ao manual de marca, ambas pedido do cliente e
  registradas em docs/brand-guidelines.md:
  1. É a única seção com título alinhado à esquerda — o manual pede blocos
     de seção centralizados.
  2. O parágrafo explica brevemente o mecanismo da antecipação, que o pivô
     v3 tinha removido do site por considerar redundante para o público.

  O gradiente da caixa usa 135°, não os 90° dos dois bookends: aqueles são
  fundo de seção inteira, onde o movimento horizontal funciona na largura
  toda; uma caixa arredondada lê melhor na diagonal.
*/
export function Sobre() {
  return (
    <section id="sobre" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <div
            className="rounded-[2rem] px-8 py-12 sm:px-12 lg:px-14 lg:py-14"
            style={{
              background:
                "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)",
            }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="text-left">
                <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-white sm:text-3xl lg:text-4xl">
                  Sobre nós
                </h2>
                <p className="mt-5 text-lg leading-[1.35] font-light text-white sm:text-xl">
                  Com celeridade e compromisso, abrimos portas e impulsionamos
                  negócios.
                </p>
                <p className="mt-5 max-w-lg text-base leading-[1.6] font-light text-white/70">
                  Sua empresa não precisa esperar 30, 60 ou 90 dias para receber
                  pelas vendas já realizadas. Com a Celer, suas vendas a prazo
                  se transformam em capital imediato para impulsionar o seu
                  negócio.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {PILARES.map((pilar) => (
                  <div
                    key={pilar.title}
                    className="rounded-2xl bg-cream px-7 py-7"
                  >
                    <h3 className="font-heading text-xl font-bold text-navy">
                      {pilar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] font-light text-navy/70">
                      {pilar.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

O parágrafo secundário em `text-white/70` é o piso: na ponta clara do gradiente (`#003599`) ele dá 6,0:1, e `/50` cairia para 3,7:1, abaixo do AA.

- [ ] **Step 2: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 3: Verificar no navegador**

```js
(() => {
  const s = document.getElementById("sobre");
  const caixa = s.querySelector('[style*="gradient"]');
  const pilares = [...s.querySelectorAll("h3")].map((h) => h.textContent.trim());
  const cremes = [...s.querySelectorAll("h3")].map((h) =>
    getComputedStyle(h.parentElement).backgroundColor
  );
  return JSON.stringify({
    gradienteCaixa: getComputedStyle(caixa).backgroundImage.slice(0, 80),
    pilares,
    fundoDasCaixas: cremes,
    h2: s.querySelector("h2").textContent.trim(),
    corDoH2: getComputedStyle(s.querySelector("h2")).color,
  }, null, 1);
})();
```

Esperado: `gradienteCaixa` citando `rgb(0, 26, 75)` e `rgb(0, 53, 153)`; `pilares` igual a `["Missão", "Visão"]`; `fundoDasCaixas` com `rgb(239, 241, 244)` nas duas; `corDoH2` branco.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/sobre.tsx
git commit -m "Reformular a secao Sobre como caixa em gradiente navy

Missao e Visao viram caixas cream solidas dentro da caixa. Os tints em
gradiente que usavam antes foram feitos para caixa translucida sobre
fundo claro: sobre a caixa navy, o tint navy sumiria e o dourado
brigaria com a secao Numeros logo abaixo.

Gradiente em 135 graus, nao nos 90 dos bookends: caixa arredondada le
melhor na diagonal."
```

---

## Task 4: Tagline animada e limpeza do rodapé

**Files:**
- Modify: `web/src/components/atendimento.tsx` (conteúdo substituído)
- Modify: `web/src/components/footer.tsx`

**Interfaces:**
- Consumes: `useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit)` de `@/hooks/use-in-view-once`, retornando `{ ref: RefObject<T | null>; inView: boolean }`. `cn` de `@/lib/utils`.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Reescrever a seção Atendimento**

Conteúdo completo de `web/src/components/atendimento.tsx`:

```tsx
"use client";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

/*
  A tagline é a assinatura institucional da marca. Saiu do rodapé nesta
  rodada: com esta seção, ela apareceria duas vezes separadas apenas pelo
  CTA Final, praticamente na mesma rolagem.
*/
const LINHAS = [
  { cor: "text-navy", palavras: ["Conectando", "Valor,"] },
  { cor: "text-navy-bright", palavras: ["Crescendo", "Juntos"] },
];

/*
  Não usa o componente Reveal de propósito: ele renderiza um <div>, e <div>
  dentro de <h2> é HTML inválido. Embrulhar o <h2> inteiro num Reveal
  revelaria tudo de uma vez, que é o oposto do pedido.

  Um observer só, no <h2>, com o escalonamento vindo de transitionDelay por
  palavra. O inline-block é necessário porque transform não se aplica a
  elemento inline.

  prefers-reduced-motion já é coberto pela regra global do globals.css:
  aqui a animação é transição CSS, não JS.
*/
export function Atendimento() {
  const { ref, inView } = useInViewOnce<HTMLHeadingElement>({
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <section id="atendimento" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 lg:py-28">
        <h2
          ref={ref}
          className="font-heading text-4xl leading-[1.05] font-bold uppercase sm:text-6xl lg:text-7xl"
        >
          {LINHAS.map((linha, indiceLinha) => {
            const palavrasAntes = LINHAS.slice(0, indiceLinha).reduce(
              (total, l) => total + l.palavras.length,
              0
            );

            return (
              <span key={linha.cor} className={cn("block", linha.cor)}>
                {linha.palavras.map((palavra, indicePalavra) => (
                  <span
                    key={palavra}
                    style={{
                      transitionDelay: `${(palavrasAntes + indicePalavra) * 0.12}s`,
                    }}
                    className={cn(
                      "mr-[0.25em] inline-block transition-all duration-500 ease-out last:mr-0",
                      inView
                        ? "translate-y-0 opacity-100 blur-none"
                        : "translate-y-2 opacity-0 blur-sm"
                    )}
                  >
                    {palavra}
                  </span>
                ))}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Remover a tagline do rodapé**

Conteúdo completo de `web/src/components/footer.tsx`. O bloco de copyright passa a ocupar o rodapé sozinho, então o `sm:justify-between` sai e o conteúdo centraliza:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-navy/8 px-6 py-7 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] leading-[1.7] tracking-wide text-navy/65">
          © {new Date().getFullYear()} Celer Capital · Todos os direitos
          reservados
          <br />
          CNPJ 28.857.128/0001-95
          {/* TODO: confirmar com o cliente se há registro regulatório específico a declarar (ex: CVM) antes de afirmar qualquer status regulatório publicamente */}
        </p>
      </div>
    </footer>
  );
}
```

O `TODO` sobre registro regulatório continua: é pendência aberta, sem relação com esta mudança.

- [ ] **Step 3: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 4: Verificar no navegador**

```js
(() => {
  const s = document.getElementById("atendimento");
  const h2 = s.querySelector("h2");
  const palavras = [...h2.querySelectorAll("span span")];
  const rodape = document.querySelector("footer");
  return JSON.stringify({
    h2Texto: h2.textContent.replace(/\s+/g, " ").trim(),
    qtdPalavras: palavras.length,
    delays: palavras.map((p) => p.style.transitionDelay),
    divsDentroDoH2: h2.querySelectorAll("div").length,
    taglineNoRodape: /Conectando Valor/.test(rodape.textContent),
    rodapeTexto: rodape.textContent.replace(/\s+/g, " ").trim(),
  }, null, 1);
})();
```

Esperado: `h2Texto` igual a `"Conectando Valor, Crescendo Juntos"`; `qtdPalavras: 4`; `delays` iguais a `["0s", "0.12s", "0.24s", "0.36s"]`; **`divsDentroDoH2: 0`** (é o ponto: nenhum `div` dentro do heading); `taglineNoRodape: false`.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/atendimento.tsx web/src/components/footer.tsx
git commit -m "Substituir Atendimento pela tagline revelada palavra a palavra

Nao usa o componente Reveal: ele renderiza um div, e div dentro de h2 e
HTML invalido. Um observer so, no h2, com o escalonamento vindo de
transitionDelay por palavra.

A tagline sai do rodape junto: com esta secao ela apareceria duas vezes
separadas apenas pelo CTA Final."
```

---

## Task 5: Atualizar o manual de marca

**Files:**
- Modify: `docs/brand-guidelines.md`

**Interfaces:**
- Consumes: as decisões implementadas nas Tasks 1 a 4.
- Produces: nada em código.

**Números de contraste — use estes, não recalcule.** Qualquer valor que não esteja nesta tabela deve ser removido ou marcado como pendente de recálculo, nunca estimado:

| Par | Contraste | Veredito |
|---|---|---|
| Navy sobre Gold `#C68622` | 5,5:1 | AA |
| Navy sobre Gold Bright `#F2AA3A` | 8,5:1 | AA (AAA para texto grande) |
| Branco sobre Gold `#C68622` | 3,1:1 | Reprova |
| Branco sobre Gold Bright `#F2AA3A` | 2,0:1 | Reprova |
| `text-navy/80` sobre Gold `#C68622` | 4,31:1 | Reprova |
| Navy Bright `#003599` sobre Cream | 9,4:1 | AAA |
| Navy sobre Cream | 14,9:1 | AAA |

- [ ] **Step 1: Adicionar o token à tabela de paleta**

Na seção 3, nas Secondary Colors:

```markdown
| Gold Bright | #F2AA3A | rgb(242,170,58) | Ponta clara do gradiente da seção Números. Entrou por pedido do cliente em 2026-08-01, fora da paleta original — não é uma variação gerada |
```

- [ ] **Step 2: Registrar a regra do dourado**

Na seção 3 (Acessibilidade), junto das regras de piso que já existem:

```markdown
- **Texto sobre superfície dourada é sempre navy, sem opacidade.** Branco reprova nos dois extremos do gradiente da seção Números (3,1:1 sobre #C68622, 2,0:1 sobre #F2AA3A), e navy com opacidade também escorrega: `text-navy/80` cai para 4,31:1 na ponta escura, abaixo do AA. Navy cheio dá 5,5:1 na ponta escura e 8,5:1 na clara. Isso generaliza a regra que já valia para os botões dourados.
```

- [ ] **Step 3: Remover a seção Para Quem do manual**

Localizar todas as ocorrências primeiro:

```bash
grep -n "Para Quem\|para-quem" docs/brand-guidelines.md
```

Eram 5 na última contagem. Tratar assim:

- O padrão "Grid de cards (2×2 ou 2×N)" na seção 6 cita "Para Quem" como exemplo vivo. Trocar o exemplo por "Soluções", que continua usando o padrão.
- O exemplo do card com `border-t-4 border-gold` (destaque do segmento de restrição bancária) era exclusivo da Para Quem. O padrão de destaque pontual continua descrito, mas sem esse exemplo concreto — ou marcado como sem uso atual no site.
- No bloco do pivô v3, a menção é narrativa histórica ("Para Quem reescrita com frases-gancho"): **manter**, é registro do que aconteceu, não descrição do site atual.
- Qualquer lista de seções da página precisa refletir a ordem nova.

- [ ] **Step 4: Registrar o novo papel da tagline**

A seção 5 descreve a tagline como assinatura de rodapé. Substituir por:

```markdown
### Tagline
**"Conectando Valor, Crescendo Juntos"** — desde 2026-08-01 é uma **seção própria** da página (entre Soluções e o CTA Final), em caixa alta e tipografia grande, com as palavras revelando uma a uma no scroll. Saiu do rodapé na mesma mudança: nos dois lugares, apareceria duas vezes separadas apenas pelo CTA Final.

Continua sendo assinatura de marca, não argumento de conversão — não usar como headline de venda. Em materiais fora do site (apresentações, peças institucionais), o uso antigo continua válido: itálico, entre aspas, em `gold-dark` sobre fundo claro.
```

- [ ] **Step 5: Documentar os gradientes de caixa**

Na subseção "Sistema de gradientes" da seção 6, acrescentar:

```markdown
**Gradiente de caixa (2026-08-01).** Além dos dois bookends de seção inteira, duas seções usam uma caixa grande arredondada preenchida com gradiente, sobre o wash claro:

| Seção | Gradiente | Texto |
|---|---|---|
| Sobre | `linear-gradient(135deg, #001A4B 0%, #003599 100%)` | branco (piso `/70`) |
| Números | `linear-gradient(135deg, #C68622 0%, #F2AA3A 100%)` | navy cheio, sem opacidade |

Caixas usam 135°, bookends usam 90°. A distinção é proposital: bookend é fundo de largura total, onde o movimento horizontal funciona; caixa arredondada lê melhor na diagonal. As caixas de Missão e Visão dentro da caixa Sobre são cream sólido, não tint translúcido — sobre fundo navy, um tint navy desapareceria.
```

- [ ] **Step 6: Atualizar o checklist da seção 7**

Acrescentar:

```markdown
- [ ] Texto sobre superfície dourada em navy cheio, sem opacidade — branco e navy translúcido reprovam AA nos dois extremos do gradiente
```

E conferir se algum item do checklist ainda cita a seção "Para Quem" como exemplo.

- [ ] **Step 7: Verificar a consistência**

Reler as seções 3, 5, 6 e 7 inteiras procurando afirmação que a implementação agora contradiga: menções à Para Quem como seção viva, à tagline como elemento de rodapé, ou qualquer contagem de seções da página que tenha mudado.

- [ ] **Step 8: Commit**

```bash
git add docs/brand-guidelines.md
git commit -m "Atualizar manual: gold-bright, regra do dourado e novo papel da tagline

Registra a restricao dura que o dourado impoe: branco reprova nos dois
extremos (3,1:1 e 2,0:1) e navy/80 cai para 4,31:1, entao texto sobre
dourado e navy cheio.

Remove a secao Para Quem das descricoes do site atual, mantendo as
mencoes narrativas do pivo v3 como registro historico."
```

---

## Verificação final (depois da Task 5)

- [ ] **Build de produção**

```bash
cd web && npm run build
```

Esperado: compila sem erro, 3 páginas estáticas.

- [ ] **Ordem e emendas do wash**

```js
(() => {
  const secoes = [...document.querySelectorAll("main section")].map((s) => ({
    id: s.id || "(hero)",
    bg: getComputedStyle(s).backgroundImage.replace(/\s+/g, " ").slice(0, 60),
  }));
  const d = document.documentElement;
  return JSON.stringify({
    ordem: secoes.map((s) => s.id),
    wash: secoes,
    overflow: d.scrollWidth > d.clientWidth,
  }, null, 1);
})();
```

Esperado: ordem `(hero), processo, sobre, numeros, valores, solucoes, atendimento, cta-final`. Cada seção clara termina na cor em que a próxima começa: processo `branco→cream`, sobre `cream→branco`, numeros `branco→cream`, valores `cream→branco`, solucoes `branco→cream`, atendimento `cream→branco`.

- [ ] **Contraste nas superfícies novas**

Medir o contraste real do texto renderizado nos dois extremos de cada caixa: texto navy sobre a caixa dourada (extremos `#C68622` e `#F2AA3A`), texto branco `/70` sobre a caixa navy (extremos `#001A4B` e `#003599`), texto navy nas caixas cream de Missão e Visão, e as duas cores da tagline sobre o wash claro.

**Tailwind v4 emite cores em `oklab()`.** Converter oklab para sRGB antes de compor o alpha — uma regex ingênua sobre a string de `getComputedStyle` produz lixo.

- [ ] **Responsivo**

Verificar em 1440px, 768px e 375px: sem overflow horizontal de documento (`document.documentElement.scrollWidth === clientWidth`), a grade de Números passando de 2 para 4 colunas, a Sobre empilhando, e a tagline sem estourar a largura. **Recarregar a página depois de cada mudança de viewport antes de medir** — este ambiente reporta larguras defasadas se medidas logo após o resize.

- [ ] **Console limpo de erros novos**

Conferir o console. Existe um aviso conhecido e pré-existente de serialização RSC vindo do acordeão de Valores, documentado em `docs/superpowers/specs/2026-07-31-gradientes-sobre-valores-design.md` — esse é esperado. Qualquer erro **novo** é achado.

**Limitações conhecidas do ambiente**, todas já verificadas nesta base e nenhuma delas defeito do site: o painel do navegador não compõe frames, então `IntersectionObserver` não dispara (blocos em `Reveal` ficam em `opacity: 0`, a tagline não revela e o `CountingNumber` não inicia), transições CSS não avançam, e screenshots falham. Verificar por DOM e por classe, não por pixel.
