# Gradientes + Sobre + Valores — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as cores chapadas do site por um sistema de gradientes leves, e adicionar duas seções institucionais (Sobre e Valores) depois de "Para Quem".

**Architecture:** Um token de cor novo (`--color-navy-bright: #003599`) e duas utilities de wash em `globals.css` formam a base. Um componente `GradientBackground` em `components/ui/` serve as camadas de fundo escuras (Hero e CTA Final). As seções claras recebem o wash por classe utilitária, e os tints planos dos cards viram gradientes diagonais. As duas seções novas seguem os padrões já existentes (`Reveal`, `max-w-5xl`, `rounded-3xl`), e o acordeão de Valores é um componente próprio em `components/ui/`.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, Tailwind CSS 4.3.2, TypeScript 5, lucide-react 1.24.0.

## Global Constraints

**Este projeto não tem test runner.** `package.json` expõe apenas `dev`, `build`, `start` e `lint` — não existe vitest, jest ou playwright instalado. Não instale um. O ciclo de verificação de cada tarefa é: `npx tsc --noEmit`, `npx eslint .`, e asserções no DOM pelo navegador. Onde este plano diz "teste", é isso que significa.

- **Leia antes de escrever código:** `web/AGENTS.md` manda consultar `node_modules/next/dist/docs/` — esta versão do Next tem breaking changes em relação ao conhecimento de treino.
- **Paleta fechada.** Únicas cores permitidas: navy `#001A4B`, navy-bright `#003599`, gold `#C68622`, gold-light `#E1A951`, gold-dark `#6D4A13`, cream `#EFF1F4`, ink `#0B0C0C`, whatsapp `#1DA851`. Nenhum tom fora desta lista.
- **Tailwind v4:** use `bg-linear-to-*`. O nome `bg-gradient-to-*` ainda funciona mas está depreciado nesta versão.
- **`text-gold` nunca sobre fundo claro** — use `text-gold-dark`. Sobre fundo escuro, `text-gold` é permitido.
- **Fonte de display (`font-heading`) nunca abaixo de 20px** e nunca em `font-semibold`/600 — só existem cortes reais 300/400/700. Use `font-bold`.
- **Pisos de opacidade de texto:** navy sobre cream, mínimo `/65`. Branco sobre o gradiente escuro, mínimo `/70` (abaixo disso reprova AA na ponta clara do gradiente).
- **Sem em dash (—) na copy visível.** Foi removido de todo o site no commit `96fa1ee`. Em comentários de código é livre.
- **Nenhum número, prazo ou promessa não confirmada** na copy. Toda copy deste plano veio pronta do cliente; não invente frases novas.
- **Server Components por padrão.** `"use client"` só em arquivo que realmente use estado ou evento.
- Cantos sempre arredondados: `rounded-2xl`+ em cards, `rounded-full` em botões.

---

## Estrutura de arquivos

**Criar:**
| Arquivo | Responsabilidade |
|---|---|
| `web/src/components/ui/gradient-background.tsx` | Camada de fundo absoluta com gradiente + as constantes dos dois gradientes de marca |
| `web/src/components/sobre.tsx` | Seção Sobre (texto + caixas de Missão/Visão) |
| `web/src/components/ui/interactive-accordion.tsx` | Acordeão genérico (desktop) + grade equivalente (mobile) |
| `web/src/components/valores.tsx` | Dados dos 6 valores + shell da seção |

**Modificar:**
| Arquivo | O quê |
|---|---|
| `web/src/app/globals.css` | Token `--color-navy-bright`, utilities `surface-wash-down` / `surface-wash-up` |
| `web/src/components/hero.tsx` | Gradiente + correção de contraste |
| `web/src/components/cta-final.tsx` | Gradiente |
| `web/src/components/processo.tsx` | Wash |
| `web/src/components/para-quem.tsx` | Wash + tints em gradiente |
| `web/src/components/solucoes.tsx` | Wash + nós em gradiente |
| `web/src/components/atendimento.tsx` | Wash |
| `web/src/components/navbar.tsx` | Link `#sobre` |
| `web/src/app/page.tsx` | Inserir `<Sobre />` e `<Valores />` |
| `docs/brand-guidelines.md` | Token novo, sistema de gradientes, exceções, correção do gold defasado |

---

## Task 1: Token, camada de gradiente e Hero

**Files:**
- Modify: `web/src/app/globals.css` (bloco `@theme`, linha ~61-77)
- Create: `web/src/components/ui/gradient-background.tsx`
- Modify: `web/src/components/hero.tsx`

