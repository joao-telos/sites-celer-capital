# Resumo — LP Celer Capital completa (v1 em React)

**Data:** 2026-07-10
**Status:** Todas as seções da página construídas e commitadas. Pronta para revisão do usuário — nada foi publicado/deployado.

## O que foi construído, nesta ordem

| # | Seção | Commit | Observação |
|---|---|---|---|
| 1 | Hero | `6b0a46f` | Feita em sessão anterior — spec em `2026-07-09-hero-section-design.md` |
| 2 | Navbar | `4414d1e` | Feita pela execução agendada (`celer-capital-lp-sections`) antes de travar |
| 3 | Processo | `4d6bf5e` | Escrita pela execução agendada, retomada e commitada manualmente após ela travar (ver histórico da conversa) |
| 4 | Para Quem | `33f938c` | Construída em continuação manual |
| 5 | Diferenciais | `6240d84` | Construída em continuação manual |
| 6 | **Quebra de Objeção** (nova, fora da v3) | `c09cd4d` | Decisão autônoma — ver justificativa abaixo |
| 7 | CTA Final + Footer | `104a398` | Fecha a página |

A execução agendada (`celer-capital-lp-sections`) travou depois de escrever a spec e o componente da seção Processo, sem commitar — provavelmente esperando aprovação de alguma ferramenta que não pôde ser concedida com o usuário ausente. O usuário me pediu para assumir manualmente a partir daí, e o restante do trabalho (Processo em diante) foi verificado e construído nesta conversa, seguindo o mesmo processo.

## Seção nova além da v3 — por que só uma, e por que essa

O mockup v3 tinha 6 seções (Navbar, Hero, Processo, Para Quem, Diferenciais, CTA Final, Footer). O pedido original era "mais seções que a primeira" — escolhi acrescentar **uma** seção nova (Quebra de Objeção: "Antecipação não é dívida"), não três, para não inflar uma landing page de uma página só.

Critério: usei a tabela de "Oportunidades de conteúdo por lacuna" do Tagueamento. As outras lacunas de alto valor foram descartadas conscientemente:
- **Vácuo de mercado** (Celer atende quem a AG Antecipa recusa) — exigiria citar concorrente por nome em site público, uma decisão de risco legal/estratégico que cabe ao cliente/agência, não a mim.
- **Prova social/depoimento** — não existe depoimento real disponível; inventar um violaria a regra do projeto contra dado fabricado.
- **"Isso não é empréstimo"** foi escolhida por ser, segundo o próprio documento de Segmentação, "a maior barreira cognitiva de entrada neste mercado", e por não depender de nenhum número ou fato operacional não confirmado.

## Placeholders e TODOs pendentes de confirmação do cliente

Todos marcados de forma visível no código (comentário `TODO`), nunca preenchidos com dado plausível inventado:

1. **Número de WhatsApp** — todos os CTAs apontam para `#whatsapp-pendente` (Navbar, Hero, CTA Final). Precisa do número real para montar o link `https://wa.me/55...`.
2. **Taxa de antecipação** — não aparece em nenhuma seção (decisão já tomada antes desta execução: não inventar percentual).
3. **Prazo de aprovação exato** — a copy usa "horas" (já aprovado no mockup v3), mas o valor exato ("em até X horas úteis") não está confirmado.
4. **Cobrança do devedor** (`processo.tsx`, passo 5) — a copy afirma que a Celer cobra o devedor no vencimento; isso vem do mockup v3 aprovado, mas o `contexto-compactado-celer-capital-lp.md` lista isso como pendente de confirmação. Mantive a copy (já era aprovada) mas com TODO explícito — recomendo confirmar antes de publicar.
5. **CNPJ** (`footer.tsx`) — placeholder `XX.XXX.XXX/0001-XX`, como já era no v3.
6. **Registro regulatório (CVM)** — o mockup v3 tinha "Registrada na CVM" no rodapé; **removi** essa afirmação porque não está confirmada em lugar nenhum da documentação do projeto, e é o tipo de afirmação regulatória que não deve ser publicada sem confirmação explícita do cliente. TODO no código apontando isso.
7. **Logos de parceiros/clientes** (`hero.tsx`) — placeholders genéricos "Parceiro A/B/C/D", sem nomes reais nem contagem inventada ("Mais de 100+" foi removido — ver spec do Hero).
8. **Credenciais da equipe** — nenhuma seção de "sobre/equipe" foi criada porque não há credenciais confirmadas para exibir (ver `contexto-compactado`, item pendente). Se o cliente fornecer isso, é uma seção nova candidata natural para uma v2.

## Riscos de UI/UX conhecidos, documentados e não resolvidos

- **Contraste do eyebrow dourado sobre navy** (`text-gold` em badges/tags sobre fundo navy/black): ~3.4:1, abaixo do limiar de texto pequeno normal (4.5:1), mas usado em uppercase bold pequeno — risco de longa data, já documentado desde a spec do Hero, nunca resolvido de propósito (ver spec do Hero para o raciocínio). Recomendo revisão visual final antes de publicar.
- **`preview_screenshot` parou de funcionar** durante esta sessão (timeout consistente) a partir da seção Processo em diante — toda validação visual desde então foi feita via `preview_inspect` (estilos computados), `preview_snapshot` (árvore de acessibilidade) e `preview_eval` (scrollWidth/innerWidth para overflow), não por captura de tela real. Os números batem com o esperado, mas uma conferência visual humana (ou com o screenshot funcionando) é recomendada antes de aprovar definitivamente.
- **Navbar com apenas 3 links** (Como funciona, Para quem, Diferenciais) — as seções novas (Quebra de Objeção, CTA Final) não têm `id` linkado na navbar; decisão consciente de não redesenhar a arquitetura de navegação sem o cliente revisar a seção nova primeiro.

## Verificação aplicada em cada seção

`npx tsc --noEmit` e `npx eslint .` limpos a cada commit; validação em 1440px e 375px via browser (sem overflow horizontal em nenhuma seção); árvore de acessibilidade conferida (hierarquia h1→h2→h3 correta, tabela semântica real em Diferenciais, WhatsApp mock com `aria-hidden` no conteúdo interno); nenhuma animação em loop infinito; `prefers-reduced-motion` tratado via `useSyncExternalStore` (não `setState` síncrono em efeito — um anti-padrão real pego pelo ESLint durante a sessão anterior e replicado corretamente em todas as seções novas via o componente `Reveal` compartilhado).

## Não incluído nesta execução

- Deploy ou pull request (fica para quando o usuário revisar).
- Confirmação de qualquer dado pendente listado acima.
- Redesenho da navbar para incluir as seções novas.
- Testes automatizados (não fazem parte do escopo pedido).
