# Escala tipográfica e larguras de container

**Data:** 2026-08-02 · **Status:** Design aprovado pelo usuário, pronto para plano de implementação.

## Contexto

O cliente reclamou que os elementos do site estão pequenos, deixando espaço vazio, e enviou seis referências (One7 Partner, One7 Mais Crédito, One7 Grupo — três capturas de celular e três de desktop). A reclamação é majoritariamente sobre desktop.

## Diagnóstico

Medido no site em execução, viewport de 1265px, antes de qualquer mudança:

| Elemento | Tamanho atual |
|---|---|
| H1 da Hero | 56px |
| Tagline | 72px |
| H2 de seção | 36px |
| H3 de card | 16px |
| Corpo de texto | 14px |
| Botão / CTA | 11px |
| Numeral (Números) | 48px |

**O problema não é que tudo está pequeno: a escala é bimodal.** Existem dois ou três elementos muito grandes e todo o resto comprimido entre 11 e 16px. Entre 20px e 36px não há nada. Como corpo de texto e título de card são a maior parte da superfície da página, e ambos vivem na faixa de 14-16px, a leitura geral é "está tudo pequeno".

O caso mais grave: **o H3 de card tem 16px e o corpo tem 14px.** Dois pixels de diferença não estabelecem hierarquia, então os cards leem como um bloco cinza uniforme.

Multiplicar tudo por um fator preservaria essa escala bimodal, só que maior. O que precisa acontecer é **preencher o meio da escala e levantar o piso**.

**Segunda causa, independente da tipografia:** as larguras de container não seguem sistema nenhum. Medido em proporção da tela: Hero 40%, CTA Final 40%, Processo 53%, Soluções 61%, e as demais 81%. As seções estreitas deixam margens laterais grandes e vazias no desktop.

**Terceira causa, fora do alcance desta rodada:** as seis referências são densas de fotografia e o site não tem nenhuma foto. Essa distância não se fecha com tipografia.

## Decisões tomadas com o usuário

- **Escopo: escala tipográfica e larguras.** Sem mudança estrutural. Ficaram explicitamente de fora, mesmo aparecendo nas referências: Hero full-bleed com foto sangrando na borda, rodapé escuro com marca-d'água, e cards densos com lista de bullets.
- **Mesma família tipográfica.** Coolvetica no display, Roboto no corpo. Nenhuma troca.
- **Hero mistura caixa alta e caixa mista:** a primeira linha em caixa alta, a segunda mantendo caixa mista e a cor dourada.
- **Dois slots de fotografia**, ambos entrando como célula de grid — padrão observado nas referências, onde um card de foto convive com cards de texto na mesma fileira. O slot da Hero foi descartado: foto na Hero só funciona no formato full-bleed, que está fora deste escopo.

---

## 1. Escala tipográfica fluida

A escala passa a viver em um lugar só, como tokens no `@theme` do `globals.css`, em vez de valores espalhados pelos componentes.

| Token | Papel | Mobile → Desktop | Hoje |
|---|---|---|---|
| `--text-micro` | disclaimer, legenda mínima | 10 → 11 | 9 |
| `--text-caption` | botões, labels em caixa alta | 12 → 13 | 11 |
| `--text-body` | corpo de texto | 16 → 17 | 14 |
| `--text-lead` | parágrafo de destaque | 19 → 21 | 20 |
| `--text-card` | H3 de card | 20 → 22 | 16 |
| `--text-h2` | título de seção | 32 → 44 | 28 → 36 |
| `--text-stat` | numeral da seção Números | 48 → 68 | 36 → 48 |
| `--text-display` | H1 da Hero e tagline | 44 → 88 | 34 → 56 (H1) |

A razão entre degraus fica em torno de 1,28 ao longo de toda a escala, contra os 1,14 atuais entre corpo e H3.

### Por que fluida em vez de degraus por breakpoint