**Interfaces:**
- Produces: `GradientBackground({ gradient, className })` — componente de camada absoluta. Constantes exportadas `HERO_GRADIENT` e `CTA_GRADIENT` (strings de `linear-gradient`). Token CSS `--color-navy-bright`, disponível como classe Tailwind `navy-bright`.
- Consumes: nada.

- [ ] **Step 1: Adicionar o token de cor**

Em `web/src/app/globals.css`, dentro do bloco `@theme`, logo abaixo da linha `--color-navy: #001a4b;`:

```css
  /*
    navy-bright: pedido do cliente (2026-07-31) para o gradiente da Hero.
    NÃO estava na paleta institucional original — entrou por decisão do
    cliente, não por variação inventada. Ver
    docs/superpowers/specs/2026-07-31-gradientes-sobre-valores-design.md
  */
  --color-navy-bright: #003599;
```

- [ ] **Step 2: Adicionar as utilities de wash**

No mesmo arquivo, depois do bloco `@layer base` (após a linha `}` que fecha o bloco, antes do `@media (prefers-reduced-motion...)`):

```css
/*
  Wash sutil das seções claras. A direção alterna de seção para seção
  (down, up, down, ...) para que a cor do fim de uma seção seja a mesma do
  início da próxima — a emenda fica invisível e o scroll lê como uma
  superfície contínua em vez de faixas.
*/
@utility surface-wash-down {
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    var(--color-cream) 100%
  );
}

@utility surface-wash-up {
  background-image: linear-gradient(
    180deg,
    var(--color-cream) 0%,
    #ffffff 100%
  );
}
```

- [ ] **Step 3: Criar o componente de camada de gradiente**

Criar `web/src/components/ui/gradient-background.tsx`:

```tsx
import { cn } from "@/lib/utils";

/*
  Gradientes de marca dos dois "bookends" escuros da página. Os dois fazem o
  mesmo movimento horizontal; o do CTA Final é uma oitava mais escuro, para
  as duas pontas da página rimarem sem ficarem idênticas.
*/
export const HERO_GRADIENT =
  "linear-gradient(90deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)";

export const CTA_GRADIENT =
  "linear-gradient(90deg, var(--color-ink) 0%, var(--color-navy) 100%)";

interface GradientBackgroundProps {
  /** Valor CSS completo de `background` — normalmente um linear-gradient(). */
  gradient: string;
  className?: string;
}

/**
 * Camada de fundo absoluta para seções com gradiente. A seção precisa ser
 * `relative`, e o conteúdo por cima precisa de `relative z-10` — elementos
 * estáticos pintam abaixo de elementos posicionados.
 */
export function GradientBackground({
  gradient,
  className,
}: GradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      style={{ background: gradient }}
    />
  );
}
```

- [ ] **Step 4: Aplicar o gradiente na Hero e corrigir o contraste**

Em `web/src/components/hero.tsx`:

Adicionar ao bloco de imports:

```tsx
import {
  GradientBackground,
  HERO_GRADIENT,
} from "@/components/ui/gradient-background";
```

Trocar a abertura da `<section>` (remover `bg-navy`) e inserir a camada antes do glow dourado:

```tsx
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-32 pb-20 text-center sm:px-10">
      <GradientBackground gradient={HERO_GRADIENT} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 z-0 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,134,34,0.12)_0%,transparent_65%)]"
      />
```

Correção de contraste — o parágrafo, de `text-white/50` para `text-white/70`:

```tsx
        <p className="mx-auto mt-6 max-w-lg text-base leading-[1.6] font-light text-white/70 sm:text-lg">
```

E o botão "Ver como funciona", de `text-white/60` para `text-white/70`:

```tsx
              "h-auto rounded-full border-white/20 bg-transparent px-6 py-3.5 text-[10px] font-bold tracking-wider text-white/70 uppercase hover:bg-white/5 hover:text-white"
```

Motivo (não é preferência estética): `#003599` é bem mais claro que `#001A4B`. Na metade direita do gradiente, `text-white/50` cai para 3,7:1 e reprova AA. Em `/70` sobe para 6,0:1.

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída (sucesso).

- [ ] **Step 6: Verificar no navegador**

Subir o preview (`preview_start` com `{name: "web-dev"}`, config já existe em `.claude/launch.json`) e rodar no console da página:

```js
(() => {
  const hero = document.querySelector("section");
  const layer = hero.querySelector('[aria-hidden="true"]');
  const cs = getComputedStyle(layer);
  const p = hero.querySelector("p");
  return JSON.stringify({
    temGradiente: cs.backgroundImage.includes("gradient"),
    gradiente: cs.backgroundImage.slice(0, 90),
    corParagrafo: getComputedStyle(p).color,
    heroBgSolido: getComputedStyle(hero).backgroundColor,
  });
})();
```

