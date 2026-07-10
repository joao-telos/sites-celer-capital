# Navbar — Celer Capital LP — Design Spec

**Data:** 2026-07-10
**Status:** Executado autonomamente (run agendado) — sem aprovação humana prévia, autorrevisão registrada abaixo.
**Escopo:** Barra de navegação fixa no topo da LP.

## Camada 1 — Referência visual

| Fonte | Padrão extraído | Aplicação |
|---|---|---|
| Mockup v3 (`nav`) | Fundo navy, logo à esquerda (símbolo geométrico + wordmark "Celer"/"Capital"), links âncora translúcidos ao centro/direita, CTA dourado à direita, linha inferior com gradiente dourado→transparente | Estrutura mantida; vira `<header>` sticky com leve blur/opacidade ao rolar para não competir com o Hero |
| Brand guidelines §5 (Logo) | Duas letras "C" sobrepostas, geometria hexagonal/isométrica; área de proteção mínima 30px; tamanho mínimo 120px lockup / 32px símbolo | Símbolo recriado em SVG inline (mesmo path do mockup), wordmark em Cormorant Garamond + eyebrow "CAPITAL" em Roboto bold tracking largo |

## Camada 2 — Critério de UI/UX e riscos

- **Contraste:** texto branco/translúcido sobre navy — dentro do padrão AAA já validado no Hero. Links em `white/45` (decorativo, não corpo de leitura longa) — aceitável para nav, mesmo padrão do mockup.
- **Sticky + backdrop-blur:** navbar fixa no topo (`sticky top-0 z-50`) com `bg-navy/90 backdrop-blur` para não colidir visualmente com o glow do Hero ao rolar.
- **Mobile:** abaixo de `md`, links de âncora colapsam — nesta primeira versão, mantém apenas logo + CTA visíveis em mobile (sem menu hambúrguer completo, para não introduzir um componente de overlay/drawer sem necessidade real — a LP é curta, uma página, sem necessidade de navegação profunda). Risco documentado: se o cliente pedir mais páginas no futuro, um menu mobile completo vira necessário.
- **Acessibilidade:** `<header>` + `<nav aria-label="Navegação principal">`; links reais (`<a href="#processo">` etc.) apontando para os `id`s das seções; CTA com texto descritivo igual ao do Hero ("Antecipar agora"); `:focus-visible` herdado do `buttonVariants`.
- **Sem dado inventado:** nenhum número/CNPJ/telefone na navbar.
- **Motion (Jakub principal):** sem animação de entrada própria (a navbar já está visível no primeiro frame, animá-la seria decorativo); único movimento é a transição de opacidade/blur do fundo ao rolar, via CSS `transition-colors`, não JS — barato e imperceptível como "animação", que é o objetivo (Emil: "melhor animação é a que não se nota").

## Camada 3 — Componentes

- **shadcn/ui `Button`** (`buttonVariants({ size: "sm" })`) restilizado para o CTA dourado, consistente com o Hero.
- Sem Magic UI aqui — nav não precisa de reveal, está sempre visível.
- Ícone do logo: SVG inline (não é lucide-react, é a marca da Celer).

## Critérios de aceite

- [x] `<header>` sticky, fundo navy com leve transparência/blur
- [x] Logo (símbolo + wordmark) com link para `#top`/topo da página
- [x] Links âncora para `#processo`, `#para-quem`, `#diferenciais` (ids que as seções seguintes vão expor)
- [x] CTA dourado "Antecipar agora" com mesmo placeholder de WhatsApp do Hero (`#whatsapp-pendente`, comentário TODO)
- [x] Mobile: logo + CTA visíveis, links de texto ocultos abaixo de `md` (decisão documentada acima)
- [x] `:focus-visible` funcional em todos os links/botão
- [x] Nenhum dado não confirmado inventado
