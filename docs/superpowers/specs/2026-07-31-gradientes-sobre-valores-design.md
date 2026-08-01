# Gradientes + seções Sobre e Valores — Celer Capital LP

**Data:** 2026-07-31 · **Status:** Design aprovado pelo usuário, pronto para plano de implementação.

## Contexto

O cliente viu o site implementado e trouxe quatro pedidos numa rodada só:

1. As cores estão sólidas demais no site inteiro — explorar gradientes leves.
2. A Hero ganha um gradiente horizontal, do navy atual até `#003599`.
3. Nova seção "Sobre", em duas colunas: texto à esquerda, caixas de Missão e Visão à direita.
4. Nova seção "Valores" logo abaixo da Sobre, construída sobre um componente de acordeão interativo fornecido pelo cliente.

Os textos institucionais (tagline, Missão, Visão, os 6 valores) vieram prontos do cliente e estão reproduzidos na íntegra abaixo.

## Decisões tomadas com o usuário

- **Painéis dos Valores usam gradiente + ícone, não foto.** O componente de referência é um acordeão de imagens, mas o projeto não tem banco de imagens (só as logos). Descartadas as fotos de stock do Unsplash: o manual aponta o visual premium como o diferencial real da Celer frente aos concorrentes (AG Antecipa, Solo, Express), e stock genérico trabalha contra isso. A estrutura fica pronta para trocar por fotos reais se o cliente fornecer.
- **Escopo dos gradientes:** fundos de seção + tints de card + os dois bookends escuros. Descartada a opção mais expressiva (glows dourados difusos, transições de cor entre seções) porque o manual limita o dourado a 5–8% da superfície justamente para não perder o efeito de destaque.
- **Posição:** as duas seções entram depois de "Para Quem".
- **Navbar:** ganha link só para "Sobre". Valores fica como continuação visual, sem link próprio — a navbar no estado pill já fica apertada com 5 links.
- **Valores sem coluna de texto à esquerda.** O componente de referência tem um bloco de headline+parágrafo+CTA à esquerda, mas o cliente não forneceu copy para ele. Em vez de inventar texto institucional, o acordeão vai em largura cheia com o H2 centralizado acima — que também é o padrão do resto do site.

## Ordem final da página

```
Hero → Processo → Para Quem → Sobre → Valores → Soluções → Atendimento → CTA Final → Footer
```

---

## 1. Sistema de gradientes

### Token novo

`#003599` entra como token de primeira classe em `globals.css`, dentro do bloco `@theme`:

```css
--color-navy-bright: #003599;
```

Motivo de ser token e não hex solto: o valor é usado na Hero, no CTA Final e nos 6 painéis de Valores. Espalhar o hex por cinco arquivos é como a paleta antiga acumulou tons "inventados" que o pivô v3 teve que caçar e remover.

**Nota de conformidade:** `#003599` não estava na paleta institucional (Navy `#001A4B`, Gold `#C68622`, Cream `#EFF1F4`, Ink `#0B0C0C`), e o manual diz explicitamente "não gerar tons/variações fora desta lista". A cor foi pedida pelo cliente, então é decisão dele — mas o manual precisa ser atualizado junto (ver seção 5), não silenciosamente contrariado.

### Bookends escuros

| Seção | Gradiente |
|---|---|
| Hero | `linear-gradient(90deg, #001A4B 0%, #003599 100%)` |
| CTA Final | `linear-gradient(90deg, #0B0C0C 0%, #001A4B 100%)` |

Os dois fazem o mesmo movimento horizontal, o CTA Final uma oitava mais escura — as duas pontas da página rimam sem ficarem idênticas.

Os glows radiais dourados que já existem nas duas seções (`rgba(198,134,34,0.12)` na Hero, `0.09` no CTA Final) permanecem, sobrepostos ao gradiente.

### Seções claras

Wash sutil entre Cream (`#EFF1F4`) e branco. A direção alterna a cada seção para que a cor do fim de uma seção seja a mesma do início da próxima — a emenda fica invisível e o scroll lê como uma superfície contínua, não como faixas.

| Seção | Topo → Base |
|---|---|
| Processo | branco → cream |
| Para Quem | cream → branco |
| Sobre | branco → cream |
| Valores | cream → branco |
| Soluções | branco → cream |
| Atendimento | cream → branco |

A emenda Hero→Processo (navy → branco) continua sendo um corte duro de propósito: é a fronteira do bookend.

### Cards

Os tints planos viram gradientes diagonais (`to-br`), mantendo os mesmos valores de referência como ponto de partida mais claro:

| Onde | Antes | Depois |
|---|---|---|
| Cards navy (Para Quem 01/02) | `bg-navy/[0.05]`, `bg-navy/[0.06]` | `from-navy/[0.07] to-navy/[0.015]` |
| Card gold (Para Quem 03) | `bg-gold/[0.12]` | `from-gold/[0.16] to-gold/[0.05]` |
| Nós de Soluções | `bg-white` | `from-white to-cream` |

O card 03 mantém o `border-t-4 border-gold` — o destaque de conversão não muda.

---