Cada valor é um `clamp()` de três partes: mínimo, expressão `rem + vw`, máximo. Isso troca três classes responsivas por elemento por uma só, e elimina o salto visual nos breakpoints.

**A parte `rem` da expressão não é opcional.** Um `clamp()` que interpola em `vw` puro ignora o zoom do navegador: o texto para de crescer quando o usuário aumenta a fonte, o que quebra acessibilidade. A forma `rem + vw` preserva o zoom porque a âncora em `rem` responde à preferência do usuário.

### Nota sobre o piso da fonte de display

O manual proíbe usar Coolvetica abaixo de 20px. `--text-card` chega a 20px no mobile, exatamente no piso — mas esse token é consumido por H3 de card, que usa Roboto, não a fonte de display. Nenhum consumidor de Coolvetica cai abaixo de 20px nesta escala.

## 2. Larguras de container

Duas faixas, com critério explícito:

| Faixa | Largura | Seções |
|---|---|---|
| Conteúdo | 1280px (`max-w-7xl`) | Hero, Processo, Sobre, Números, Valores, Soluções, Atendimento |
| Texto corrido | 768px (`max-w-3xl`) | CTA Final (hoje em 512px) |

Larguras atuais, para referência: Hero 672, Processo 672, Soluções 768, Sobre/Números/Valores/Atendimento 1024, CTA Final 512.

**A Hero fica na faixa de conteúdo, não numa faixa própria de 1024px.** Uma versão anterior deste design colocava a Hero em 1024px, o que contradizia o critério de aceite da seção 3: "O CAPITAL QUE JÁ É SEU" em caixa alta a 88px pede cerca de 1050px, e não caberia em uma linha dentro de um container de 1024. Duas faixas também são um sistema mais simples de manter que três.

### A trava de legibilidade que precisa vir junto

Alargar container sem limitar o parágrafo produz linhas de mais de 100 caracteres, que é uma regressão de leitura. **Todo bloco de texto corrido dentro dos containers largos fica limitado a `max-w-[68ch]`.** Sem isso, esta rodada trocaria "pequeno demais" por "difícil de ler".

### O limite interno do Processo

A seção Processo tem, além do container, um `max-w-[440px]` no texto de cada passo. Alargar só o container deixaria a seção larga e o conteúdo no mesmo lugar — vazio novo em vez de vazio resolvido. Esse limite interno sobe junto, respeitando a trava de 68 caracteres.

## 3. Hero

A headline passa a misturar os dois tratamentos:

> **O CAPITAL QUE JÁ É SEU**
> *não deveria esperar.*

Primeira linha em caixa alta, no peso e tamanho de `--text-display`. Segunda linha mantendo caixa mista, `font-light` e a cor `gold`, como já é hoje.

A caixa alta ficou na primeira linha porque nas referências é a linha estrutural que carrega o peso visual, e a segunda funciona como virada. Inverter é troca de uma linha, se o cliente preferir.

**Critério de aceite, não o número:** a Coolvetica é uma fonte com largura de caractere pouco previsível, então 88px é alvo, não garantia. O que precisa valer é **a primeira linha caber em uma única linha a partir de 1280px de viewport**. Se não couber, a copy não muda — o tamanho é que cede.

E o tamanho cede **só na Hero**, com um teto local, não baixando o `--text-display` global. O token é compartilhado com a tagline do Atendimento, que tem conteúdo mais curto ("CONECTANDO VALOR," pede cerca de 820px a 88px) e cabe folgada. Baixar o token global encolheria a tagline sem motivo, para resolver um problema que é só da Hero.

## 4. Slots de fotografia

Dois lugares, ambos onde a foto entra como célula de grid sem reestruturar a seção:

| Seção | Onde |
|---|---|
| Processo | um card de foto ao lado da linha do tempo |
| Sobre | um card de foto dentro da caixa navy, junto de Missão e Visão |

Cada slot entra como placeholder **visível e marcado no código**, com proporção definida, para que a troca futura seja só o arquivo de imagem. O placeholder declara o que falta em vez de fingir que a seção está completa.

