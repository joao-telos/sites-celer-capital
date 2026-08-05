# Escala tipográfica e larguras — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a escala tipográfica bimodal do site por uma escala fluida em tokens, unificar as cinco larguras de container em duas faixas, e preparar dois slots de fotografia.

**Architecture:** A escala vira tokens `--text-*` no `@theme` do `globals.css`, cada um um `clamp()` com âncora em `rem`, e os componentes passam a consumir `text-<nome>` em vez de valores espalhados. As larguras convergem para `max-w-7xl` (conteúdo) e `max-w-3xl` (texto corrido), com uma trava de `max-w-[68ch]` em todo parágrafo dentro dos containers largos. Um componente `PhotoSlot` serve os dois placeholders de imagem.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, Tailwind CSS 4.3.2, TypeScript 5, lucide-react 1.24.0.

## Global Constraints

**Este projeto não tem test runner.** `package.json` expõe apenas `dev`, `build`, `start` e `lint`. **Não instale um.** O ciclo de verificação de cada tarefa é `npx tsc --noEmit`, `npx eslint .` e asserções no DOM pelo navegador. Onde este plano diz "teste", é isso.

**Nenhuma tarefa deste plano adiciona dependência.**

- **Leia antes de escrever código:** `web/AGENTS.md` manda consultar `node_modules/next/dist/docs/`.
- **Mesma família tipográfica.** Coolvetica (`font-heading`) no display, Roboto no corpo. Nenhuma troca de fonte.
- **Fora de escopo, mesmo aparecendo nas referências do cliente:** Hero full-bleed com foto sangrando, rodapé escuro com marca-d'água, cards densos com lista de bullets. Não implemente nada disso.
- **Nenhuma copy institucional do cliente é reescrita.** Uma exceção nomeada de apresentação: a primeira linha do H1 da Hero passa a ser renderizada em caixa alta via CSS (`uppercase`), sem alterar o texto. O texto novo que os placeholders de fotografia introduzem ("Foto pendente" e a descrição do que falta) **não** é copy institucional: é sinalização de pendência, deliberadamente visível, e foi aprovada como tal.
- **Paleta fechada:** navy `#001A4B`, navy-bright `#003599`, gold `#C68622`, gold-bright `#F2AA3A`, gold-light `#E1A951`, gold-dark `#6D4A13`, cream `#EFF1F4`, ink `#0B0C0C`, white `#FFFFFF`, whatsapp `#1DA851`.
- **Tailwind v4:** `bg-linear-to-*`, não `bg-gradient-to-*` (depreciado).
- **Fonte de display nunca abaixo de 20px** e nunca `font-semibold`/600.
- **Texto branco sobre fundo escuro: mínimo `/70`.** Navy sobre fundo claro: mínimo `/65`. **Sobre superfície dourada: `text-navy` sem opacidade.**
- **Sem em dash (—) em copy visível.** Em comentário de código é livre.
- **Nenhuma imagem de banco de imagens.** Os slots entram como placeholder visível e marcado.

---

## Correções do plano feitas durante a execução

**2026-08-05 — `--text-card` renomeado para `--text-h3`.** O nome colidia com `--color-card`, que o shadcn já define. O Tailwind resolve a utility `text-card` a partir dos dois namespaces, escolhe a cor, e **descarta o tamanho por completo** — o H3 renderizava em 16px em vez de 22px. Dos nove tokens, `card` era o único com contrapartida em `--color-*`. O nome `h3` é consistente com `h2`, não tem contrapartida de cor, e descreve o papel real. Os valores do `clamp()` não mudaram.

**2026-08-05 — a fórmula de contagem de caracteres das asserções estava errada.** Ela dividia a largura da linha por `fontSize * 0.5`, assumindo meio em por caractere. A unidade `ch` da Roboto é ~0.554em, então `max-w-[68ch]` mede 641px e a fórmula reportava 75 para um bloco que tem exatamente 68 caracteres pela definição do CSS. **A classe estava certa e o verificador errado.** Onde uma asserção contar caracteres por linha, meça a largura real do `ch` em vez de estimar:

```js
const medeCh = (el) => {
  const s = document.createElement("span");
  s.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
  s.textContent = "0";
  el.appendChild(s);
  const w = s.getBoundingClientRect().width;
  s.remove();
  return w;
};
// charsPorLinha = larguraDaLinha / medeCh(paragrafo)
```

---

## Estrutura de arquivos

**Criar:**
| Arquivo | Responsabilidade |
|---|---|
| `web/src/components/ui/photo-slot.tsx` | Placeholder de imagem visível, com proporção e descrição do que falta |

**Modificar:**
| Arquivo | O quê |
|---|---|
| `web/src/app/globals.css` | Tokens `--text-*` da escala fluida |
| `web/src/components/valores.tsx` | Escala + largura |
| `web/src/components/atendimento.tsx` | Escala + largura |
| `web/src/components/cta-final.tsx` | Escala + largura |
| `web/src/components/footer.tsx` | Escala |
| `web/src/components/numeros.tsx` | Escala + largura |
| `web/src/components/solucoes.tsx` | Escala + largura + nós e container do diagrama |
| `web/src/components/hero.tsx` | Escala + largura + headline em caixa alta |
| `web/src/components/processo.tsx` | Escala + largura + slot de foto em 2 colunas |
| `web/src/components/sobre.tsx` | Escala + largura + slot de foto |
| `web/src/components/ui/interactive-accordion.tsx` | Tipografia e geometria dos painéis |
| `docs/brand-guidelines.md` | Escala nova, sistema de larguras, trava de 68ch, regra do clamp |

---

## Task 1: Tokens da escala e as quatro seções de troca direta