Esperado: `temGradiente: true`, o gradiente citando `rgb(0, 26, 75)` e `rgb(0, 53, 153)`, e `heroBgSolido` transparente ou `rgba(0, 0, 0, 0)` (o `bg-navy` saiu).

- [ ] **Step 7: Commit**

```bash
git add web/src/app/globals.css web/src/components/ui/gradient-background.tsx web/src/components/hero.tsx
git commit -m "Adicionar gradiente na Hero e token navy-bright

Sobe o paragrafo e o botao secundario da Hero de white/50 e white/60
para white/70: na ponta clara do gradiente (#003599) as opacidades
antigas caiam para 3,7:1 e 4,7:1, reprovando ou raspando o AA."
```

---

## Task 2: Gradiente no CTA Final, wash nas seções claras e cards

**Files:**
- Modify: `web/src/components/cta-final.tsx`
- Modify: `web/src/components/processo.tsx:29`
- Modify: `web/src/components/para-quem.tsx:4-33` (dados) e `:33` (section)
- Modify: `web/src/components/solucoes.tsx:35` (nó) e `:55` (section)
- Modify: `web/src/components/atendimento.tsx:5`

**Interfaces:**
- Consumes: `GradientBackground` e `CTA_GRADIENT` da Task 1; utilities `surface-wash-down` / `surface-wash-up` da Task 1.
- Produces: nada consumido por tarefas posteriores. As Tasks 3 e 4 usam as mesmas utilities de wash diretamente.

- [ ] **Step 1: Gradiente no CTA Final**

Em `web/src/components/cta-final.tsx`, adicionar ao bloco de imports:

```tsx
import {
  CTA_GRADIENT,
  GradientBackground,
} from "@/components/ui/gradient-background";
```

Trocar a abertura da section (remover `bg-ink`) e inserir a camada antes do glow:

```tsx
    <section
      id="cta-final"
      className="relative overflow-hidden py-20 text-center sm:py-24 lg:py-28"
    >
      <GradientBackground gradient={CTA_GRADIENT} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,134,34,0.09)_0%,transparent_65%)]"
      />
```

O `text-white/70` do parágrafo e o `text-white/20` do disclaimer ficam como estão: o gradiente do CTA vai de ink até navy, ambos mais escuros que `#003599`, então o contraste só melhora em relação ao ink chapado de hoje.

- [ ] **Step 2: Aplicar o wash nas quatro seções claras existentes**

A direção alterna para as emendas ficarem invisíveis. Aplicar exatamente assim:

`processo.tsx` linha 29:
```tsx
    <section id="processo" className="surface-wash-down relative overflow-hidden">
```

`para-quem.tsx` linha 33:
```tsx
    <section id="para-quem" className="surface-wash-up">
```

`solucoes.tsx` linha 55:
```tsx
    <section id="solucoes" className="surface-wash-down">
```

`atendimento.tsx` linha 5:
```tsx
    <section id="atendimento" className="surface-wash-up">
```

As Tasks 3 e 4 inserem Sobre (`surface-wash-down`) e Valores (`surface-wash-up`) entre Para Quem e Soluções, o que mantém a alternância: Processo down, Para Quem up, Sobre down, Valores up, Soluções down, Atendimento up.

- [ ] **Step 3: Trocar os tints planos dos cards por gradientes**

Em `web/src/components/para-quem.tsx`, no array `SEGMENTS`, trocar os três valores de `tint`:

```tsx
    tint: "bg-linear-to-br from-navy/[0.07] to-navy/[0.015]",
```
```tsx
    tint: "bg-linear-to-br from-navy/[0.08] to-navy/[0.02]",
```
```tsx
    tint: "bg-linear-to-br from-gold/[0.16] to-gold/[0.05]",
```

Nessa ordem (segmentos 01, 02, 03). O `border-t-4 border-gold` do segmento 03 e os valores de `numberColor` não mudam.

Em `web/src/components/solucoes.tsx` linha 35, o nó de solução troca `bg-white`:

```tsx
      <div className="w-32 rounded-2xl border border-navy/10 bg-linear-to-b from-white to-cream px-4 py-3 text-center text-[11px] leading-tight font-bold text-navy shadow-md shadow-navy/5 sm:w-44 sm:px-5 sm:py-4 sm:text-sm lg:w-48 lg:text-base">
```

- [ ] **Step 4: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 5: Verificar as emendas no navegador**

Rodar no console:

