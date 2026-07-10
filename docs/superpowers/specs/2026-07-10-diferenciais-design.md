# Diferenciais — Celer Capital LP — Design Spec

**Data:** 2026-07-10 · **Status:** Executado em continuação, autorrevisão registrada abaixo.
**Escopo:** Quarta seção — tabela comparativa Celer vs. banco tradicional.

## Camada 1 — Referência visual

| Fonte | Padrão | Aplicação |
|---|---|---|
| Mockup v3 (`.dif`/`.dif-table`) | Fundo navy (volta ao escuro — Cream→Navy mantém a alternância), 3 colunas (rótulo/Celer/banco), linha de cabeçalho, valores do banco com `line-through` e opacidade reduzida | Estrutura mantida 1:1 — tabela comparativa é padrão documentado no brand guideline §6 |
| ui-ux-pro-max (`data-table`, `data-not-only`) | Tabelas de dado precisam de alternativa acessível e não podem depender só de estilo visual (tachado) pra comunicar "isso é pior" | Adiciono `<span className="sr-only">`descrevendo "não" antes de cada valor do banco, para não depender só do `line-through` visual |

Copy das 4 linhas travada no mockup v3 (nenhuma alteração de conteúdo).

## Camada 2 — Critério de UI/UX e riscos

- **Heading:** `<h2>` "O que muda quando você não vai ao banco." — segue a hierarquia (h1 único no Hero).
- **Tabela real vs. grid decorativo:** o mockup usava puramente `div`s em grid (não uma tabela HTML de verdade). Decisão: usar elementos semânticos de tabela (`<table>`/`<caption>`/`<th scope="col">`) em vez de divs — é literalmente dado tabular (comparação de atributos), e leitores de tela navegam tabelas de forma muito mais previsível que divs com grid. Isso é uma melhoria deliberada sobre o mockup original, não só uma tradução 1:1.
- **Responsivo:** tabela HTML com 3 colunas fica apertada abaixo de `sm`. Solução: `overflow-x-auto` num wrapper (nunca deixar a página inteira rolar horizontalmente — só a tabela, se necessário) + `min-width` na tabela para não espremer o texto.
- **Contraste:** branco sobre navy AAA; coluna "banco tradicional" usa branco a 25% de opacidade + tachado — só decorativo, o texto em si continua legível o suficiente para quem precisa ler (não é a única forma de transmitir "pior", ver nota do sr-only acima).
- **Motion:** linhas entram via `Reveal` com stagger leve; nada de animação contínua.
- **Sem estado vazio/erro.**

## Camada 3 — Componentes

- **`<table>` semântica própria** (não há primitiva de tabela no shadcn instalada; não vale a pena instalar um `Table` component só para 4 linhas × 3 colunas — construir direto com Tailwind é mais simples e igualmente acessível quando os elementos semânticos corretos são usados).
- **`Reveal`** para entrada das linhas.
- `id="diferenciais"` para o link já existente na navbar.

## Critérios de aceite

- [x] `<h2>` único, tag "Por que a Celer" em dourado acima
- [x] `<table>` semântica com `<caption>` (sr-only, descreve o propósito da tabela), `<th scope="col">` no cabeçalho
- [x] Coluna "banco tradicional" com indicação textual (sr-only) além do tachado visual
- [x] `overflow-x-auto` no wrapper da tabela, nunca na página inteira
- [x] Stagger via `Reveal`
- [x] `id="diferenciais"` para navegação âncora