**Files:**
- Modify: `web/src/app/globals.css` (bloco `@theme`)
- Modify: `web/src/components/valores.tsx:64,66`
- Modify: `web/src/components/atendimento.tsx:37,40`
- Modify: `web/src/components/cta-final.tsx:25,26,29,39,45`
- Modify: `web/src/components/footer.tsx`

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: os tokens `text-micro`, `text-caption`, `text-body`, `text-lead`, `text-h3`, `text-h2`, `text-stat`, `text-display`, disponíveis como utilities do Tailwind para todas as tarefas seguintes.

- [ ] **Step 1: Adicionar os tokens da escala**

Em `web/src/app/globals.css`, dentro do bloco `@theme`, logo antes da linha `--font-display: "Coolvetica", "Arial Narrow", sans-serif;`:

```css
  /*
    Escala tipográfica fluida (2026-08-02). Substitui a escala bimodal
    anterior, que tinha dois ou três elementos grandes e todo o resto
    comprimido entre 11 e 16px, sem nada entre 20 e 36.

    Cada valor é um clamp(min, rem + vw, max). A âncora em `rem` NÃO é
    opcional: um clamp que interpola em vw puro ignora o zoom do
    navegador, e o texto para de crescer quando o usuário aumenta a
    fonte. A parte em rem é o que preserva o zoom.

    Comentário ao lado de cada linha: tamanho em 375px → tamanho no
    desktop, depois que o clamp satura.
  */
  --text-micro: clamp(0.625rem, 0.6rem + 0.1vw, 0.6875rem); /* 10 → 11 */
  --text-micro--line-height: 1.5;

  --text-caption: clamp(0.75rem, 0.72rem + 0.13vw, 0.8125rem); /* 12 → 13 */
  --text-caption--line-height: 1;

  --text-body: clamp(1rem, 0.95rem + 0.2vw, 1.0625rem); /* 16 → 17 */
  --text-body--line-height: 1.6;

  --text-lead: clamp(1.1875rem, 1.13rem + 0.23vw, 1.3125rem); /* 19 → 21 */
  --text-lead--line-height: 1.4;

  --text-h3: clamp(1.25rem, 1.19rem + 0.25vw, 1.375rem); /* 20 → 22 */
  --text-h3--line-height: 1.25;

  --text-h2: clamp(2rem, 1.5rem + 2.2vw, 2.75rem); /* 32 → 44 */
  --text-h2--line-height: 1.15;

  --text-stat: clamp(3rem, 1.8rem + 5vw, 4.25rem); /* 48 → 68 */
  --text-stat--line-height: 1;

  --text-display: clamp(2.75rem, 1.2rem + 6.5vw, 5.5rem); /* 44 → 88 */
  --text-display--line-height: 1.05;
```

- [ ] **Step 2: Valores**

`valores.tsx` linha 64, container:

```tsx
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
```

Linha 66, o H2 (a escala fluida já cobre os breakpoints, então `sm:` e `lg:` de tamanho saem):

```tsx
          <h2 className="font-heading text-h2 mb-10 text-center font-bold text-navy lg:mb-12">
```

- [ ] **Step 3: Atendimento**

`atendimento.tsx` linha 37, container:

```tsx
      <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-10 lg:py-28">
```

Linha 40, a tagline:

```tsx
          className="font-heading text-display font-bold uppercase"
```

- [ ] **Step 4: CTA Final**

`cta-final.tsx`, quatro trocas. Linha 25, container sobe de `max-w-lg` (512px) para a faixa de texto corrido:

```tsx
        <div className="relative z-10 mx-auto max-w-3xl px-6">
```

Linha 26, o H2:

```tsx
          <h2 className="font-heading text-h2 font-bold text-white">
```

Linha 29, o parágrafo:

```tsx
          <p className="text-body mt-5 font-light text-white/70">
```

Linha 39, o botão do WhatsApp — só a parte do tamanho muda, o resto da string fica:

```tsx
              "text-caption mt-9 h-auto rounded-full bg-whatsapp px-9 py-4 font-bold tracking-wider text-white uppercase hover:bg-whatsapp/90"
```

Linha 45, o disclaimer:

```tsx
          <p className="text-micro mt-5 tracking-wider text-white/70 uppercase">
```

- [ ] **Step 5: Footer**

Em `footer.tsx`, o parágrafo de copyright troca `text-[10px]` por `text-micro`, mantendo o resto:

```tsx
        <p className="text-micro tracking-wide text-navy/65">
```

O comentário `TODO` sobre registro regulatório dentro desse parágrafo **permanece**.

- [ ] **Step 6: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 7: Verificar a escala renderizada**

Subir o preview (`preview_start` com `{name: "web-dev"}`) e rodar no console, em viewport de desktop:

```js
(() => {
  const fs = (s) => {
    const e = document.querySelector(s);
    return e ? Math.round(parseFloat(getComputedStyle(e).fontSize)) : null;
  };
  return JSON.stringify({
    viewport: document.documentElement.clientWidth,
    tagline: fs("#atendimento h2"),
    h2Valores: fs("#valores h2"),
    h2Cta: fs("#cta-final h2"),
    corpoCta: fs("#cta-final p"),
    disclaimerCta: fs("#cta-final p:last-of-type"),
    contValores: Math.round(document.querySelector("#valores .mx-auto").getBoundingClientRect().width),
    contCta: Math.round(document.querySelector("#cta-final .mx-auto").getBoundingClientRect().width),
  });
})();
```

Esperado num viewport de 1280px ou mais: `tagline: 88`, `h2Valores: 44`, `h2Cta: 44`, `corpoCta: 17`, `disclaimerCta: 11`, `contValores: 1280`, `contCta: 768`.

