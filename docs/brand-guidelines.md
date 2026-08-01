# Brand Guidelines v1.0 — Celer Capital

> Consolidado a partir de: Manual de Marca (PDF oficial), S — Segmentação de Mercado, T — Tagueamento (Persona Rodrigo) e do mockup HTML v3 já validado conceitualmente. Fonte única de verdade para a construção do site.

## ⚠️ Correção de escopo (ler antes de tudo)

O texto institucional do PDF do manual de marca (seção "Apresentação da Empresa") descreve a Celer como **"indústria de investimentos"**, **"instituição financeira"** e **"parceiro de investimentos"**. Isso é boilerplate genérico de template de manual de marca — **não reflete o negócio real** e é exatamente o erro que já ocorreu na v1 do site (ver histórico do projeto).

**O que a Celer realmente é:** uma **securitizadora** sediada em Curitiba, especializada em **antecipação de recebíveis** (duplicatas, cheques pré, notas fiscais a prazo) para PMEs industriais e distribuidoras. Ela **compra o recebível a desconto e entrega capital imediato** — não gerencia investimentos de terceiros, não é assessoria, não existe uma "carteira" que o cliente do Lado 1 acompanha.

Toda vez que este documento (ou qualquer copy) precisar descrever "o que a Celer é", usar a formulação acima — nunca a linguagem de "instituição financeira"/"parceiro de investimentos" do PDF. Cores e o conceito "agilidade + sofisticação clássica" do manual continuam 100% válidos — só a descrição textual do negócio está errada.

## ⚠️ Pivô visual v2 (2026-07-10 — ler antes de implementar UI)

Depois de ver a v1 implementada, o usuário pediu uma correção de rumo visual significativa em relação ao que este documento descrevia originalmente. As seções 3–6 abaixo já foram atualizadas para refletir isso, mas o resumo da mudança:

1. **Logo real substitui o conceito do manual.** O manual oficial (PDF) descrevia duas letras "C" sobrepostas em geometria hexagonal. O cliente forneceu arquivos de logo reais (`3_celerlogo.webp`, `7_celerlogo.webp`) com um design diferente: um ícone oval contendo um gráfico de barras ascendentes (formando um "C" por espaço negativo) + wordmark "celer." / "capital" em minúsculas. **Esse é o logo válido agora** — a descrição da seção 5 foi reescrita para refletir isso. Os arquivos fornecidos só existem na versão branca/clara (funcionam sobre fundo escuro; não existe ainda uma versão navy/dourada para uso sobre fundo claro).
2. **Coolvetica substitui Cormorant Garamond como fonte de display.** É a fonte de marca real do cliente (Adobe Fonts). Arquivo já recebido e integrado (5 cortes: Light/Regular/Bold + itálico normal e bold) — ver seção 4.
3. **Sistema de "cor única de fundo" substitui a alternância Navy→Black→Cream.** O usuário quer o site majoritariamente numa cor clara única (cream), com variação vinda de **cards com tons suaves** (soft tints), não de seções inteiras em cores diferentes — nas referências que inspiraram esse pivô (Clause, Finpay), o padrão é fundo claro dominante + 1-2 seções escuras como pontuação, não alternância seção-a-seção. Hero e CTA Final são os dois "bookends" escuros (navy/ink) mantidos de propósito; todo o resto do site é cream.
4. **Cantos arredondados em tudo.** Botões viraram pill (`rounded-full`), cards `rounded-2xl`/`rounded-3xl`. O antigo padrão "institucional flat" (`rounded-none`) foi abandonado.
5. **Blocos centralizados.** Títulos de seção e containers centralizados na página (Hero virou coluna única centralizada, sem o split assimétrico 55/45 da v1). Parágrafos longos dentro de cards continuam alinhados à esquerda — só os blocos/títulos centralizam, não todo texto corrido.

## ⚠️ Pivô de paleta + conteúdo v3 (2026-07-12 — ler antes de implementar UI)

Nova rodada de correções, desta vez sobre cor e conteúdo (não mais sobre layout/estrutura, que ficou definido no pivô v2 acima):

