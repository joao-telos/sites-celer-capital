# Processo — Celer Capital LP — Design Spec

**Data:** 2026-07-10 · **Status:** Executado autonomamente (run agendado), autorrevisão registrada abaixo.
**Escopo:** Segunda seção da LP — timeline de 5 etapas, do contrato do cliente ao capital na conta.

## Camada 1 — Referência visual

| Fonte | Padrão | Aplicação |
|---|---|---|
| Mockup v3 (`.processo`/`.timeline`) | Fundo black (`#020B14`), glow radial teal sutil no canto, linha vertical conectando 5 dots numerados, cor do dot progride gold→gold→teal→teal-translúcido→branco-translúcido (comunica "início urgente, chegada tranquila") | Estrutura mantida 1:1 — já validada e é o padrão de timeline reaproveitável do brand guideline (§6) |
| Brand guidelines §6 | Timeline numerada é padrão para "qualquer sequência de processo", não exclusiva desta seção | Aplicado como componente próprio (`ProcessTimeline`) que pode ser reaproveitado depois se necessário |

Copy travada nos 5 steps já aprovados no mockup/contexto compactado (nenhuma alteração de conteúdo, só de markup/estilo).

## Camada 2 — Critério de UI/UX e riscos

- **Hierarquia de heading:** `<h2>` único ("Do contrato fechado ao capital na conta."), primeira seção depois do Hero a usar h2 — mantém a regra de que só o Hero tem h1.
- **Contraste:** texto branco/teal sobre black — AAA (§3 do guideline). Números dos dots em Cormorant Garamond ≥16px, dentro da regra "nunca abaixo de 20px" — ajustar para 20px mínimo (era 16px no mockup, HTML estático não seguia a própria regra do guideline; corrigido aqui).
- **Linha da timeline em telas pequenas:** dots + linha vertical funcionam nativamente em coluna única (mobile-first) — sem necessidade de reestruturação, o grid `40px 1fr` já é responsivo por natureza.
- **Passo 5 ("A Celer cuida do restante" / cobrança do devedor):** dado de processo operacional não 100% confirmado (ver `contexto-compactado`, item pendente "se fazem cobrança do devedor"). Mantido pois já está na copy aprovada do mockup v3 — mas marcado com comentário TODO no código apontando a pendência, para o cliente confirmar antes de publicar em produção.
- **Motion (Jakub principal, Jhey secundário):** cada `tl-item` entra via `Reveal` (BlurFade) com stagger incremental (~0.1s), replicando o padrão já usado no Hero. A linha vertical de fundo (`::before` do mockup) é puramente decorativa e estática — não anima (Emil: não animar o que não carrega informação).
- **Reduced motion:** herdado do `Reveal` (fallback estático já testado no Hero).
- **Sem estado vazio/erro:** conteúdo estático, sem fetch.

## Camada 3 — Componentes

- **`Reveal`** (wrapper existente) para stagger de entrada dos 5 itens.
- Sem shadcn `Card` aqui — os itens da timeline não são cartões, são linhas de conteúdo (mantém fiel ao mockup, evita "cardificar" tudo desnecessariamente).
- Sem Magic UI adicional — nenhuma necessidade de texto animado (não é headline).
- `id="processo"` na `<section>` para o link da navbar.

## Critérios de aceite

- [x] `<h2>` único, tag "O processo completo" em dourado acima
- [x] Fundo black (`bg-ink`), glow radial teal sutil (`::before`-like via div absolute)
- [x] 5 itens de timeline com dot numerado, título, texto — cores dos dots progredindo gold→teal→silver
- [x] Números dos dots em Cormorant Garamond ≥20px
- [x] Stagger de entrada via `Reveal`, respeitando `prefers-reduced-motion`
- [x] `id="processo"` para navegação âncora
- [x] TODO documentado sobre o passo 5 (cobrança do devedor) pendente de confirmação