Depois, confirmar que a tagline continua em **duas** linhas e não quebrou em três. Cada linha é um `<span className="block">`, mas uma linha pode quebrar por dentro se ficar larga demais:

```js
(() => {
  const h2 = document.querySelector("#atendimento h2");
  const alturaLinha = parseFloat(getComputedStyle(h2).lineHeight);
  const linhas = [...h2.children];
  return JSON.stringify({
    alturaTotal: Math.round(h2.getBoundingClientRect().height),
    alturaDeUmaLinha: Math.round(alturaLinha),
    linhas: linhas.map((l) => ({
      texto: l.textContent.trim(),
      largura: Math.round(l.getBoundingClientRect().width),
      quebrou: l.getBoundingClientRect().height > alturaLinha * 1.5,
    })),
    duasLinhasNoTotal: Math.abs(h2.getBoundingClientRect().height - 2 * alturaLinha) < 6,
  });
})();
```

Esperado: `duasLinhasNoTotal: true` e `quebrou: false` nas duas. Se alguma quebrou, o `--text-display` está largo demais para o container de 1280px do Atendimento — reporte antes de mexer, porque o mesmo token serve a Hero e a decisão de teto é dela (Task 3).

Depois redimensionar para 375px, **recarregar a página** (este ambiente reporta larguras defasadas se medidas logo após o resize) e rodar de novo. Esperado: `tagline: 44`, `h2Valores: 32`, `corpoCta: 16`, `disclaimerCta: 10`.

- [ ] **Step 8: Commit**

```bash
git add web/src/app/globals.css web/src/components/valores.tsx web/src/components/atendimento.tsx web/src/components/cta-final.tsx web/src/components/footer.tsx
git commit -m "Adicionar escala tipografica fluida em tokens

A escala anterior era bimodal: dois ou tres elementos grandes e todo o
resto entre 11 e 16px, sem nada entre 20 e 36. O H3 de card tinha 16px
e o corpo 14px, dois pixels de diferenca, o que apagava a hierarquia.

Cada token e um clamp com ancora em rem. vw puro ignoraria o zoom do
navegador e quebraria acessibilidade.

CTA Final sobe de max-w-lg (512px) para max-w-3xl (768px)."
```

---

## Task 2: Números e Soluções

**Files:**
- Modify: `web/src/components/numeros.tsx:49,62,67`
- Modify: `web/src/components/solucoes.tsx:35,56,58,66,103,153`

**Interfaces:**
- Consumes: os tokens `text-*` da Task 1.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Números**

Linha 49, container:

```tsx
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
```

Linha 62, o numeral:

```tsx
                  <dt className="font-heading text-stat font-bold text-navy">
```

Linha 67, o rótulo. Continua `text-navy` sem opacidade — sobre dourado, branco reprova nos dois extremos e navy com opacidade escorrega:

```tsx
                  <dd className="text-body mt-3 font-light text-navy">
```

- [ ] **Step 2: Soluções — container e título**

Linha 56, container:

```tsx
      <div className="mx-auto max-w-7xl px-6 py-12 text-center sm:px-10 lg:py-16">
```

Linha 58, o H2:

```tsx
          <h2 className="font-heading text-h2 font-bold text-navy">
```

- [ ] **Step 3: Soluções — nós do diagrama**

**Correção do plano (2026-08-05, durante a execução):** a versão original deste passo dava ao nó três degraus de tamanho (`text-caption sm:text-body lg:text-h3`), o que contraria a Global Constraint deste próprio plano contra modificador de tamanho por cima de token fluido. Os saltos medidos eram de +33% em 640px e +27% em 1024px. Decisão do usuário: o nó ganha um token fluido próprio.

Primeiro, adicionar o nono token em `web/src/app/globals.css`, junto dos outros, logo depois de `--text-h3`:

```css
  --text-node: clamp(0.75rem, 0.45rem + 1.25vw, 1.375rem); /* 12 → 22 */
  --text-node--line-height: 1.2;
```

Segundo — **e isto não é opcional** — registrar `node` no `extendTailwindMerge` de `web/src/lib/utils.ts`, no array do grupo `font-size`, junto dos oito nomes que já estão lá. Sem isso o `tailwind-merge` classifica `text-node` como cor de texto e descarta o tamanho em silêncio sempre que a `className` também trouxer uma cor. Foi exatamente esse o bug que custou três rodadas de correção na Task 1.

Terceiro, a linha 35, o `SolutionNode`. A caixa continua crescendo por breakpoint, o texto não:

```tsx
      <div className="text-node w-36 rounded-2xl border border-navy/10 bg-linear-to-b from-white to-cream px-4 py-3 text-center font-bold text-navy shadow-md shadow-navy/5 sm:w-52 sm:px-5 sm:py-4 lg:w-60">
```

Linha 66, o container do diagrama, que precisa acompanhar os nós mais largos:

```tsx
            className="relative mx-auto mt-10 w-full max-w-4xl sm:mt-12"
```

Linha 103, o rótulo "VOCÊ":

```tsx
                <span className="text-caption font-bold tracking-wide text-navy/60 uppercase">
```

- [ ] **Step 4: Soluções — parágrafo de fecho**

Linha 153. Ganha a trava de 68 caracteres, porque agora vive num container de 1280px:

```tsx
          <p className="text-lead mx-auto mt-8 max-w-[68ch] font-light text-navy/70 sm:mt-10">
```

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 6: Verificar no navegador**

