# CTA Final + Footer — Celer Capital LP — Design Spec

**Data:** 2026-07-10 · **Status:** Executado em continuação, autorrevisão registrada abaixo.
**Escopo:** Últimas duas seções da página — fecham o funil (mesmo spec, são curtas e sempre construídas juntas).

## Camada 1 — Referência visual

| Fonte | Padrão | Aplicação |
|---|---|---|
| Mockup v3 (`.cta`) | Fundo black (`ink`), conteúdo centralizado, glow radial, tag "Próximo passo", h2 forte, botão verde WhatsApp, disclaimer pequeno abaixo | Estrutura mantida 1:1 |
| Mockup v3 (`footer`) | Fundo navy, copyright + CNPJ (placeholder) à esquerda, tagline em itálico dourado à direita | Estrutura mantida, com uma correção (ver Camada 2) |

Copy do CTA final travada no mockup v3. Alternância de fundo: Quebra de Objeção (branco) → CTA Final (black) → Footer (navy) — nunca duas claras/escuras seguidas.

## Camada 2 — Critério de UI/UX e riscos

- **Heading:** `<h2>` "Quanto capital está parado nos seus recebíveis agora?" — última seção com heading da página.
- **"Registrada na CVM" no footer do mockup v3 — removido.** Isso é uma afirmação regulatória específica (registro na CVM) que não está na lista de fatos confirmados pelo cliente (`contexto-compactado-celer-capital-lp.md` só confirma que o CNPJ é placeholder, nunca menciona status de registro na CVM). Uma securitizadora pode operar sob estruturas diferentes (FIDC, registro direto, etc.) — afirmar "Registrada na CVM" sem confirmação é o mesmo tipo de erro que a correção de escopo do brand guideline já alertou (nunca declarar fato regulatório/operacional não confirmado). Troquei por um comentário `TODO` explícito no código e nenhuma afirmação visível no lugar.
- **Botão do WhatsApp:** único uso aprovado da cor `whatsapp` (exceção documentada no brand guideline) — mantido `href="#whatsapp-pendente"` com o mesmo TODO já usado no Hero/Navbar.
- **Contraste:** branco sobre black ≈ 19.6:1 AAA. Verde do WhatsApp com texto branco — já validado como uso funcional único.
- **Footer — links de navegação:** o mockup v3 não tinha links de coluna (só copyright+tagline). Mantive assim — não inventar arquitetura de informação (colunas de links tipo "Produto/Empresa/Recursos") que não existe ainda no site (só uma página, sem outras rotas para linkar).
- **Motion:** `Reveal` no bloco do CTA. Footer sem motion (conteúdo institucional estático, não precisa de entrada animada — Emil: não animar o que não agrega).

## Camada 3 — Componentes

- Botão do WhatsApp reaproveita `buttonVariants` + classe `bg-whatsapp` (mesma técnica do Hero).
- `Reveal` para o bloco central do CTA.
- Footer sem componente de card/reveal — é rodapé institucional simples.
- `id="cta-final"` no CTA para eventual link futuro (não usado na navbar por ora, mesma decisão do `id` da Quebra de Objeção).

## Critérios de aceite

- [x] `<h2>` único no CTA final
- [x] Botão WhatsApp com `href` placeholder documentado
- [x] Disclaimer "Sem compromisso · Sem consulta de crédito · Resposta rápida" mantido (copy já aprovada, sem dado numérico)
- [x] Footer sem afirmação de registro regulatório não confirmada
- [x] CNPJ mantido como placeholder visível (`XX.XXX.XXX/0001-XX` já era placeholder no v3, mantido)
- [x] Stagger via `Reveal` só no CTA, footer estático