```js
(() => {
  const ids = ["processo", "para-quem", "solucoes", "atendimento"];
  return JSON.stringify(
    ids.map((id) => {
      const el = document.getElementById(id);
      return {
        id,
        bg: getComputedStyle(el).backgroundImage.slice(0, 70),
      };
    }),
    null,
    1
  );
})();
```

Esperado: os quatro com `linear-gradient(180deg, ...)`. Processo e Soluções começam em `rgb(255, 255, 255)`; Para Quem e Atendimento começam em `rgb(239, 241, 244)`.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/cta-final.tsx web/src/components/processo.tsx web/src/components/para-quem.tsx web/src/components/solucoes.tsx web/src/components/atendimento.tsx
git commit -m "Aplicar gradientes no CTA Final, nas secoes claras e nos cards

A direcao do wash alterna de secao para secao para que a cor do fim de
uma seja a do inicio da proxima, deixando a emenda invisivel."
```

---

## Task 3: Seção Sobre

**Files:**
- Create: `web/src/components/sobre.tsx`
- Modify: `web/src/components/navbar.tsx:10-14` (`NAV_LINKS`)
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: utilities de wash da Task 1; `Reveal` de `@/components/motion/reveal` (já existe).
- Produces: componente `Sobre()` sem props, exportado de `@/components/sobre`. Âncora `#sobre`.

- [ ] **Step 1: Criar a seção**

Criar `web/src/components/sobre.tsx`. Toda a copy abaixo veio pronta do cliente — não reescrever:

```tsx
import { Reveal } from "@/components/motion/reveal";

/*
  Missão e Visão reusam a mesma dupla de tints de "Para Quem" (navy suave +
  gold suave) para a seção não introduzir vocabulário visual novo.
*/
const PILARES = [
  {
    title: "Missão",
    tint: "bg-linear-to-br from-navy/[0.07] to-navy/[0.015]",
    text: "Impulsionar empresas por meio da antecipação de recebíveis e de soluções financeiras inteligentes, oferecendo agilidade, segurança e compromisso para fortalecer negócios, gerar oportunidades e construir parcerias duradouras.",
  },
  {
    title: "Visão",
    tint: "bg-linear-to-br from-gold/[0.16] to-gold/[0.05]",
    text: "Ser a principal parceira financeira das empresas brasileiras, sendo referência em antecipação de recebíveis e reconhecida pela confiança, agilidade e excelência, ampliando nossa atuação com soluções financeiras estratégicas que impulsionem o crescimento sustentável de nossos clientes.",
  },
];

/*
  Duas exceções deliberadas ao manual de marca, ambas pedido do cliente
  (2026-07-31) e registradas em docs/brand-guidelines.md:
  1. É a única seção com título alinhado à esquerda — o manual pede blocos
     de seção centralizados.
  2. O parágrafo explica brevemente o mecanismo da antecipação, que o pivô
     v3 tinha removido do site por considerar redundante para o público.
*/
export function Sobre() {
  return (
    <section id="sobre" className="surface-wash-down">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <div className="text-left">
              <h2 className="font-heading text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:text-4xl">
                Sobre nós
              </h2>
              <p className="mt-5 text-lg leading-[1.35] font-light text-navy sm:text-xl">
                Com celeridade e compromisso, abrimos portas e impulsionamos
                negócios.
              </p>
              <p className="mt-5 max-w-lg text-base leading-[1.6] font-light text-navy/70">
                Sua empresa não precisa esperar 30, 60 ou 90 dias para receber
                pelas vendas já realizadas. Com a Celer, suas vendas a prazo se
                transformam em capital imediato para impulsionar o seu negócio.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {PILARES.map((pilar, i) => (
              <Reveal key={pilar.title} delay={0.1 + i * 0.08}>
                <div className={`rounded-3xl px-7 py-8 ${pilar.tint}`}>
                  <h3 className="font-heading text-xl font-bold text-navy">
                    {pilar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] font-light text-navy/70">
                    {pilar.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

`text-xl` nos títulos das caixas é exatamente 20px, o piso da fonte de display. Não reduzir.

- [ ] **Step 2: Adicionar o link na navbar**

Em `web/src/components/navbar.tsx`, o array `NAV_LINKS` passa a ser (a ordem espelha a ordem real das seções):

```tsx
const NAV_LINKS = [
  { href: "#processo", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#sobre", label: "Sobre" },
  { href: "#solucoes", label: "Soluções" },
];
```

Valores não recebe link, por decisão do usuário: o estado pill (`max-w-3xl`) fica apertado com cinco.

- [ ] **Step 3: Inserir na página**

Em `web/src/app/page.tsx`, adicionar o import e inserir `<Sobre />` logo depois de `<ParaQuem />`:

```tsx
import { Sobre } from "@/components/sobre";
```

```tsx
        <ParaQuem />
        <Sobre />
        <Solucoes />
```

(`<Valores />` entra entre `<Sobre />` e `<Solucoes />` na Task 4.)

- [ ] **Step 4: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 5: Verificar no navegador**

```js
(() => {
  const s = document.getElementById("sobre");
  const link = document.querySelector('header a[href="#sobre"]');
  const boxes = [...s.querySelectorAll("h3")].map((h) => h.textContent.trim());
  return JSON.stringify({
    secaoExiste: !!s,
    linkNavbar: !!link,
    caixas: boxes,
    ordem: [...document.querySelectorAll("main section[id]")].map((x) => x.id),
    h2: s.querySelector("h2").textContent.trim(),
  });
})();
```

Esperado: `caixas: ["Missão", "Visão"]`, `linkNavbar: true`, e `sobre` aparecendo entre `para-quem` e `solucoes` na ordem.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/sobre.tsx web/src/components/navbar.tsx web/src/app/page.tsx
git commit -m "Adicionar secao Sobre com Missao e Visao

Unica secao do site com titulo alinhado a esquerda e com explicacao do
mecanismo de antecipacao: duas excecoes ao manual, ambas pedido do
cliente e documentadas no componente."
```

---

## Task 4: Seção Valores com acordeão interativo

**Files:**
- Create: `web/src/components/ui/interactive-accordion.tsx`
- Create: `web/src/components/valores.tsx`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: utilities de wash da Task 1; `Reveal`; token `--color-navy-bright` da Task 1.
- Produces: `InteractiveAccordion({ panels, className })` e o tipo `AccordionPanel { id: string; title: string; description: string; icon: LucideIcon }`, ambos exportados de `@/components/ui/interactive-accordion`. Componente `Valores()` sem props. Âncora `#valores`.

- [ ] **Step 1: Criar o acordeão**

Criar `web/src/components/ui/interactive-accordion.tsx`. Este arquivo é uma reescrita do componente de referência fornecido pelo cliente, com quatro correções obrigatórias (largura fluida no lugar de `w-[400px]`/`w-[60px]`, grade separada no mobile, `<button>` com `onFocus` para teclado, props tipadas):

```tsx
"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccordionPanel {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface InteractiveAccordionProps {
  panels: AccordionPanel[];
  className?: string;
}

/*
  O ângulo varia por índice para a fileira ler como família sem virar seis
  painéis idênticos. As duas cores são as da marca, via token.
*/
const ANGULOS = [135, 150, 120, 165, 105, 140];

function gradienteDoPainel(index: number) {
  const angulo = ANGULOS[index % ANGULOS.length];
  return `linear-gradient(${angulo}deg, var(--color-navy) 0%, var(--color-navy-bright) 100%)`;
}

/**
 * Acordeão horizontal dirigido por hover e por foco de teclado. Abaixo de
 * `md` o acordeão dá lugar a uma grade estática — texto rotacionado a 90°
 * em coluna estreita não funciona no celular.
 *
 * Só um dos dois blocos está no DOM visível por vez (o outro fica em
 * `display:none`, que também o remove da árvore de acessibilidade), então
 * não há anúncio duplicado para leitores de tela.
 */
export function InteractiveAccordion({
  panels,
  className,
}: InteractiveAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden",
          className
        )}
      >
        {panels.map((panel, i) => {
          const Icon = panel.icon;
          return (
            <li
              key={panel.id}
              className="rounded-2xl px-6 py-6 text-left"
              style={{ background: gradienteDoPainel(i) }}
            >
              <Icon className="size-6 text-gold" aria-hidden="true" />
              <h3 className="font-heading mt-4 text-xl font-bold text-white">
                {panel.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.6] font-light text-white/75">
                {panel.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div className={cn("hidden gap-3 md:flex", className)}>
        {panels.map((panel, i) => {
          const Icon = panel.icon;
          const isActive = i === activeIndex;

          return (
            <button
              key={panel.id}
              type="button"
              aria-expanded={isActive}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              style={{ background: gradienteDoPainel(i), flexBasis: 0 }}
              className={cn(
                "relative h-[420px] cursor-pointer overflow-hidden rounded-3xl text-left transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
                isActive ? "grow-[3]" : "grow"
              )}
            >
              <span className="absolute inset-x-0 top-0 flex justify-center pt-7">
                <Icon
                  className={cn(
                    "size-6 shrink-0 transition-colors duration-300",
                    isActive ? "text-gold" : "text-white/70"
                  )}
                  aria-hidden="true"
                />
              </span>

              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 px-7 pb-7 transition-opacity duration-300",
                  isActive
                    ? "opacity-100 delay-150"
                    : "pointer-events-none opacity-0"
                )}
              >
                <span className="font-heading block text-2xl font-bold text-white">
                  {panel.title}
                </span>
                <span className="mt-2 block text-sm leading-[1.6] font-light text-white/75">
                  {panel.description}
                </span>
              </span>

              {/* Título rotacionado do estado fechado. aria-hidden porque o
                  bloco acima já carrega título e descrição para o leitor. */}
              <span
                aria-hidden="true"
                className={cn(
                  "font-heading absolute bottom-24 left-1/2 -translate-x-1/2 rotate-90 text-xl font-bold whitespace-nowrap text-white/80 transition-opacity duration-300",
                  isActive
                    ? "pointer-events-none opacity-0"
                    : "opacity-100 delay-150"
                )}
              >
                {panel.title}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
```

Com `flexBasis: 0`, `grow-[3]` no ativo e `grow` nos cinco fechados, a soma é 8 — o painel aberto ocupa 3/8 da largura e cada fechado 1/8. Num container de ~1000px isso dá cerca de 375px aberto e 125px fechado, largura suficiente para o título rotacionado.

- [ ] **Step 2: Criar a seção**

Criar `web/src/components/valores.tsx`. A copy dos seis valores veio pronta do cliente:

```tsx
import {
  Award,
  Handshake,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import {
  InteractiveAccordion,
  type AccordionPanel,
} from "@/components/ui/interactive-accordion";

/*
  Compromisso usa Target, e não um segundo ícone de aperto de mão, para não
  colidir visualmente com Parceria.
*/
const VALORES: AccordionPanel[] = [
  {
    id: "celeridade",
    title: "Celeridade",
    description: "Agilidade com responsabilidade em cada solução.",
    icon: Zap,
  },
  {
    id: "confianca",
    title: "Confiança",
    description: "Transparência, ética e credibilidade em todas as relações.",
    icon: ShieldCheck,
  },
  {
    id: "compromisso",
    title: "Compromisso",
    description: "Dedicação para superar expectativas e gerar resultados.",
    icon: Target,
  },
  {
    id: "parceria",
    title: "Parceria",
    description: "Construímos relações sólidas que impulsionam resultados.",
    icon: Handshake,
  },
  {
    id: "crescimento",
    title: "Crescimento",
    description: "Evoluímos junto com nossos clientes e parceiros.",
    icon: TrendingUp,
  },
  {
    id: "excelencia",
    title: "Excelência",
    description: "Qualidade e melhoria contínua em tudo o que fazemos.",
    icon: Award,
  },
];

export function Valores() {
  return (
    <section id="valores" className="surface-wash-up">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <h2 className="font-heading mb-10 text-center text-[1.75rem] leading-[1.2] font-bold text-navy sm:text-3xl lg:mb-12 lg:text-4xl">
            Nossos valores
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <InteractiveAccordion panels={VALORES} />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Inserir na página**

Em `web/src/app/page.tsx`, adicionar o import e inserir entre `<Sobre />` e `<Solucoes />`:

```tsx
import { Valores } from "@/components/valores";
```

```tsx
        <Sobre />
        <Valores />
        <Solucoes />
```

- [ ] **Step 4: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída. Se `tsc` reclamar do tipo `LucideIcon`, confirmar o nome exportado com:
`node -e "console.log(Object.keys(require('lucide-react')).filter(k=>/Icon$/.test(k)).slice(0,10))"`

- [ ] **Step 5: Verificar a interação e o teclado no navegador**

Os eventos nativos de hover/scroll não disparam neste harness, então dirigir o estado pelo próprio React via foco programático:

```js
(() => {
  const btns = [...document.querySelectorAll("#valores button")];
  const larguras = () => btns.map((b) => Math.round(b.getBoundingClientRect().width));
  const antes = larguras();
  btns[3].focus();
  return new Promise((r) =>
    setTimeout(
      () =>
        r(
          JSON.stringify({
            qtdPaineis: btns.length,
            larguraAntes: antes,
            larguraDepois: larguras(),
            expandidoDepois: btns.map((b) => b.getAttribute("aria-expanded")),
            focoFunciona: document.activeElement === btns[3],
          })
        ),
      700
    )
  );
})();
```

Esperado: `qtdPaineis: 6`; em `larguraAntes` o primeiro painel é o mais largo; depois do `focus()` no índice 3, ele passa a ser o mais largo e `expandidoDepois` marca `"true"` só nessa posição. Isso prova que o acordeão é dirigível por teclado, que era o defeito principal do componente de referência.

Depois checar a versão mobile:

```js
(() => {
  const s = document.getElementById("valores");
  return JSON.stringify({
    gradeMobile: !!s.querySelector("ul"),
    itensGrade: s.querySelectorAll("ul li").length,
    titulos: [...s.querySelectorAll("ul h3")].map((h) => h.textContent.trim()),
  });
})();
```

Esperado: `itensGrade: 6` e os seis nomes de valor. Redimensionar para 375px e confirmar que a `<ul>` fica visível e a `<div>` do acordeão fica em `display:none`.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/ui/interactive-accordion.tsx web/src/components/valores.tsx web/src/app/page.tsx
git commit -m "Adicionar secao Valores com acordeao interativo

Reescreve o componente de referencia com quatro correcoes: largura
fluida no lugar de w-[400px]/w-[60px], que nao cabiam com 6 itens;
grade estatica no mobile no lugar do scroll horizontal com texto
rotacionado; button com onFocus para o acordeao ser dirigivel por
teclado; e props tipadas, que faltavam e quebravam o tsc."
```

---

## Task 5: Atualizar o manual de marca

**Files:**
- Modify: `docs/brand-guidelines.md`

**Interfaces:**
- Consumes: as decisões implementadas nas Tasks 1 a 4.
- Produces: nada em código.

- [ ] **Step 1: Corrigir o dourado defasado**

O documento descreve o gold como `#E2AF0C` e o gold-dark como `#7C6007`, mas o código usa `#C68622` e `#6D4A13` desde o commit `6210a82`. Substituir em todas as ocorrências (seções 3, 7 e "Extractable Fields"), e recalcular os números de contraste citados na seção 3 para os valores reais.

- [ ] **Step 2: Adicionar o token novo à tabela de paleta**

Na seção 3, nas Primary Colors:

```markdown
| Navy Bright | #003599 | rgb(0,53,153) | Ponta clara do gradiente da Hero e dos painéis de Valores. Entrou por pedido do cliente em 2026-07-31, fora da paleta original — não é uma variação gerada |
```

- [ ] **Step 3: Documentar o sistema de gradientes**

Na seção 6 (Componentes de UI), logo depois da subseção "Sistema de fundo único + bookends escuros", inserir:

```markdown
### Sistema de gradientes (2026-07-31)

O cliente pediu para tirar o aspecto chapado do site. O sistema de fundo único
acima continua valendo na estrutura (cream dominante, dois bookends escuros) —
o que muda é que nenhuma dessas superfícies é mais uma cor sólida.

**Bookends escuros.** Os dois fazem o mesmo movimento horizontal, o do CTA Final
uma oitava mais escuro, para as duas pontas da página rimarem sem ficarem iguais:

| Seção | Gradiente |
|---|---|
| Hero | `linear-gradient(90deg, #001A4B 0%, #003599 100%)` |
| CTA Final | `linear-gradient(90deg, #0B0C0C 0%, #001A4B 100%)` |

Implementados pelo componente `GradientBackground` (`components/ui/`), que os
exporta como `HERO_GRADIENT` e `CTA_GRADIENT`. Nunca repetir o hex solto no
componente da seção.

**Seções claras.** Wash sutil entre branco e Cream, aplicado pelas utilities
`surface-wash-down` e `surface-wash-up` (definidas em `globals.css`). A direção
alterna a cada seção, de propósito: a cor do fim de uma seção é a mesma do
início da próxima, então a emenda fica invisível e o scroll lê como uma
superfície contínua em vez de faixas empilhadas. Ordem atual: Processo (down),
Para Quem (up), Sobre (down), Valores (up), Soluções (down), Atendimento (up).
**Ao inserir uma seção nova, conferir a alternância das vizinhas** — colocar
duas `down` seguidas cria uma faixa visível na emenda.

**Cards.** Os tints planos viraram gradientes diagonais (`bg-linear-to-br`),
mantendo os mesmos valores como ponta mais forte: `from-navy/[0.07]
to-navy/[0.015]` e `from-gold/[0.16] to-gold/[0.05]`. Em Tailwind v4 a utility
é `bg-linear-to-*`; `bg-gradient-to-*` está depreciado.
```

- [ ] **Step 4: Registrar o piso de opacidade do lado escuro**

Na seção 3 (Acessibilidade), ao lado da regra que já existe para navy sobre cream:

```markdown
- **Piso de opacidade para texto branco sobre o gradiente escuro:** `/70`. O gradiente da Hero termina em #003599, bem mais claro que o navy — `text-white/50` dá 5,0:1 sobre #001A4B mas cai para 3,7:1 sobre #003599, reprovando AA. Medido e corrigido em 2026-07-31.
```

- [ ] **Step 5: Registrar as duas exceções da seção Sobre**

Adicionar no topo do documento, seguindo o padrão dos blocos de pivô v2 e v3 já existentes (logo depois do bloco "Pivô de paleta + conteúdo v3"):

```markdown
## ⚠️ Rodada de gradientes + institucional (2026-07-31 — ler antes de implementar UI)

Pedido do cliente depois de ver o site pronto. Não mexe na estrutura definida
nos pivôs anteriores, só na superfície e em duas seções novas:

1. **Nada de cor chapada.** Ver "Sistema de gradientes" na seção 6. O token
   `#003599` (Navy Bright) entrou por pedido do cliente e não é uma variação
   gerada a partir da paleta.
2. **Seção "Sobre" adicionada, com duas exceções deliberadas a este manual:**
   - É a **única seção com título alinhado à esquerda** — o manual pede blocos
     de seção centralizados (pivô v2, item 5). O layout de duas colunas com
     Missão e Visão à direita foi pedido explicitamente pelo cliente.
   - É a **única seção que explica o mecanismo da antecipação** ("não precisa
     esperar 30, 60 ou 90 dias"). O pivô v3 tinha removido esse tipo de texto
     por considerar que o visitante já chega sabendo. O texto veio pronto do
     cliente.
3. **Seção "Valores" adicionada**, com um acordeão de 6 painéis em gradiente
   escuro. Painéis são cards, não fundo de seção: a regra dos dois únicos
   momentos escuros da página continua valendo, porque a seção em si fica no
   wash claro.
```

- [ ] **Step 6: Ajustar o checklist da seção 7**

Sem isso o checklist passa a acusar a própria implementação de errada. Trocar os dois itens afetados:

```markdown
- [ ] Fundo claro em todas as seções, exceto os dois bookends escuros (Hero, CTA Final) — com o wash de gradiente da seção 6, e a direção alternando em relação às seções vizinhas
- [ ] Blocos/títulos de seção centralizados; parágrafos longos dentro de cards continuam à esquerda. Exceção única: a seção "Sobre", em duas colunas com título à esquerda (pedido do cliente, 2026-07-31)
```

E acrescentar um item novo:

```markdown
- [ ] Texto branco sobre o gradiente escuro em pelo menos 70% de opacidade — abaixo disso reprova AA na ponta clara (#003599)
```

- [ ] **Step 7: Verificar a consistência**

Reler as seções 3, 6 e 7 inteiras procurando qualquer outra afirmação que a implementação agora contradiga — em especial ocorrências remanescentes de "cor única de fundo" tratando o fundo como sólido, e qualquer número de contraste ainda calculado sobre o gold antigo.

- [ ] **Step 8: Commit**

```bash
git add docs/brand-guidelines.md
git commit -m "Atualizar manual de marca: gradientes, navy-bright e excecoes

Corrige tambem o dourado do documento, que ainda estava em #E2AF0C
enquanto o codigo usa #C68622 desde 6210a82."
```

---

## Verificação final (depois da Task 5)

- [ ] **Build de produção**

```bash
cd web && npm run build
```

Esperado: compila sem erro, 3 páginas estáticas.

- [ ] **Varredura de contraste nas seções novas**

Com o preview rodando, medir o contraste real do texto renderizado sobre cada fundo, nos dois extremos do gradiente. Pontos de risco: texto branco nos painéis de Valores (a ponta `#003599` é a pior), `text-navy/70` nas caixas de Missão/Visão, e o texto da Hero ao longo de toda a extensão do gradiente, não só nas pontas.

- [ ] **Responsivo**

Verificar em 1440px, 768px e 375px: sem overflow horizontal (`document.documentElement.scrollWidth === clientWidth`), o acordeão trocando para a grade abaixo de `md`, e a navbar com quatro links cabendo no estado pill. **Recarregar a página depois de cada mudança de viewport antes de medir** — este harness reporta larguras defasadas se medidas logo após o resize.

- [ ] **Ordem e âncoras**

`main section[id]` na ordem `hero-implícito, processo, para-quem, sobre, valores, solucoes, atendimento, cta-final`, e os quatro links da navbar apontando para seções existentes.

**Limitação conhecida:** neste harness o painel do navegador não compõe frames, então `IntersectionObserver` e eventos nativos de scroll não disparam — as animações do `Reveal`, o hover do acordeão e o estado pill da navbar não podem ser verificados visualmente aqui. A lógica é verificável por DOM (foco programático no acordeão, `dispatchEvent(new Event("scroll"))` para a navbar); o efeito visual precisa de conferência num navegador normal.