```js
(() => {
  const d = document.documentElement;
  const fs = (s) => {
    const e = document.querySelector(s);
    return e ? Math.round(parseFloat(getComputedStyle(e).fontSize)) : null;
  };
  const dl = document.querySelector("#numeros dl");
  return JSON.stringify({
    viewport: d.clientWidth,
    numeral: fs("#numeros dt"),
    rotulo: fs("#numeros dd"),
    h2Soluco: fs("#solucoes h2"),
    colunasNumeros: getComputedStyle(dl).gridTemplateColumns.split(" ").length,
    contNumeros: Math.round(document.querySelector("#numeros .mx-auto").getBoundingClientRect().width),
    overflow: d.scrollWidth > d.clientWidth,
  });
})();
```

Esperado em 1280px ou mais: `numeral: 68`, `rotulo: 17`, `h2Soluco: 44`, `colunasNumeros: 4`, `contNumeros: 1280`, `overflow: false`.

Depois em 375px, **recarregando antes de medir**: `numeral: 48`, `colunasNumeros: 2`, `overflow: false`. **O `overflow: false` em 375px é o ponto desta verificação** — a grade de Números é de duas colunas no mobile, e o numeral em 48px é o principal candidato a estourar a célula.

- [ ] **Step 7: Commit**

```bash
git add web/src/components/numeros.tsx web/src/components/solucoes.tsx
git commit -m "Aplicar escala e larguras em Numeros e Solucoes

Os nos do diagrama de Solucoes crescem junto com a fonte: mante-los na
largura antiga faria o texto maior estourar a caixa. O container do
diagrama acompanha.

O paragrafo de fecho ganha a trava de 68 caracteres, agora que vive num
container de 1280px."
```

---

## Task 3: Hero

**Files:**
- Modify: `web/src/components/hero.tsx:22,23,29,42,52`

**Interfaces:**
- Consumes: os tokens `text-*` da Task 1.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Container e headline**

Linha 22, o container sobe de `max-w-2xl` (672px) para a faixa de conteúdo. Isso é o que permite o título grande caber em uma linha:

```tsx
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
```

Linhas 23 a 27, a headline. A primeira linha vira caixa alta; a segunda mantém caixa mista, `font-light` e dourado. O `<br />` sai, substituído por dois `<span className="block">`:

```tsx
        <h1 className="font-heading text-display font-bold text-white">
          <span className="block uppercase">O capital que já é seu</span>
          <span className="block font-light text-gold">
            não deveria esperar.
          </span>
        </h1>
```

O texto não muda: a caixa alta vem de CSS, não de reescrever a copy.

- [ ] **Step 2: Parágrafo e botões**

Linha 29, o parágrafo ganha a trava de 68 caracteres:

```tsx
        <p className="text-body mx-auto mt-6 max-w-[68ch] font-light text-white/70">
```

Linha 42, o CTA primário — só o tamanho muda:

```tsx
              "text-caption h-auto rounded-full bg-gold px-7 py-3.5 font-bold tracking-wider text-navy uppercase hover:bg-gold-light"
```

Linha 52, o secundário:

```tsx
              "text-caption h-auto rounded-full border-white/20 bg-transparent px-6 py-3.5 font-bold tracking-wider text-white/70 uppercase hover:bg-white/5 hover:text-white"
```

- [ ] **Step 3: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 4: Verificar o critério de aceite da headline**

Este é o passo que decide se o tamanho fica. Em viewport de 1280px ou mais:

```js
(() => {
  const h1 = document.querySelector("main h1");
  const linhas = [...h1.children];
  const alturaLinha = parseFloat(getComputedStyle(h1).lineHeight);
  return JSON.stringify({
    viewport: document.documentElement.clientWidth,
    fontSize: Math.round(parseFloat(getComputedStyle(h1).fontSize)),
    texto: h1.textContent.replace(/\s+/g, " ").trim(),
    linha1: {
      texto: linhas[0].textContent,
      largura: Math.round(linhas[0].getBoundingClientRect().width),
      altura: Math.round(linhas[0].getBoundingClientRect().height),
      cabeEmUmaLinha: linhas[0].getBoundingClientRect().height < alturaLinha * 1.5,
    },
    larguraDisponivel: Math.round(h1.getBoundingClientRect().width),
  });
})();
```

Esperado: `cabeEmUmaLinha: true`.

**Se vier `false`**, o tamanho cede, não a copy, e **só na Hero**. Adicionar um teto local ao `<h1>` — por exemplo `text-[clamp(2.75rem,1.2rem+6.5vw,4.75rem)]` — reduzindo o máximo em passos de 0.25rem até `cabeEmUmaLinha` virar `true`. Registre no relatório qual valor final ficou e por quê.

**Não baixe o token `--text-display` global.** Ele é compartilhado com a tagline do Atendimento, que tem conteúdo mais curto e cabe folgada; baixar o token encolheria a tagline sem motivo.

- [ ] **Step 5: Verificar o mobile**

Redimensionar para 375px, **recarregar**, e rodar:

```js
(() => {
  const d = document.documentElement;
  const h1 = document.querySelector("main h1");
  return JSON.stringify({
    viewport: d.clientWidth,
    fontSize: Math.round(parseFloat(getComputedStyle(h1).fontSize)),
    overflow: d.scrollWidth > d.clientWidth,
    alturaHero: Math.round(document.querySelector("main section").getBoundingClientRect().height),
  });
})();
```

Esperado: `fontSize: 44`, `overflow: false`.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/hero.tsx
git commit -m "Aumentar a escala da Hero e por a primeira linha em caixa alta

O container sobe de max-w-2xl para max-w-7xl: e o que permite o titulo
grande caber em uma linha. A caixa alta vem de CSS, a copy nao muda.