1. **Paleta trocada pelas cores oficiais reais da identidade Celer.** As cores usadas nos pivôs v1/v2 (#011E2E navy, #996515 gold, #096993 teal, #F7F4EF cream) eram aproximações — o cliente confirmou a paleta institucional real: `#001A4B` (Navy) / `#E2AF0C` (Gold) / `#EFF1F4` (Cream) / `#0B0C0C` (Ink). O token Teal e o token Silver foram **removidos** — não fazem parte da paleta real e não têm mais uso no site. Ver seção 3 (já atualizada) para a tabela completa.
2. **Novo gold é bem mais claro que o antigo** (#E2AF0C vs. #996515) — isso quebrou contraste em dois pontos e exigiu correção: texto branco sobre gold (botões) caiu pra ~2:1, corrigido trocando pra texto navy (~8.3:1); texto gold sobre cream (eyebrows/labels) caiu pra ~1.8:1, corrigido com um novo token só-para-texto, `gold-dark` (#7C6007, ~5.2:1 sobre cream — ver seção 3). Regra: `gold` puro é só para fundo (botões, backgrounds) ou texto sobre fundo escuro; `gold-dark` é para texto sobre fundo claro.
3. **Eyebrows removidos de todas as seções.** O padrão "LABEL PEQUENA EM CAPS + linha dourada" que aparecia acima de cada H2 (Processo, Para Quem, CTA Final) foi removido inteiramente — os H2 agora lideram a seção diretamente, sem rótulo acima.
4. **Seções "Diferenciais" e "Quebra de Objeção" removidas.** Comparavam a Celer com bancos/outras operações ("isso não é empréstimo", "banco vê score, Celer vê nota fiscal") — linguagem educacional/comparativa desnecessária pro público-alvo, que já chega ao site sabendo o que é securitização e já esperando essa diferença. Substituídas por duas seções novas, ambas derivadas do documento de Segmentação de Público do cliente:
   - **Soluções** — catálogo direto dos instrumentos que a Celer antecipa (duplicatas, notas fiscais a prazo, cheques pré-datados, contratos e mensalidades). Sem H2/subtexto visível (só um `h2` `sr-only` pra manter landmark de acessibilidade) — é puramente uma grade de referência rápida.
   - **Atendimento** — foca em atendimento direto e resposta rápida, sem nenhuma comparação com bancos/concorrentes. Reforça que o cliente recebe o crédito quando precisa, não depois de um processo lento.
5. **"Para Quem" reescrita com frases-gancho por segmento.** Os 4 cards agora abrem com uma frase de identificação direta por segmento (indústria/metalurgia, distribuidora/atacado, serviços B2B, restrição bancária) em vez de descrição genérica de "situação". O card de restrição bancária tem destaque visual (borda superior dourada) — maior potencial de conversão segundo a Segmentação.
6. **Pill "Securitizadora" removida da Hero**, e a segunda linha do headline ("não deveria esperar.") passou a usar `gold` (não mais itálico dourado — ver correção na seção 4/tagline abaixo, que também estava desatualizada apontando pra Cormorant Garamond).

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

---

## Quick Reference
- **Primary Color:** #001A4B (Navy) — só Hero e CTA Final; o resto do site é #EFF1F4 (Cream)
- **Secondary Color:** #C68622 (Gold) — uso em fundo/CTA; para texto sobre fundo claro usar `gold-dark` #6D4A13
- **Ink:** #0B0C0C — variação mais densa do bookend escuro (CTA Final)
- **Primary Font (display):** Coolvetica (fonte real do cliente — integrada, ver seção 4)
- **Secondary Font (corpo/UI):** Roboto
- **Voice:** Direta, Sólida, Parceira

---

## 1. Personalidade da Marca

O manual oficial define o conceito como fusão de **agilidade moderna** com **sofisticação clássica** — duas letras "C" sobrepostas simbolizando velocidade de execução *e* parceria colaborativa. Isso é o eixo visual. Mas a persona (Rodrigo, 46, dono de metalúrgica — ver Tagueamento) despreza "financês", desconfia de processo lento e decide por confiança, não por anúncio bonito. A personalidade da Celer precisa resolver essa tensão: **parecer sólida e séria com os olhos, falar direto e sem rodeio com as palavras.**

### Os 5 traços

### Brand Personality
| Traço | Somos | Não somos |
|---|---|---|
| **Ágil, sem ser apressada** | Resposta em horas, processo claro, sem semanas de espera | Afobada, informal a ponto de parecer amadora |
| **Direta, sem ser fria** | Fala o número, o prazo, o "quanto cai na conta" — sem enrolação | Robótica, burocrática, cheia de "prezado(a)" |
| **Sólida, sem ser distante** | Visual navy + dourado transmite estabilidade e peso institucional | Inacessível, hierárquica, difícil de contatar |
| **Parceira, não fornecedora** | Entende sazonalidade do setor, atende antes da crise virar emergência | Transacional, "cliente é só um número" |
| **Justa, sem ser paternalista** | Analisa o recebível, não o CNPJ no Serasa — sem julgar o "nome sujo" | Condescendente com quem tem restrição bancária |

**Por que isso importa na prática:** o Rodrigo (persona central) tem 46 anos, dono de metalúrgica, decide sozinho, foi recusado pelo banco mais de uma vez e desconfia de "produto financeiro que demora para explicar o que é". Ele não é o público de uma gestora de patrimônio. A estética pode (e deve) ser premium — é a oportunidade de diferenciação real, nenhum concorrente (AG Antecipa, Solo, Express) tem esse posicionamento visual. Mas o texto sempre resolve em concreto: número, prazo, "sim ou não", sem jargão.

---

## 2. Voz e Tom

### Como soamos
- **Concreto, não abstrato.** "Em até [X horas/dias úteis]" em vez de "processo ágil". "Antecipe [X]% do recebível" em vez de "condições vantajosas".
- **Sem financês.** Nunca usar "instituição financeira", "parceiro de investimentos", "carteira", "portfólio de soluções". O Rodrigo pensa em "dinheiro que já é meu, só não chegou ainda" — não em produtos financeiros.
- **Primeira pergunta do cliente, respondida primeiro.** Segundo o Tagueamento, a primeira coisa que o público com restrição bancária pergunta é "vocês aprovam para empresa com score ruim?". A comunicação deve antecipar essa dúvida, não escondê-la atrás de institucionalidade.
- **Sem promessa que o atendimento não confirma.** O caso do @fabiovannuchi (comentário público reclamando de um concorrente) é o alerta: gerar expectativa que a operação não sustenta vira reputação negativa. Nunca prometer número não confirmado pelo cliente.

### Tom por contexto

| Contexto | Tom | Exemplo |
|---|---|---|
| Hero / headline | Confiante, direto, uma frase que carrega posse | "O capital que já é seu não deveria esperar." |
| Explicação de processo | Didático, sequencial, sem jargão | "Você vende a prazo. A Celer analisa os recebíveis — não o seu histórico bancário." |
| Quebra de objeção (não é empréstimo) | Direto, comparativo | "Isso não é dívida. É receber hoje o que já é seu por direito." |
| CTA / WhatsApp | Convite de baixo atrito, sem formulário | "Manda uma mensagem. Sem compromisso, resposta rápida." |
| Dado não confirmado | Nunca inventar — usar placeholder explícito | `[prazo de aprovação — confirmar com cliente]` |

### Prohibited Terms (Termos proibidos)
- "instituição financeira" (linguagem genérica do PDF — não reflete o modelo de securitizadora, ver correção de escopo acima)
- "assessoria de investimentos" (Celer não gerencia investimentos de terceiros)
- "parceiro de investimentos" (mesma razão)
- "Celer significa veloz em latim" (testado e removido — sem impacto para o visitante)
- "score ruim"/"nome sujo" como acusação direta ao cliente (sempre framed como limitação do banco — "A Celer analisa o recebível, não o seu CNPJ na Serasa")

### Teste rápido antes de publicar copy
1. O Rodrigo entenderia isso sem precisar reler? (Nada de financês)
2. Tem número ou é vago? Se for vago, é genérico — reescrever.
3. Um concorrente (AG Antecipa, Solo, Express) poderia dizer a mesma frase? Se sim, não está diferenciado o suficiente.
4. Isso é uma promessa que o time comercial confirma na prática?

---

## 3. Paleta de Cores

Paleta institucional real da Celer (confirmada com o cliente no pivô v3, 2026-07-12) — **não gerar tons/variações fora desta lista**, é regra explícita do manual ("não usar a logo em outra cor ou forma que não seja uma das exemplificadas").

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Navy | #001A4B | rgb(0,26,75) | Um dos dois "bookends" escuros (Hero) — ver "Sistema de fundo único" abaixo |
| Navy Bright | #003599 | rgb(0,53,153) | Ponta clara do gradiente da Hero e dos painéis de Valores. Entrou por pedido do cliente em 2026-07-31, fora da paleta original — não é uma variação gerada |
| Ink | #0B0C0C | rgb(11,12,12) | O outro bookend escuro (CTA Final) — mais denso que o navy |

### Secondary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Gold | #C68622 | rgb(198,134,34) | Cor de destaque — CTAs, backgrounds, dividers. Uso deliberadamente escasso (5–10% da superfície): é o que carrega "premium". **Não usar como cor de texto sobre fundo claro** (ver `gold-dark` abaixo e nota de acessibilidade) |
| Gold Light | #E1A951 | rgb(225,169,81) | Tom claro do gold — hover de botões (`hover:bg-gold-light`) |
| Gold Dark | #6D4A13 | rgb(109,74,19) | **Variante só-para-texto**, mesma matiz do Gold mas escurecida para passar em contraste AA (7,0:1, e AAA para texto grande) sobre o fundo Cream. Usar em qualquer lugar que antes usaria `text-gold` sobre fundo claro: eyebrows/labels (quando existirem), ícones de destaque em cards, tagline do footer |

### Neutral Palette
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| White | #FFFFFF | rgb(255,255,255) | Texto sobre fundo escuro, fundo de seções claras |
| Cream | #EFF1F4 | rgb(239,241,244) | **Fundo único e dominante do site** (pivô v2) — todas as seções exceto Hero e CTA Final |

### Cor funcional (exceção documentada)
| Name | Hex | Usage |
|------|-----|-------|
| WhatsApp Green | #1DA851 | **Única cor fora da paleta institucional aprovada para uso.** Reservada exclusivamente ao botão de CTA final "Falar pelo WhatsApp" — o reconhecimento de marca do WhatsApp supera a consistência de paleta nesse ponto único de conversão. Não usar em mais nenhum outro contexto. |

### Regra de proporção (pivô v2/v3)
- Cream: ~80–85% da superfície do site inteiro (dominante — todas as seções exceto os dois bookends)
- Navy + Ink (Hero + CTA Final): os únicos dois momentos escuros da página inteira — não alternar seção a seção como na v1
- Gold: ~5–8% (destaque — CTAs, backgrounds), consistente nos dois modos (claro e escuro); `gold-dark` para texto, nunca `gold` puro como cor de texto sobre Cream
- Cards sobre o fundo cream usam **tons suaves** (soft tints) em vez de branco+borda — desde 2026-07-31 como gradientes diagonais, não mais tom plano (ver seção 6, "Sistema de gradientes"): `from-navy/[0.07] to-navy/[0.015]` e `from-gold/[0.16] to-gold/[0.05]` — nunca a cor sólida cheia num card inteiro (isso é reservado para os CTAs)
- WhatsApp Green: 1 elemento por página (o CTA final)

### Acessibilidade
- Texto branco sobre Navy (#001A4B): contraste 16,8:1 — AAA
- Texto navy sobre Gold (#C68622) — usado em botões: contraste 5,5:1 — AA. **Atenção:** com o dourado antigo (#E2AF0C) esse par passava em AAA (~8,3:1); com o dourado real, cai para AA. **Não usar texto branco sobre gold** (3,1:1, reprova)
- Gold Dark (#6D4A13) sobre Cream (#EFF1F4): contraste 7,0:1 — AA para texto normal (e AAA para texto grande)
- Gold (#C68622) sobre Cream: contraste 2,7:1 — **falha, nunca usar `text-gold` diretamente sobre fundo claro**, sempre `text-gold-dark`
- Navy sobre Cream (#EFF1F4): contraste 14,9:1 — AAA
- **Cuidado com opacidade de navy sobre cream para texto de corpo:** `text-navy` abaixo de ~65% de opacidade cai abaixo de 4.5:1 (AA) sobre o fundo cream — testado e corrigido várias vezes durante a implementação (`text-navy/50` ≈ 3.3:1, insuficiente; `text-navy/70` ≈ 6.2:1, seguro). Usar `/65` a `/70` como piso para texto de corpo secundário sobre cream, nunca menos.
- **Piso de opacidade para texto branco sobre o gradiente escuro:** `/70`. O gradiente da Hero termina em #003599, bem mais claro que o navy — `text-white/50` dá 5,0:1 sobre #001A4B mas cai para 3,7:1 sobre #003599, reprovando AA. Medido e corrigido em 2026-07-31.

---

## 4. Tipografia

### Fontes oficiais vs. fontes de implementação

**Histórico:** o manual de marca (PDF) especifica **Distrampler** (clássica, serifada) como tipografia de destaque. Isso foi substituído por **Cormorant Garamond** na v1 (Google Font, licença aberta), e depois **substituído de novo por Coolvetica na v2 (2026-07-10)** — Coolvetica é a fonte de marca real usada pelo cliente (ativa no Adobe Creative Cloud dele), não Distrampler nem Cormorant Garamond.

**Estado da implementação (atualizado 2026-07-10):** o cliente enviou a família completa da Coolvetica (34 arquivos OTF). Só os 5 cortes realmente usados foram convertidos pra WOFF2 (via `fonttools`) e integrados em `web/public/fonts/` — família "Rg"/Regular, não as variantes Condensed/Compressed/Crammed/Heavy/UltraLight, que não têm uso no site:

| Peso/estilo | Arquivo fonte | Arquivo web |
|---|---|---|
| Light (300) | `Coolvetica-Light-Regular.otf` | `coolvetica-light.woff2` |
| Regular (400) | `Coolvetica-Regular.otf` | `coolvetica-regular.woff2` |
| Regular Italic (400i) | `Coolvetica-Italic.otf` | `coolvetica-italic.woff2` |
| Bold (700) | `Coolvetica-Bold.otf` | `coolvetica-bold.woff2` |
| Bold Italic (700i) | `Coolvetica-Bold-Italic.otf` | `coolvetica-bold-italic.woff2` |

**Regra importante:** nunca usar `font-semibold` (600) na fonte de display — não existe um corte 600 real, e o navegador teria que *sintetizar* um bold falso a partir do 400, o que fica visivelmente ruim numa fonte com personalidade forte como a Coolvetica. Use sempre `font-bold` (700, corte real) para ênfase forte, ou `font-light` (300) para o tratamento "stat/valor em destaque".

```css
--font-display: 'Coolvetica', 'Arial Narrow', sans-serif; /* headlines, valores em destaque */
--font-body: 'Roboto', system-ui, sans-serif;              /* corpo, UI, navegação, labels — inalterado */
```

Roboto continua carregado via `next/font/google` (auto-hospedado pelo Next.js, sem `<link>` manual). Os dois cortes acima da dobra (Regular + Bold) têm `<link rel="preload">` no `<head>` (`web/src/app/layout.tsx`), já que aparecem no Hero em toda visita.

### Escala tipográfica

| Elemento | Fonte | Peso | Tamanho (Desktop/Mobile) | Line Height | Tracking |
|---|---|---|---|---|---|
| Hero H1 | Coolvetica | **700** (não 600 — sem corte real) | 56px / 34px | 1.05 | -0.5px |
| H2 (seção) | Coolvetica | **700** | 28–36px / 26px | 1.2 | 0 |
| H3 (card/item) | Roboto | 700 | 15–16px / 15px | 1.3 | 0.2px |
| Eyebrow / tag | Roboto | 700 | 9–10px | 1 | 3px, uppercase |
| Body | Roboto | 300–400 | 14–16px / 14px | 1.7–1.8 | 0 |
| Small / caption | Roboto | 400 | 10–12px | 1.5 | 0.5px |
| Stat / valor em destaque | Coolvetica | 300 | 40–56px | 1 | 0 |
| Botão / CTA | Roboto | 700 | 10–11px | 1 | 1–1.5px, uppercase |

### Uso do itálico
Itálico dourado no display (dentro do H1) marca a palavra de maior carga emocional da headline — convenção já estabelecida ("não deveria *esperar*"). Usar com moderação: no máximo 1 palavra/expressão em itálico por headline. Usa o corte itálico real (`coolvetica-bold-italic.woff2`), nunca um itálico sintético/inclinado via CSS.

### Regras
- Nunca usar a fonte de display abaixo de 20px (perde o impacto em tamanhos pequenos)
- Nunca usar `font-semibold`/600 na fonte de display — só existem cortes 300/400/700, `font-bold` é o corte real pra ênfase forte
- Corpo de texto sempre em Roboto, nunca na fonte de display — legibilidade prática para o público que "não para para ler texto longo" (Tagueamento)

---

## 5. Logo

### Conceito (atualizado v2 — logo real do cliente)
O manual oficial (PDF) descrevia duas letras "C" sobrepostas em geometria isométrica/hexagonal — esse conceito **não é o logo usado na prática**. O logo real, fornecido pelo cliente (`3_celerlogo.webp` horizontal, `7_celerlogo.webp` vertical), é: um ícone oval contendo um gráfico de barras ascendentes (as barras formam o corte que lê como "C" por espaço negativo dentro do oval) + wordmark "celer." (fonte leve/script-like) sobre "capital" (bold) em minúsculas, sem versalete.

Assets recortados e prontos em `web/public/logo/`:
- `celer-icon.png` — só o ícone (oval + barras), usado compacto (navbar compilada, favicon)
- `celer-horizontal.png` — ícone + wordmark lado a lado, usado na navbar expandida
- `celer-vertical.png` — ícone em cima, wordmark embaixo (empilhado) — ainda sem uso definido no site, disponível para materiais futuros

### Variantes de cor — limitação atual
Os arquivos fornecidos **só existem na versão branca/clara** (confirmado: os pixels do ícone/wordmark são ~quase-brancos com canal alpha, ficam invisíveis num fundo claro e só aparecem legíveis sobre fundo escuro). **Não existe ainda uma versão navy/dourada** do logo para uso sobre fundo claro. Isso é o motivo pelo qual o Hero e a navbar transparente inicial permanecem em fundo escuro (navy) — é onde essa logo funciona. Se o site precisar do logo sobre fundo claro em algum ponto futuro, é necessário pedir ao cliente uma versão colorida (navy ou gold) do mesmo arquivo.

### Regras de uso
- **Nunca** recolorir a logo livremente — se precisar de uma versão em outra cor, pedir ao cliente o arquivo, não improvisar via filtro/CSS
- **Nunca** aplicar gradiente, sombra ou contorno à marca
- **Nunca** esticar, comprimir ou rotacionar
- **Nunca** sobrepor a fundos com muita informação visual sem uma área de proteção sólida
- Tamanho mínimo digital: ~120px de largura para o lockup horizontal completo; 32px para o ícone isolado (navbar compilada, favicon)

### Tagline
**"Conectando Valor, Crescendo Juntos"** — uso institucional (footer, apresentações, materiais de marca). Não é headline de conversão — é assinatura de marca, não argumento de venda. Manter em itálico, cor `gold-dark` (não `gold` puro — está sobre o fundo claro do footer, ver acessibilidade na seção 3), sempre entre aspas quando usada como assinatura.

---

## 6. Componentes de UI

Biblioteca de padrões já validada no mockup v3 — base para os componentes do site final. Cada seção nova do site (além das 6 do mockup) deve reaproveitar estes padrões antes de inventar um novo.

### Botões — todos pill (`rounded-full`), pivô v2
| Variante | Uso | Estilo |
|---|---|---|
| Primário (gold) | CTA principal (hero, navbar, CTA final secundário) | `rounded-full`, fundo Gold sólido, texto branco, uppercase |
| Outline | CTA secundário/terciário, Login | `rounded-full`, borda translúcida, sem fundo |
| WhatsApp | CTA de conversão final | `rounded-full`, fundo verde WhatsApp — único uso aprovado dessa cor |

### Sistema de fundo único + bookends escuros (substitui a "alternância" da v1)
O site inteiro usa **Cream como fundo único**, exceto dois momentos deliberadamente escuros (navy/ink): o **Hero** (abertura) e o **CTA Final** (fechamento) — como parênteses ao redor do conteúdo claro. Isso substitui o padrão v1 de alternar Navy→Black→Cream seção a seção. Novas seções: usar Cream, nunca inventar uma terceira cor de fundo de seção inteira.

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

### Cards com tons suaves (soft tints) — substitui "cards brancos com borda colorida"
Variação de conteúdo dentro do fundo cream vem de **cards com tons suaves da paleta**, não de bordas coloridas sobre branco — desde 2026-07-31, como gradientes diagonais (`bg-linear-to-br`, ver "Sistema de gradientes" acima): `from-navy/[0.07] to-navy/[0.015]` e `from-gold/[0.16] to-gold/[0.05]`. Cantos sempre arredondados (`rounded-2xl` a `rounded-3xl`, nunca `rounded-none`). Um card pode ganhar destaque pontual com `border-t-4 border-gold` (ex: o card de restrição bancária em "Para Quem", maior potencial de conversão) — mas isso é exceção pontual, não o padrão de todos os cards.

### Timeline numerada
Linha vertical conectando dots numerados, progressão de cor gold → navy → navy claro — comunica visualmente "início urgente, chegada tranquila". Reaproveitar para qualquer sequência de processo/etapas no site. Cores dos dots: `border-gold bg-gold/10 text-gold-dark` (início) até `border-navy/15 bg-navy/5 text-navy/35` (final, mais apagado).

### Grid de cards (2×2 ou 2×N)
Cards com tom suave de fundo (não branco+borda), número fantasma grande no canto em opacidade baixa. Padrão usado em "Para Quem" (frases-gancho por segmento) e "Soluções" (catálogo de instrumentos antecipáveis).

### Sem eyebrows, sem linguagem comparativa
Nenhuma seção usa mais o padrão "LABEL EM CAPS + linha dourada" acima do H2 (removido no pivô v3) — o H2 lidera a seção diretamente. Nenhuma seção compara a Celer com bancos ou concorrentes ponto a ponto (a antiga "Tabela comparativa" foi removida junto com "Quebra de Objeção") — o público-alvo já entende a categoria; o foco é em atendimento e nos casos de uso reais do cliente, não em desmontar objeções que ele não tem.

### Blocos centralizados
Títulos de seção e containers centralizados na página (`mx-auto text-center` no bloco de intro de cada seção). Parágrafos longos dentro de cards continuam alinhados à esquerda dentro do próprio card — só o bloco como um todo centraliza, não cada linha de texto corrido. Exceção deliberada: a seção "Soluções" não tem H2/subtexto visível (só um `h2` `sr-only`), então não há bloco de intro pra centralizar — só a grade de cards. Segunda exceção (2026-07-31): a seção "Sobre" tem título alinhado à esquerda, em duas colunas — pedido explícito do cliente, ver bloco de pivô no topo do documento.

---

## 7. Consistência — Checklist antes de publicar

### Visual
- [ ] Logo só na versão fornecida (branca), só sobre fundo escuro (Hero/CTA Final) — nunca recolorida via CSS
- [ ] Nenhuma cor fora da paleta institucional (exceto o verde do botão WhatsApp): `navy` `#001A4B`, `navy-bright` `#003599`, `gold` `#C68622`, `cream` `#EFF1F4`, `ink` `#0B0C0C`
- [ ] `text-gold` nunca usado como cor de texto sobre fundo claro — usar `text-gold-dark` (texto sobre fundo escuro pode usar `text-gold` normalmente)
- [ ] Fonte de display só em ≥20px, nunca para corpo de texto
- [ ] Fundo claro em todas as seções, exceto os dois bookends escuros (Hero, CTA Final) — com o wash de gradiente da seção 6, e a direção alternando em relação às seções vizinhas
- [ ] Cantos arredondados em botões (pill) e cards (`rounded-2xl`+) — nunca `rounded-none`
- [ ] Nenhuma seção com eyebrow (label caps + linha dourada acima do H2) — removido no pivô v3
- [ ] Blocos/títulos de seção centralizados; parágrafos longos dentro de cards continuam à esquerda. Exceção única: a seção "Sobre", em duas colunas com título à esquerda (pedido do cliente, 2026-07-31)
- [ ] Texto navy sobre cream em pelo menos 65% de opacidade (corpo de texto) — abaixo disso cai fora do AA
- [ ] Texto branco sobre o gradiente escuro em pelo menos 70% de opacidade — abaixo disso reprova AA na ponta clara (#003599)
- [ ] Dourado usado com escassez (5–8% da superfície) — se está em toda parte, perdeu o efeito de destaque

### Copy
- [ ] Nenhum número, prazo ou processo sem confirmação do cliente (usar placeholder explícito, nunca inventar)
- [ ] Nenhuma menção a "instituição financeira", "assessoria de investimentos" ou "parceiro de investimentos"
- [ ] Nenhuma referência ao latim ("Celer = veloz") — testado e descartado
- [ ] Linguagem testável pelo "teste do Rodrigo" (seção 2): concreto, sem financês, diferenciado, sustentável na prática
- [ ] "Nome sujo"/restrição bancária tratado com respeito — nunca como acusação ao cliente

### Estrutural
- [ ] CTA final sempre aponta para WhatsApp (`api.whatsapp.com/send?phone=...&text=...`), nunca formulário
- [ ] Nenhuma seção explicando "o que é securitização" — o visitante já chega sabendo que precisa do serviço
- [ ] Placeholders de dado pendente marcados de forma visível no código (`[confirmar com cliente]`), nunca silenciosamente substituídos por número plausível

---

## Extractable Fields
- `colors.primary` = Navy #001A4B (bookends only) · `colors.primaryBright` = Navy Bright #003599 (gradient endpoint, Hero + Valores) · `colors.background` = Cream #EFF1F4 (site-wide default) · `colors.secondary` = Gold #C68622 (backgrounds) · `colors.secondaryText` = Gold Dark #6D4A13 (text on light bg) · `colors.ink` = #0B0C0C
- `typography.heading` = Coolvetica (integrada — Light/Regular/Bold + itálico, `font-bold` não `font-semibold`) · `typography.body` = Roboto
- `voice.traits` = Ágil sem apressada, Direta sem fria, Sólida sem distante, Parceira não fornecedora, Justa não paternalista
- `voice.prohibited` = instituição financeira, assessoria de investimentos, parceiro de investimentos, referência ao latim
- `logo.variants` = só branco/claro disponível, uso restrito a fundo escuro (Hero, CTA Final)
- `logo.minSize` = ~120px (lockup horizontal) / 32px (ícone)
- `layout.radius` = pill (botões) / rounded-2xl–3xl (cards) — nunca rounded-none
- `layout.background` = cream dominante com wash de gradiente sutil (branco↔cream, alternando por seção), bookends escuros em gradiente só em Hero e CTA Final