## 2. Hero

### Componente novo: `web/src/components/ui/gradient-background.tsx`

Camada de fundo reutilizável, posicionada em `components/ui/` conforme o pedido. Adaptações em relação ao snippet fornecido:

- **`useState`/`count` removidos** — o snippet declarava um contador que nunca era lido nem renderizado.
- **Wrapper `min-h-screen w-full` removido** — a Hero já controla a própria altura (`min-h-[92vh]`). Um wrapper de altura própria brigaria com ela.
- **Props tipadas** — recebe o gradiente via prop, para servir Hero, CTA Final e os painéis de Valores.
- **Sem `"use client"`** — sem estado, funciona como Server Component.
- **Radial → linear horizontal** com as cores da marca, conforme o pedido.

### Correção de contraste (obrigatória, não opcional)

`#003599` é bem mais claro que `#001A4B`, então todo texto translúcido da Hero perde contraste na ponta direita do gradiente. Medido:

| Elemento | Opacidade atual | Sobre `#001A4B` | Sobre `#003599` | Ação |
|---|---|---|---|---|
| Parágrafo do Hero | `text-white/50` | 5,0:1 (AA) | **3,7:1 (reprova)** | subir para `/70` → 6,0:1 |
| Botão "Ver como funciona" | `text-white/60` | ~6,3:1 | 4,7:1 (passa raspando) | subir para `/70` |

O parágrafo em `/50` reprova o AA de verdade na metade direita da Hero — não é margem teórica. O botão passa, mas 4,7:1 em texto de 10px uppercase é apertado demais para deixar assim.

Isso segue a regra que o manual já registra para o lado claro ("`text-navy` abaixo de ~65% cai fora do AA sobre cream"), agora com o equivalente para o lado escuro.

---

## 3. Seção Sobre

**Arquivo:** `web/src/components/sobre.tsx` · **`id`:** `sobre`

### Layout

Duas colunas no desktop (`lg:grid-cols-2`), empilhado no mobile. Container `max-w-5xl`, alinhado com "Para Quem".

**Coluna esquerda** (texto, alinhado à esquerda):
- `<h2>` "Sobre nós" — `font-heading`, mesma escala dos outros H2 do site
- Linha de destaque: *"Com celeridade e compromisso, abrimos portas e impulsionamos negócios."*
- Parágrafo: *"Sua empresa não precisa esperar 30, 60 ou 90 dias para receber pelas vendas já realizadas. Com a Celer, suas vendas a prazo se transformam em capital imediato para impulsionar o seu negócio."*

**Coluna direita** — duas caixas `rounded-3xl` empilhadas, com os gradientes suaves do sistema:

| Caixa | Título | Texto |
|---|---|---|
| Superior | Missão | "Impulsionar empresas por meio da antecipação de recebíveis e de soluções financeiras inteligentes, oferecendo agilidade, segurança e compromisso para fortalecer negócios, gerar oportunidades e construir parcerias duradouras." |
| Inferior | Visão | "Ser a principal parceira financeira das empresas brasileiras, sendo referência em antecipação de recebíveis e reconhecida pela confiança, agilidade e excelência, ampliando nossa atuação com soluções financeiras estratégicas que impulsionem o crescimento sustentável de nossos clientes." |

Missão usa o tint navy, Visão o tint gold — a mesma dupla de tints já usada em "Para Quem", para a seção não introduzir vocabulário visual novo.

### Duas exceções deliberadas ao manual

Ambas são pedido direto do cliente e vão documentadas no manual, não contrariadas em silêncio:

1. **"Blocos/títulos de seção centralizados"** — esta seção é explicitamente left/right. É a primeira seção do site com título alinhado à esquerda.
2. **"Nenhuma seção explicando o que é securitização/antecipação"** — o parágrafo do cliente explica brevemente o mecanismo (30/60/90 dias → capital imediato). O manual removeu esse tipo de texto no pivô v3 sob o argumento de que o visitante já chega sabendo.

---

## 4. Seção Valores

**Arquivos:** `web/src/components/valores.tsx` + `web/src/components/ui/interactive-accordion.tsx` · **`id`:** `valores`

O componente vai para `components/ui/` conforme o pedido. Nome mudado de `interactive-image-accordion` para `interactive-accordion` — não há imagem nenhuma na nossa versão, e o nome original seria enganoso para quem abrir o arquivo depois.

### Layout

H2 "Nossos valores" centralizado acima, acordeão em largura cheia abaixo (`max-w-5xl`). A coluna de texto à esquerda do componente de referência foi removida por decisão do usuário — não havia copy para ela.

### Os 6 valores

| # | Valor | Descrição | Ícone lucide |
|---|---|---|---|
| 1 | Celeridade | Agilidade com responsabilidade em cada solução. | `Zap` |
| 2 | Confiança | Transparência, ética e credibilidade em todas as relações. | `ShieldCheck` |
| 3 | Compromisso | Dedicação para superar expectativas e gerar resultados. | `Target` |
| 4 | Parceria | Construímos relações sólidas que impulsionam resultados. | `Handshake` |
| 5 | Crescimento | Evoluímos junto com nossos clientes e parceiros. | `TrendingUp` |
| 6 | Excelência | Qualidade e melhoria contínua em tudo o que fazemos. | `Award` |

