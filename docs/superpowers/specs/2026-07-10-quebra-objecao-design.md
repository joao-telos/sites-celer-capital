# Quebra de Objeção — Celer Capital LP — Design Spec

**Data:** 2026-07-10 · **Status:** Nova seção (não existia na v3), decisão autônoma registrada abaixo.

## Por que essa seção existe (decisão autônoma)

A v3 tinha 6 seções (Navbar, Hero, Processo, Para Quem, Diferenciais, CTA Final, Footer). O usuário pediu explicitamente que a versão final tivesse mais seções que a v3. Escolhi **uma** seção nova — não três — para não inflar a LP sem necessidade (é uma página única, não um site institucional).

Critério de escolha: usei a tabela "Oportunidades de conteúdo por lacuna" do Tagueamento (resumida em `docs/brand-guidelines.md`) e escolhi a lacuna #3 — **"Isso não é empréstimo"** — porque:
1. O próprio documento de Segmentação chama isso de "a maior barreira cognitiva de entrada neste mercado" (todos os concorrentes analisados têm conteúdo dedicado a essa dúvida).
2. É a única lacuna de alto valor que **não depende de nenhum dado operacional não confirmado** (taxa, prazo, cobrança) — as outras lacunas fortes (vácuo de mercado citando concorrentes nominalmente, prova social com depoimento real) exigiriam ou citar concorrentes por nome (arriscado legal/eticamente para um site público) ou inventar um depoimento (proibido pelas regras do projeto).
3. Copy já existe quase pronta na Persona (Tagueamento, seção "Linguagem da Persona"): "Mas isso não é empréstimo? Como funciona?" e no framing de lacuna: "Antecipação não é dívida. É receber hoje o que já é seu por direito."

Descartei explicitamente: seção de prova social (sem depoimento real disponível), seção de vácuo de mercado citando concorrentes (citar nome de concorrente em site público é uma decisão de risco que deve ser do cliente/agência, não uma decisão autônoma minha).

## Camada 1 — Referência visual

Nenhuma referência direta no mockup v3 (seção nova). Estrutura inspirada no padrão de comparação já estabelecido em Diferenciais (duas colunas, uma "errada"/apagada e uma "certa"/destacada), mas em formato de card em vez de tabela — o conteúdo aqui é conceitual (o que é vs o que não é), não dado tabular linha a linha, então uma tabela seria forçar um formato errado para o conteúdo (regra geral de UI: escolher o padrão pelo tipo de conteúdo, não repetir o último padrão usado por inércia).

Fundo branco (`bg-white`) — depois de Diferenciais (navy), quebra para claro; ainda não tínhamos usado branco puro (só cream e navy/black até aqui), dá variedade sem quebrar a alternância clara/escura.

## Camada 2 — Critério de UI/UX e riscos

- **Heading:** `<h2>` "Antecipação não é dívida." — segue a hierarquia da página.
- **Contraste:** navy sobre branco ≈ 15.8:1 (AAA). Card "Empréstimo" com texto muted (#666-equivalente) sobre fundo cinza claro — preciso conferir ≥4.5:1 na implementação.
- **Não é tabela:** decisão consciente registrada acima — dois cards lado a lado, não `<table>`, porque o conteúdo é conceitual/comparativo qualitativo, não dado tabular.
- **Responsivo:** 2 colunas desktop, 1 coluna mobile (cards empilhados, "Empréstimo" primeiro depois "Antecipação com a Celer" — ordem de leitura: mito antes da correção).
- **Risco de conteúdo:** nenhum dado numérico não confirmado nesta seção — só conceitual. Verificado ao escrever a copy.
- **Motion:** `Reveal` stagger nos dois cards.

## Camada 3 — Componentes

- **shadcn `Card`** reaproveitado para os dois blocos de comparação (mesma primitiva já usada em Para Quem e no mockup do WhatsApp no Hero).
- **`Reveal`** para entrada.
- Ícone `X` (lucide) no card "Empréstimo" e `Check` no card "Antecipação" — reforça a diferença sem depender só de cor (mesma regra aplicada em Diferenciais).
- `id="nao-e-emprestimo"` — não adicionado à navbar por ora (navbar já tem 3 links; adicionar um 4º é uma decisão de IA de navegação que prefiro deixar para quando o cliente revisar a seção, mas a seção funciona via scroll normal de qualquer forma).

## Critérios de aceite

- [x] `<h2>` único, tag "Quebra de objeção" em dourado acima
- [x] Dois cards (Empréstimo / Antecipação com a Celer) com ícone diferenciador (X / Check), não só cor
- [x] 1 coluna mobile, 2 colunas `sm:` acima
- [x] Nenhum dado numérico não confirmado
- [x] Stagger via `Reveal`