O br vira dois spans block, para as duas linhas receberem tratamentos
diferentes."
```

---

## Task 4: PhotoSlot e a seção Processo

**Files:**
- Create: `web/src/components/ui/photo-slot.tsx`
- Modify: `web/src/components/processo.tsx:35,38,52,56,59`

**Interfaces:**
- Consumes: os tokens `text-*` da Task 1; `cn` de `@/lib/utils`.
- Produces: `PhotoSlot({ aspect, descricao, className })` exportado de `@/components/ui/photo-slot`. A Task 5 consome esse mesmo componente.

- [ ] **Step 1: Criar o PhotoSlot**

Criar `web/src/components/ui/photo-slot.tsx`:

```tsx
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface PhotoSlotProps {
  /** Classe de proporção do Tailwind, ex: "aspect-[4/5]". */
  aspect: string;
  /** O que a foto precisa mostrar. Aparece no placeholder. */
  descricao: string;
  className?: string;
}

/**
 * Espaço reservado para fotografia que o cliente ainda não forneceu.
 *
 * É deliberadamente visível e descritivo, em vez de um bloco cinza mudo
 * ou de uma imagem de banco de imagens. O projeto decidiu em 2026-07-31
 * não usar stock: o manual aponta o visual próprio como o diferencial
 * real da marca, e stock genérico trabalha contra isso.
 *
 * Um buraco declarado é mais honesto que um buraco disfarçado.
 */
export function PhotoSlot({ aspect, descricao, className }: PhotoSlotProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-navy/20 bg-navy/[0.03] p-6 text-center",
        aspect,
        className
      )}
    >
      <ImageIcon className="size-8 text-navy/30" aria-hidden="true" />
      <p className="text-caption font-bold tracking-wide text-navy/60 uppercase">
        Foto pendente
      </p>
      <p className="text-body max-w-[34ch] font-light text-navy/65">
        {descricao}
      </p>
    </div>
  );
}
```

**Confirme que `ImageIcon` existe** no `lucide-react` 1.24.0 antes de assumir — nomes mudam entre majors:

```bash
cd web && node -e "console.log(typeof require('lucide-react').ImageIcon)"
```

Esperado: `object` ou `function`. Se vier `undefined`, use `Image` e ajuste o import.

- [ ] **Step 2: Processo — container, título e passos**

Linha 35, container:

```tsx
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
```

Linha 38, o H2:

```tsx
            <h2 className="font-heading text-h2 font-bold text-navy">
```

Linha 52, o número do passo. O círculo cresce junto com o texto, senão o número maior não cabe:

```tsx
                <span className="font-heading relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-white text-2xl font-bold text-gold-dark shadow-sm">
```

Linha 51, a grade de cada `<li>` precisa acompanhar o círculo maior, de 40px para 48px:

```tsx
              <li className="grid grid-cols-[48px_1fr] gap-6 pb-11 last:pb-0 sm:gap-7">
```

Linha 47, a linha vertical da timeline reposiciona junto com o círculo:

```tsx
            className="absolute top-6 bottom-6 left-6 w-px bg-gold/30"
```

Linha 56, o título do passo:

```tsx
                  <h3 className="text-h3 mb-1.5 font-bold text-navy">
```

Linha 59, o texto do passo. **O `max-w-[440px]` sai** — era ele que travava o conteúdo por dentro e faria a seção ficar larga e vazia:

```tsx
                  <p className="text-body max-w-[68ch] font-light text-navy/70">
```

- [ ] **Step 3: Processo — duas colunas com o slot de foto**

A linha do tempo passa a dividir a largura com um card de foto, que é o que justifica o container de 1280px. Adicionar o import:

```tsx
import { PhotoSlot } from "@/components/ui/photo-slot";
```

A mudança estrutural é **envolver a `<ol>` que já existe** numa grade de duas colunas e pôr o slot como segunda coluna. Não recrie a `<ol>` nem o `.map` dos passos: eles ficam exatamente como estão depois do Step 2.

Concretamente, no arquivo depois do Step 2 a estrutura é:

```
<div className="relative z-10 mx-auto max-w-7xl ...">   ← container
  <Reveal> ... <h2> ... </Reveal>
  <ol className="relative flex flex-col">               ← abre aqui
    <div aria-hidden ... />                             ← linha vertical
    {STEPS.map(...)}
  </ol>                                                 ← fecha aqui
</div>
```

Insira a abertura da grade imediatamente **antes** do `<ol ...>`, e o fechamento com o `PhotoSlot` imediatamente **depois** do `</ol>`:

```tsx
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-14">
          <ol className="relative flex flex-col">
```

```tsx
          </ol>

          <PhotoSlot
            aspect="aspect-[3/4]"
            descricao="Retrato de um dono de negócio do perfil da Celer: indústria, metalurgia ou distribuidora. Ambiente real de trabalho, não estúdio."
            className="lg:sticky lg:top-28"
          />
        </div>
