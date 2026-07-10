# Hero Section — Celer Capital LP — Design Spec

**Data:** 2026-07-09
**Status:** Aprovado pelo usuário, pronto para plano de implementação
**Escopo:** Apenas a seção Hero da landing page (primeira tela, above the fold + faixa de logos parceiros). As demais seções (Processo, Para Quem, Diferenciais, CTA final, Footer, e as novas seções ainda não desenhadas) ficam fora deste spec — cada uma terá seu próprio ciclo spec → plano → implementação.

## Contexto

Este é o primeiro componente da nova versão do site da Celer Capital (cliente da agência Télos) a ser implementado com stack de produção. Até aqui o projeto tinha apenas: um mockup estático (`celer-capital-lp-mockup.html`, v3, aprovado conceitualmente para reunião de radar mas nunca publicado ao cliente), um brand guideline consolidado (`docs/brand-guidelines.md`) e duas referências visuais convertidas para estudo (`references/clause/`, `references/finpay/`).

Ver `docs/brand-guidelines.md` para personalidade de marca, paleta, tipografia, voz/tom e a correção de escopo do negócio (Celer é securitizadora de recebíveis, não "instituição financeira"/assessoria de investimentos).

## Decisão de arquitetura

Pivô de HTML/CSS puro para **Next.js (App Router) + Tailwind + shadcn/ui**, para habilitar componentes de UI testados e primitivas de animação (Magic UI).

- Novo app fica em `Site/web/` — isola `node_modules`/build de `docs/`, `assets/`, `references/`, que continuam sendo a fonte de verdade da marca e não são duplicados.
- Tailwind theme (`tailwind.config`) importa cores/tipografia a partir de `assets/design-tokens.json` (fonte única) — não redeclarar valores de cor/fonte à mão no config.
- shadcn/ui inicializado com os componentes `Button`, `Badge`, `Card`.
- Magic UI (`TextAnimate`, `BlurFade`) adicionado via registry do shadcn CLI — depende de `framer-motion`.
- `lucide-react` para ícones (seta do CTA, ícone do WhatsApp na bolha do mockup).

## Camada 1 — Referência visual

| Fonte | Padrão extraído | Aplicação no Hero |
|---|---|---|
| Mockup v3 (aprovado) | Grid split 55/45; painel esquerdo navy com eyebrow dourado + H1 serifado com ênfase em itálico + subtítulo + CTA; painel direito mais escuro com glow radial sutil | Mantém a estrutura inteira — já validada conceitualmente antes da reunião de radar |
| Finpay | Card de produto flutuando sobre o painel direito (sombra, cantos arredondados, borda sutil) — parece captura de tela real, não bloco decorativo | O conteúdo do card muda: em vez de stat cards abstratos, é um mockup de conversa de WhatsApp |
| Clause | Textura de fundo pontilhada (dot-grid) de baixa opacidade para dar profundidade a área plana sem imagem real | Camada de fundo sutil atrás do texto no painel esquerdo, desligada em mobile |

Espaçamento e hierarquia tipográfica seguem `brand-guidelines.md` (padding de seção 88px desktop; H1 56px/34px Cormorant Garamond 600; corpo 16px/14px Roboto).

## Camada 2 — Critério de UI/UX e riscos identificados