`Compromisso` recebeu `Target` em vez de um segundo ícone de aperto de mão, para não colidir visualmente com `Parceria`.

**Verificar na implementação:** o projeto usa `lucide-react` ^1.24.0, um major recente. Confirmar que os 6 nomes de ícone existem nessa versão antes de assumir — nomes mudaram entre majors do lucide.

### Painéis

Cada painel usa o gradiente navy → `#003599`, com o ângulo variando por índice para a fileira ler como família sem virar seis cópias idênticas. Nome do valor sempre visível; a descrição aparece só no painel ativo.

Painéis escuros sobre fundo claro são cards, não fundo de seção — a regra dos "dois únicos momentos escuros" do manual continua valendo, porque a seção em si permanece no wash claro.

### Quatro correções obrigatórias no componente de referência

O componente fornecido não funciona como está neste projeto:

1. **Largura fixa não cabe.** O original usa `w-[400px]` ativo + `w-[60px]` inativo. Com 6 itens isso exige 700px mínimo, e o original ainda coloca tudo dentro de uma coluna `md:w-1/2`. Solução: `flex-[3]` no ativo e `flex-[1]` nos inativos, preenchendo o container de forma fluida em qualquer largura. Proporção exata a ajustar visualmente na implementação.
2. **Mobile quebra.** O original mantém `flex-row` com `overflow-x-auto` em todas as telas — scroll horizontal com texto rotacionado 90° é ruim no celular. Solução: abaixo de `md`, renderizar uma grade de 6 cards compactos (ícone + nome + descrição, tudo visível); o acordeão existe só de `md` para cima.
3. **Inacessível por teclado.** O original é hover-only num `<div>` sem semântica. Solução: cada painel vira `<button type="button">` reagindo a `onMouseEnter` **e** `onFocus`, de modo que Tab percorra os valores e o painel focado expanda.
4. **Props sem tipo.** `({ item, isActive, onMouseEnter })` sem anotação quebra o `tsc` em modo strict, que hoje está limpo. Solução: interface tipada.

Também removidos do original: o `onError` de fallback de imagem (não há `<img>`) e o `useState` de índice inicial fixo em `4` (passa a ser `0`, o primeiro valor).

O texto rotacionado a 90° nos painéis inativos — assinatura visual do componente — é mantido no acordeão desktop.

---

## 5. Navbar

`NAV_LINKS` em `web/src/components/navbar.tsx` ganha uma quarta entrada, `{ href: "#sobre", label: "Sobre" }`, entre "Para quem" e "Soluções" — a ordem dos links passa a espelhar a ordem real das seções na página.

Valores não recebe link, por decisão do usuário: os links só aparecem de `md` para cima e o estado pill (`max-w-3xl`) já fica apertado com quatro.

---

## 6. Atualização do manual de marca

`docs/brand-guidelines.md` recebe:

- Token `#003599` (`navy-bright`) na tabela de paleta, com a nota de que veio do cliente nesta rodada
- Seção nova descrevendo o sistema de gradientes (bookends, wash alternado, tints de card)
- Piso de opacidade para texto branco sobre o gradiente escuro (`/70`), espelhando a regra que já existe para navy sobre cream
- As duas exceções da seção Sobre (título à esquerda; explicação da antecipação), registradas como decisão do cliente
- **Correção de defasagem:** o documento ainda descreve o dourado como `#E2AF0C` e `gold-dark` como `#7C6007`, mas o código usa `#C68622` e `#6D4A13` desde o commit `6210a82`. Os números do manual (contrastes, tabelas) precisam ser recalculados para os valores reais.

---

## Verificação

- `tsc --noEmit` e `eslint .` limpos
- `npm run build` sem erros
- Contraste conferido nos pontos de risco: texto branco translúcido em toda a extensão do gradiente da Hero (não só na ponta escura), texto sobre os painéis de Valores, texto navy sobre o wash claro nos dois extremos (branco e cream)
- Navegador em 1440px e 375px: as duas seções novas, o acordeão nos dois modos (desktop e a grade mobile), e a navegação por Tab no acordeão
- Âncora `#sobre` da navbar rolando para a seção certa

**Limitação conhecida do ambiente:** neste harness o painel do navegador não compõe frames, então `IntersectionObserver` e eventos nativos de scroll não disparam — as animações de `Reveal` e o estado pill da navbar não podem ser verificados visualmente aqui (confirmado na sessão de 2026-07-31). A lógica é verificável por inspeção do DOM; o efeito visual precisa de conferência num navegador normal.

## Pendências para o cliente

- Fotos reais para os painéis de Valores, se quiser trocar os gradientes por imagem
- Confirmar se a URL de login (`https://digital.celercapital.com.br/#/authentication/login`) é definitiva — pendência herdada, ainda aberta
- Confirmar se a cobrança do devedor no vencimento é feita pela Celer — pendência herdada, marcada em `processo.tsx`