```

Reindente o conteúdo da `<ol>` em um nível para acompanhar. Abaixo de `lg` a grade tem uma coluna só, então o slot empilha embaixo da linha do tempo.

- [ ] **Step 4: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 5: Verificar no navegador**

```js
(() => {
  const d = document.documentElement;
  const p = document.getElementById("processo");
  const fs = (s) => {
    const e = p.querySelector(s);
    return e ? Math.round(parseFloat(getComputedStyle(e).fontSize)) : null;
  };
  const par = p.querySelector("li p");
  const r = document.createRange();
  r.selectNodeContents(par);
  const larguraLinha = Math.round(r.getBoundingClientRect().width);
  const fsPar = parseFloat(getComputedStyle(par).fontSize);
  return JSON.stringify({
    viewport: d.clientWidth,
    h2: fs("h2"),
    tituloPasso: fs("h3"),
    textoPasso: Math.round(fsPar),
    charsPorLinha: Math.round(larguraLinha / (fsPar * 0.5)),
    slotDeFoto: !!p.querySelector(".border-dashed"),
    container: Math.round(p.querySelector(".mx-auto").getBoundingClientRect().width),
    overflow: d.scrollWidth > d.clientWidth,
  });
})();
```

Esperado em 1280px ou mais: `h2: 44`, `tituloPasso: 22`, `textoPasso: 17`, `slotDeFoto: true`, `container: 1280`, `overflow: false`, e **`charsPorLinha` em 68 ou menos** — é a trava de legibilidade, e sem ela esta tarefa trocaria "pequeno demais" por "difícil de ler".

Depois em 375px, recarregando antes de medir: `overflow: false` e o slot empilhado abaixo da linha do tempo.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/ui/photo-slot.tsx web/src/components/processo.tsx
git commit -m "Adicionar PhotoSlot e reformular Processo em duas colunas

O max-w-[440px] do texto de cada passo sai: era ele que travava o
conteudo por dentro, e alargar so o container deixaria a secao larga e
vazia, trocando um vazio por outro.

O circulo do numero cresce de size-10 para size-12 junto com a fonte, e
a grade e a linha vertical acompanham.

O PhotoSlot e deliberadamente visivel: um buraco declarado e mais
honesto que um bloco cinza mudo ou uma foto de banco de imagens."
```

---

## Task 5: Seção Sobre

**Files:**
- Modify: `web/src/components/sobre.tsx:37,45,48,52,66,69`

**Interfaces:**
- Consumes: os tokens `text-*` da Task 1; `PhotoSlot({ aspect, descricao, className })` da Task 4.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Container e tipografia**

Linha 37, container:

```tsx
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
```

Linha 45, o H2:

```tsx
                <h2 className="font-heading text-h2 font-bold text-white">
```

Linha 48, a frase de destaque:

```tsx
                <p className="text-lead mt-5 font-light text-white">
```

Linha 52, o parágrafo, com a trava de 68 caracteres:

```tsx
                <p className="text-body mt-5 max-w-[68ch] font-light text-white/70">
```

Linha 66, o título das caixas de Missão e Visão:

```tsx
                    <h3 className="font-heading text-h3 font-bold text-navy">
```

Linha 69, o corpo das caixas:

```tsx
                    <p className="text-body mt-3 font-light text-navy/70">
```

- [ ] **Step 2: Slot de foto**

Adicionar o import:

```tsx
import { PhotoSlot } from "@/components/ui/photo-slot";
```

O slot entra na coluna da esquerda, abaixo do bloco de texto, para as duas colunas ficarem equilibradas em altura. Envolver o `<div className="text-left">` existente e o slot:

```tsx
              <div className="flex flex-col gap-6">
                <div className="text-left">
                  {/* h2, frase de destaque e parágrafo, sem alteração além das do Step 1 */}
                </div>

                <PhotoSlot
                  aspect="aspect-[16/10]"
                  descricao="Equipe da Celer ou atendimento acontecendo. Precisa funcionar sobre fundo escuro."
                  className="border-white/25 bg-white/[0.06]"
                />
              </div>
```

O `className` sobrescreve a borda e o fundo do `PhotoSlot`, que por padrão são feitos para fundo claro — aqui ele vive dentro da caixa navy.

**O texto interno do `PhotoSlot` continua em navy** e ficaria ilegível sobre a caixa escura. Passe também as cores de texto pelo `className`, usando o seletor de filho do Tailwind:

```tsx
                  className="border-white/25 bg-white/[0.06] [&_p]:text-white/75 [&_svg]:text-white/40"
```

- [ ] **Step 3: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 4: Verificar no navegador, incluindo contraste**

```js
(() => {
  const s = document.getElementById("sobre");
  const fs = (x) => {
    const e = s.querySelector(x);
    return e ? Math.round(parseFloat(getComputedStyle(e).fontSize)) : null;
  };
  const slot = s.querySelector(".border-dashed");
  return JSON.stringify({
    viewport: document.documentElement.clientWidth,
    h2: fs("h2"),
    destaque: fs("p"),
    tituloCaixa: fs("h3"),
    slotPresente: !!slot,
    corTextoSlot: slot ? getComputedStyle(slot.querySelector("p:last-of-type")).color : null,
    container: Math.round(s.querySelector(".mx-auto").getBoundingClientRect().width),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  });
})();
```

Esperado em 1280px ou mais: `h2: 44`, `destaque: 21`, `tituloCaixa: 22`, `slotPresente: true`, `container: 1280`, `overflow: false`, e `corTextoSlot` claro, **não navy** — se vier navy, o texto do placeholder está ilegível sobre a caixa escura e o Step 2 não foi aplicado por completo.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/sobre.tsx
git commit -m "Aplicar escala e slot de foto na secao Sobre

O PhotoSlot vive dentro da caixa navy, entao borda, fundo e cor de
texto sao sobrescritos: os padroes do componente foram feitos para
fundo claro e o texto em navy ficaria ilegivel."
```

---

## Task 6: Acordeão de Valores

**Files:**
- Modify: `web/src/components/ui/interactive-accordion.tsx:53,63,66,79,110,113,123`

**Interfaces:**
- Consumes: os tokens `text-*` da Task 1.
- Produces: nada consumido por tarefas posteriores.

- [ ] **Step 1: Grade mobile**

Linha 63, o título dos cards:

```tsx
              <h3 className="font-heading text-h3 mt-4 font-bold text-white">
```

Linha 66, a descrição:

```tsx
              <p className="text-body mt-2 font-light text-white/75">
```

- [ ] **Step 2: Acordeão desktop**

Linha 79, a altura do painel. Sobe de `h-[420px]` para acomodar o texto maior:

```tsx
                "relative h-[480px] cursor-pointer overflow-hidden rounded-3xl text-left transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