- **Contraste do eyebrow dourado:** `#996515` sobre `#011E2E` = 3.4:1. Insuficiente para texto pequeno normal; aceitável apenas como texto bold ≥14px (limiar WCAG de "texto grande em negrito"). Decisão: eyebrow em peso 700, uppercase, tracking largo — ponto de atenção documentado, revisar em QA visual.
- **Card de WhatsApp pode parecer interativo quando não é:** sem campo de input visível, sem cursor piscando, sem qualquer elemento com affordance de clique. Marcado com `role="img"` e `aria-label` descritivo — é uma prova visual, não um widget funcional.
- **CTA do WhatsApp sem número confirmado:** não inventar link. `href="#whatsapp-pendente"` com comentário `{/* TODO: confirmar número com cliente antes de publicar */}` até o dado ser confirmado. Ver `feedback_no_unconfirmed_data` (memória de projeto).
- **Responsividade:** abaixo do breakpoint `lg`, grid vira coluna única (texto → card de WhatsApp reduzido); dot-grid desligado em mobile (contraste e performance).
- **Acessibilidade:** um único `<h1>`; CTA como elemento real com texto descritivo ("Antecipar meus recebíveis", nunca "Saiba mais"); `:focus-visible` com outline dourado sobre fundo escuro, nunca `outline: none` sem substituto.
- **Motion / `prefers-reduced-motion`:** `TextAnimate` (H1) e `BlurFade` (stagger dos demais elementos) tocam uma vez no carregamento — nunca em loop. Ambos precisam de fallback: se `prefers-reduced-motion: reduce`, renderizar conteúdo direto, sem animação de entrada.
- **Indicador de "digitando" no card de WhatsApp:** toca uma única vez (3 pontos pulsando) antes da bolha de resposta aparecer — nunca em loop. Rejeitado o uso do componente `TypingAnimation` (Magic UI) tal como sugerido originalmente, porque esse componente é feito para alternar palavras em loop indefinido, o que viola WCAG 2.2.2 (Pause, Stop, Hide — conteúdo automático, >5s, repetitivo, sem mecanismo de pausa) e dilui a headline fixa da marca. Implementação própria e mínima em vez do componente literal.
- **Sem estados de loading/erro:** hero é estático, sem fetch de dado nesta tela.
- **Microcopy:** headline travada — "O capital que já é seu não deveria esperar." (com "esperar" em itálico/dourado). Mensagem simulada no card de WhatsApp usa frase literal da persona Rodrigo (Tagueamento): "Vi que vocês antecipam recebíveis, é isso?" — não inventada.

## Camada 3 — Componentes

- **shadcn/ui `Button`** — variantes restilizadas com tokens da Celer: `gold` (CTA primário, preenchido) e `ghost` (CTA secundário, translúcido). Reaproveita a primitiva em vez de recriar do zero.
- **shadcn/ui `Badge`** — usado como o padrão "eyebrow" (tag pequena uppercase, ex: "Securitizadora").
- **shadcn/ui `Card`** — casco do mockup de WhatsApp (borda, sombra, raio). Bolhas de chat internas são markup próprio (não existe primitiva de chat bubble no shadcn) — mantido mínimo, sem elemento decorativo sem função.
- **Magic UI `TextAnimate`** (`animation="slideUp"`, `by="word"`) — no H1, toca uma vez no carregamento.
- **Magic UI `BlurFade`** — stagger de entrada para badge → subtítulo → botões → card de WhatsApp, delay incremental (~0.1s entre elementos), `triggerOnce`.
- **Indicador de digitação customizado** — 3 pontos com animação CSS, single-play, dentro do card de WhatsApp (substitui o uso do `TypingAnimation` do Magic UI, rejeitado por loop infinito).
- **`lucide-react`** — ícones (seta no botão CTA, ícone do WhatsApp na bolha).
- **Explicitamente fora:** nenhum componente Aceternity/Magic UI decorativo sem função (sem partículas, blobs animados, parallax).

## Critérios de aceite

- [ ] Estrutura split 55/45 em desktop, coluna única em mobile/tablet (`<lg`)
- [ ] H1 único, com "esperar" em itálico dourado, animado via `TextAnimate` (slideUp, by word), com fallback estático para `prefers-reduced-motion`
- [ ] Badge eyebrow "Securitizadora" em peso 700 uppercase — risco de contraste conhecido (gold sobre navy = 3.4:1, abaixo do limiar de texto pequeno) mantido conscientemente por ora; revisar visualmente em QA antes de publicar em produção
- [ ] CTA primário e secundário com texto descritivo, sem link fake para WhatsApp (placeholder documentado no código)
- [ ] Card de WhatsApp: bolhas de mensagem + indicador de digitação (single-play) + resposta da Celer, `role="img"` + `aria-label`, sem affordance de input
- [ ] Dot-grid de fundo sutil no painel esquerdo, oculto em mobile
- [ ] Todos os elementos com `:focus-visible` funcional
- [ ] Nenhuma animação em loop infinito em nenhum elemento
- [ ] Cores/fontes lidas de `assets/design-tokens.json`, não redeclaradas

## Fora de escopo (para specs futuros)

- Demais seções da LP (Processo, Para Quem, Diferenciais, CTA final, Footer, novas seções)
- Confirmação real do número de WhatsApp e demais dados pendentes (ver `docs/brand-guidelines.md` seção de correção de escopo)
- Deploy/CI