Nenhuma imagem de banco de imagens entra. A decisão de 2026-07-31 continua valendo: stock genérico trabalha contra o posicionamento visual que o manual aponta como o diferencial real da Celer.

## 5. Manual de marca

`docs/brand-guidelines.md` recebe:

- A tabela "Escala tipográfica" da seção 4 substituída pela escala nova, com os nomes dos tokens
- O sistema de três larguras de container, que hoje não está documentado em lugar nenhum
- A trava de 68 caracteres para texto corrido
- A regra de `clamp()` com âncora em `rem`, e o porquê
- Registro dos dois slots de fotografia como pendência de asset

---

## Verificação

- `npx tsc --noEmit`, `npx eslint .` e `npm run build` limpos
- **Medição da escala renderizada** em 375px, 768px e 1440px, conferindo cada token contra a tabela da seção 1
- **Linha 1 da Hero em uma única linha** a partir de 1280px
- **Comprimento de linha** de todo parágrafo em container largo, confirmando o teto de 68 caracteres
- Sem overflow horizontal de documento em 375px, 768px e 1440px
- Contraste conferido de novo nos pontos que mudam de tamanho: texto maior sobre os gradientes escuro e dourado

### Três pontos que a escala nova pode quebrar

Levantados no diagnóstico, precisam de verificação explícita:

1. **O acordeão de Valores** tem painéis de altura fixa (`h-[420px]`) com título rotacionado a 90°. Tipografia maior mexe direto na geometria dele.
2. **A grade de Números em mobile** é de duas colunas. Numeral em 48px pode estourar a largura da célula.
3. **A tagline em 88px** precisa continuar cabendo em duas linhas no desktop, sem quebrar em três.

**Limitações conhecidas do ambiente**, já verificadas nesta base e nenhuma delas defeito do site: o painel do navegador não compõe frames, então `IntersectionObserver` não dispara (blocos em `Reveal` ficam em `opacity: 0`, a tagline não revela, os contadores não iniciam), transições CSS não avançam, e screenshots falham. Cores computadas saem em `oklab()`, então cálculo de contraste exige converter para sRGB antes de compor o alpha. Ao mudar a viewport, recarregar antes de medir.

## Achados menores desta rodada, deixados em aberto

Levantados pela revisão final, julgados polimento e não corrigidos. Registrados para não serem redescobertos do zero:

- **As duas colunas da seção Sobre ficam ~27% desbalanceadas em altura** (esquerda 575px, direita 452px em 1265px). A causa registrada inicialmente estava errada: medido em 1265px, o `PhotoSlot` honra o `aspect-[16/10]` exatamente (513×320). O desequilíbrio vem da altura do bloco de texto. O `lg:items-center` centraliza a coluna mais curta, então lê como deliberado.
- **O prop `aspect` do `PhotoSlot` é indicativo, não contrato.** Em 375px o slot da Sobre renderiza 263×222 (razão 1,18) contra `aspect-[16/10]` declarado, porque ícone, rótulo e descrição excedem a altura da proporção. Quando uma foto real substituir o placeholder, a caixa vai assumir a razão declarada e o layout mobile muda em relação ao que está na tela hoje. O `aspect` também é funcionalmente redundante com o `className`: ambos caem no mesmo `cn()`.
- **A faixa de tablet (~885px) nunca foi medida nas verificações de tarefa**, só 375px e ~1160px. Foi onde a revisão final achou os estouros de comprimento de linha, já corrigidos. Vale incluir essa largura nas próximas rodadas.

## Pendências herdadas, ainda abertas

- Fotografia real para os dois slots novos, e para os painéis de Valores
- Aviso de serialização RSC no console em dev, do acordeão de Valores — produção não afetada
- Confirmar se a URL de login é definitiva
- Confirmar se a cobrança do devedor no vencimento é feita pela Celer
- Confirmar se há registro regulatório a declarar no rodapé