```

Linha 110, o título do painel aberto. Este é um valor local deliberado, não um token: o acordeão tem geometria fixa, e um token fluido brigaria com a largura do painel, que já muda sozinha por `flex-grow`:

```tsx
                <span className="font-heading block text-[1.75rem] font-bold text-white lg:text-[2rem]">
```

Linha 113, a descrição do painel aberto:

```tsx
                <span className="text-body mt-2 block font-light text-white/75">
```

Linha 123, o título rotacionado do painel fechado:

```tsx
                  "font-heading text-h3 absolute bottom-24 left-1/2 -translate-x-1/2 rotate-90 font-bold whitespace-nowrap text-white/80 transition-opacity duration-300",
```

- [ ] **Step 3: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 4: Verificar a geometria do acordeão**

Este é o ponto de risco desta tarefa: o título rotacionado a 90° tem a altura do painel como limite, e texto maior pode estourar. Em 1280px ou mais:

```js
(() => {
  const btns = [...document.querySelectorAll("#valores button")];
  const painel = btns[0].getBoundingClientRect();
  const rotacionados = btns.slice(1).map((b) => {
    const s = [...b.querySelectorAll("span")].find(
      (x) => getComputedStyle(x).transform !== "none" && x.textContent.trim()
    );
    return s ? { texto: s.textContent.trim(), larguraDoTexto: Math.round(s.scrollWidth) } : null;
  });
  return JSON.stringify({
    alturaPainel: Math.round(painel.height),
    rotacionados,
    cabemNaAltura: rotacionados.every((r) => !r || r.larguraDoTexto < painel.height - 96),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }, null, 1);
})();
```

Esperado: `alturaPainel: 480`, `cabemNaAltura: true`, `overflow: false`. O texto rotacionado ocupa altura igual à sua largura de texto, e os 96px descontados são o espaço do ícone no topo e da margem inferior.

Se `cabemNaAltura` vier `false`, o painel cresce mais — suba `h-[480px]` em passos de 40px até passar, e registre o valor final no relatório.

- [ ] **Step 5: Verificar a grade mobile**

Em 375px, recarregando antes de medir:

```js
(() => {
  const v = document.getElementById("valores");
  return JSON.stringify({
    itensGrade: v.querySelectorAll("ul li").length,
    tituloGrade: Math.round(parseFloat(getComputedStyle(v.querySelector("ul h3")).fontSize)),
    acordeaoOculto: getComputedStyle(v.querySelector("div.hidden, div.md\\:flex")).display === "none",
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  });
})();
```

Esperado: `itensGrade: 6`, `tituloGrade: 20`, `overflow: false`.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/ui/interactive-accordion.tsx
git commit -m "Ajustar tipografia e geometria do acordeao de Valores

O painel sobe de 420px para 480px: o titulo rotacionado a 90 graus tem
a altura do painel como limite, e a fonte maior precisa do espaco.

O titulo do painel aberto usa valor local, nao token fluido: o acordeao
tem geometria fixa e a largura do painel ja varia sozinha por flex-grow,
entao um segundo eixo de variacao brigaria com o primeiro."
```

---

## Task 7: Manual de marca

**Files:**
- Modify: `docs/brand-guidelines.md`

**Interfaces:**
- Consumes: as decisões implementadas nas Tasks 1 a 6.
- Produces: nada em código.

- [ ] **Step 1: Substituir a tabela de escala tipográfica**

Na seção 4, a tabela "Escala tipográfica" atual descreve a escala antiga (Hero 56px, H2 28-36, H3 15-16, Body 14-16, Botão 10-11). Substituir por:

```markdown
### Escala tipográfica (2026-08-02)

A escala vive em tokens no `@theme` do `globals.css`, não em valores espalhados pelos componentes. Cada token é fluido: um `clamp()` que interpola entre o tamanho de mobile e o de desktop.

| Token | Papel | Mobile → Desktop | Fonte |
|---|---|---|---|
| `text-micro` | disclaimer, legenda mínima | 10 → 11 | Roboto |
| `text-caption` | botões, labels em caixa alta | 12 → 13 | Roboto |
| `text-body` | corpo de texto | 16 → 17 | Roboto |
| `text-lead` | parágrafo de destaque | 19 → 21 | Roboto |
| `text-h3` | H3 de card | 20 → 22 | Roboto |
| `text-h2` | título de seção | 32 → 44 | Coolvetica |
| `text-stat` | numeral da seção Números | 48 → 68 | Coolvetica |
| `text-display` | H1 da Hero e tagline | 44 → 88 | Coolvetica |

**Não use `sm:` ou `lg:` de tamanho junto com esses tokens.** O `clamp()` já cobre a faixa inteira; um breakpoint por cima reintroduz o salto que a escala fluida existe para eliminar.

**A âncora em `rem` do `clamp()` não é opcional.** Um `clamp()` que interpola em `vw` puro ignora o zoom do navegador: o texto para de crescer quando o usuário aumenta a fonte. A forma `rem + vw` preserva o zoom.

**Por que esta escala substituiu a anterior:** a antiga era bimodal. Tinha dois ou três elementos grandes e todo o resto comprimido entre 11 e 16px, sem nada entre 20 e 36. O H3 de card tinha 16px e o corpo 14px, e dois pixels de diferença não estabelecem hierarquia, então os cards liam como bloco cinza uniforme.
```

- [ ] **Step 2: Documentar o sistema de larguras**

Na seção 6 (Componentes de UI), acrescentar uma subseção nova. O documento hoje não registra largura de container em lugar nenhum:

```markdown
### Larguras de container (2026-08-02)

Duas faixas, com critério:

| Faixa | Largura | Onde |
|---|---|---|
| Conteúdo | 1280px (`max-w-7xl`) | Hero, Processo, Sobre, Números, Valores, Soluções, Atendimento |
| Texto corrido | 768px (`max-w-3xl`) | CTA Final |

Antes desta rodada eram cinco larguras diferentes sem critério: 512, 672, 768 e 1024, o que fazia as seções estreitas deixarem margens laterais grandes e vazias no desktop.

**Trava de legibilidade, obrigatória junto:** todo bloco de texto corrido dentro da faixa de conteúdo fica limitado a `max-w-[68ch]`. Container largo sem essa trava produz linhas de mais de 100 caracteres, e a página trocaria "pequeno demais" por "difícil de ler".

**Cuidado com limites internos.** Alargar o container não adianta se o conteúdo tem o próprio teto por dentro. A seção Processo tinha um `max-w-[440px]` no texto de cada passo que precisou sair junto, senão a seção ficaria larga e vazia.
```

- [ ] **Step 3: Registrar os slots de fotografia**

Na mesma seção 6:

```markdown
### Slots de fotografia

Duas seções têm espaço reservado para foto que o cliente ainda não forneceu: Processo (ao lado da linha do tempo) e Sobre (dentro da caixa navy). Ambos usam o componente `PhotoSlot` (`components/ui/photo-slot.tsx`), que renderiza um placeholder visível, com borda tracejada e a descrição do que a foto precisa mostrar.

O placeholder é deliberadamente visível. Um buraco declarado é mais honesto que um bloco cinza mudo, e a decisão de 2026-07-31 de não usar banco de imagens continua valendo: o manual aponta o visual próprio como o diferencial real da marca frente aos concorrentes, e stock genérico trabalha contra isso.

Os painéis da seção Valores também foram desenhados para receber foto no lugar do gradiente, se o cliente fornecer.
```

- [ ] **Step 4: Adicionar o bloco datado da rodada**

Seguindo a convenção do documento, que abre com um bloco `⚠️` por rodada, inserir logo depois do bloco "Rodada 2026-08-01":

```markdown
## ⚠️ Rodada de escala (2026-08-02 — ler antes de implementar UI)

O cliente reclamou que os elementos estavam pequenos, deixando espaço vazio, e enviou seis referências (One7 Partner, Mais Crédito e Grupo, em celular e desktop).

O diagnóstico, medido no site em execução, foi que a escala não estava pequena: estava **bimodal**. Ver a seção 4 para a escala nova e a seção 6 para o sistema de larguras.

**Ficou explicitamente fora desta rodada**, mesmo aparecendo nas três referências de desktop: Hero full-bleed com foto sangrando na borda, rodapé escuro com marca-d'água, e cards densos com lista de bullets. Se a distância visual para as referências ainda incomodar, é aí que ela mora — não em tamanho de fonte.
```

- [ ] **Step 5: Atualizar o checklist da seção 7**

O checklist tem itens que a escala nova torna obsoletos ou que precisam de companhia. Ajustar o item da fonte de display e acrescentar dois:

```markdown
- [ ] Tamanhos de texto vindos dos tokens da escala (`text-body`, `text-h3`, `text-h2`...), nunca valores soltos, e sem `sm:`/`lg:` de tamanho por cima
- [ ] Texto corrido em container largo limitado a `max-w-[68ch]`
```

- [ ] **Step 6: Verificar a consistência**

Reler as seções 4, 6 e 7 inteiras procurando afirmação que a implementação agora contradiga: qualquer tamanho em px da escala antiga apresentado como atual, e qualquer menção a largura de container que não bata com as duas faixas.

- [ ] **Step 7: Commit**

```bash
git add docs/brand-guidelines.md
git commit -m "Atualizar manual: escala fluida em tokens e sistema de larguras

Registra tambem duas regras que nao existiam no documento: a trava de
68 caracteres para texto corrido em container largo, e a ancora em rem
do clamp, sem a qual o texto ignora o zoom do navegador."
```

---

## Verificação final (depois da Task 7)

- [ ] **Build de produção**

```bash
cd web && npm run build
```

Esperado: compila sem erro, 3 páginas estáticas.

- [ ] **A escala inteira, nos dois extremos**

Medir cada token contra a tabela da Task 1, em 375px e em 1440px, recarregando após cada mudança de viewport. Todos os oito tokens precisam bater.

- [ ] **Comprimento de linha**

Todo parágrafo dentro dos containers de 1280px em 68 caracteres ou menos. É a trava que impede esta rodada de virar uma regressão de leitura.

- [ ] **Sem overflow horizontal**

Em 375px, 768px e 1440px: `document.documentElement.scrollWidth === clientWidth`.

- [ ] **Contraste nos pontos que mudaram de tamanho**

Texto maior sobre a caixa dourada de Números, sobre a caixa navy de Sobre, e sobre os painéis do acordeão. **Tailwind v4 emite cores em `oklab()`** — converter para sRGB antes de compor o alpha; uma regex ingênua sobre a string de `getComputedStyle` produz lixo.

- [ ] **Console limpo de erros novos**

Existe um aviso conhecido e pré-existente de serialização RSC vindo do acordeão de Valores, documentado em `docs/superpowers/specs/2026-07-31-gradientes-sobre-valores-design.md`. Esse é esperado. Qualquer erro **novo** é achado.

**Limitações conhecidas do ambiente**, já verificadas nesta base e nenhuma delas defeito do site: o painel do navegador não compõe frames, então `IntersectionObserver` não dispara (blocos em `Reveal` ficam em `opacity: 0`, a tagline não revela, os contadores não iniciam), transições CSS não avançam, e screenshots falham. Verificar por DOM e por classe, não por pixel.
