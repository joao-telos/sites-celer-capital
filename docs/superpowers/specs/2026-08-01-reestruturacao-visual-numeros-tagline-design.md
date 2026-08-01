# Reestruturação visual: nova ordem, Números e tagline animada

**Data:** 2026-08-01 · **Status:** Design aprovado pelo usuário, pronto para plano de implementação.

## Contexto

O cliente enviou uma imagem da estrutura desejada da página e duas referências visuais de seções específicas. Pedido consolidado:

1. Nova ordem de seções, com **"Para Quem" removida**
2. Seção **Sobre** reformulada: caixa grande em gradiente navy, com Missão e Visão em caixas na cor de fundo da página
3. Seção **Números** nova, em gradiente dourado, com quatro dados institucionais e animação de contagem
4. Seção **Atendimento** substituída inteiramente pela tagline em texto grande, revelada palavra a palavra no scroll

## Decisões tomadas com o usuário

- **`CountingNumber` implementado nativo, sem o pacote `motion`.** O prompt do cliente manda instalar `motion`, mas este projeto removeu essa dependência de propósito (ver `docs/superpowers/specs/2026-07-10-visual-pivot-v2.md`): o `Reveal` foi reescrito com `IntersectionObserver` nativo + transição CSS, e o projeto ficou sem nenhuma biblioteca de animação. Reinstalar traria de volta uma dependência abandonada por uma contagem que cabe em ~20 linhas. A API pública do componente (`from`, `target`, `className`) é mantida.
- **"progresso" na imagem do cliente é a seção `processo` atual** (a linha do tempo "Do contrato fechado ao capital na conta"), confirmado com o usuário.
- **A tagline sai do rodapé.** Com a seção Atendimento nova, "Conectando Valor, Crescendo Juntos" apareceria duas vezes separadas apenas pelo CTA Final, praticamente na mesma rolagem. A seção passa a ser o único lugar onde a assinatura aparece.

## Nova ordem da página

```
Hero → Processo → Sobre → Números → Valores → Soluções → Atendimento → CTA Final → Footer
```

"Para Quem" deixa de existir.

---

## 1. Remoção da seção Para Quem

**Deletar:** `web/src/components/para-quem.tsx`

**Consequências que precisam ser tratadas junto:**

- `web/src/app/page.tsx`: remover o import e o elemento
- `web/src/components/navbar.tsx`: remover `{ href: "#para-quem", label: "Para quem" }`. A navbar fica com três links: Como funciona, Sobre, Soluções
- `web/src/components/ui/card.tsx`: `para-quem.tsx` é seu **único consumidor** hoje (verificado por grep). O arquivo **permanece** no projeto — é componente de biblioteca do shadcn, não código morto autoral. Não deletar.
- `docs/brand-guidelines.md`: 5 menções à seção precisam sair ou virar referência histórica

Some junto o `bg-transparent` que a rodada anterior adicionou para o card compor sobre o wash — era específico daquele arquivo e não tem equivalente nas seções novas, porque nenhuma delas usa o `Card` do shadcn.

## 2. Wash das seções claras

A alternância existe para que a cor do fim de uma seção seja a do início da próxima, deixando a emenda invisível. Com a ordem nova:

| Seção | Direção | Mudou? |
|---|---|---|
| Processo | `surface-wash-down` | não |
| Sobre | `surface-wash-up` | **sim** (era down) |
| Números | `surface-wash-down` | nova |
| Valores | `surface-wash-up` | não |
| Soluções | `surface-wash-down` | não |
| Atendimento | `surface-wash-up` | não |

Continuam seis seções claras, então o padrão fecha igual: Atendimento termina em branco e encosta no CTA Final escuro, que é um corte duro deliberado.

## 3. Token novo

```css
--color-gold-bright: #f2aa3a;
```

Ponta clara do gradiente da seção Números. **Fora da paleta institucional**, exatamente como o `#003599` da rodada anterior — entrou por pedido do cliente, não é variação gerada. Vai para o manual com essa marcação.

## 4. Seção Sobre reformulada

**Arquivo:** `web/src/components/sobre.tsx` (reescrita) · **`id`:** `sobre`

Uma caixa grande `rounded-[2rem]` preenchida com gradiente navy ocupa a seção, sobre o wash claro. Dentro dela, duas colunas no desktop, empilhadas no mobile:

- **Esquerda:** `<h2>` "Sobre nós", a frase de destaque e o parágrafo, em branco
- **Direita:** duas caixas `rounded-2xl` na cor de fundo da página (cream), uma para Missão e outra para Visão, com texto navy

As duas caixas passam a ser **cream sólido**. Os tints em gradiente que elas usam hoje (`from-navy/[0.07] to-navy/[0.015]` e `from-gold/[0.16] to-gold/[0.05]`) somem: aqueles tons foram desenhados para caixa translúcida sobre fundo claro, e aqui o fundo atrás delas é a caixa navy. Um tint navy translúcido sobre navy desapareceria; o tint dourado brigaria com a seção Números logo abaixo.

O gradiente da caixa usa 135° (diagonal), não os 90° dos dois bookends. A diferença é proposital: os bookends são fundo de seção inteira e o movimento horizontal funciona na largura toda; uma caixa arredondada grande lê melhor na diagonal. Ângulo exato ajustável na implementação.

**A copy não muda** — é a mesma que o cliente entregou na rodada anterior, e continua verbatim-crítica.

**Contraste:** o texto branco dentro da caixa segue o piso `/70` já estabelecido — na ponta clara do gradiente é o que separa 6,0:1 (passa) de 3,7:1 (reprova). As caixas de Missão e Visão são cream com texto navy, 14,9:1.

## 5. Seção Números

**Arquivos:** `web/src/components/numeros.tsx` + `web/src/components/ui/counting-number.tsx` · **`id`:** `numeros`

Caixa grande `rounded-[2rem]` com gradiente dourado `#C68622 → #F2AA3A`, sobre o wash claro. Quatro números dentro, em grade de 2 colunas no mobile e 4 no desktop.

| Numeral animado | Prefixo/sufixo | Rótulo |
|---|---|---|
| 30 | sufixo `+` | anos de experiência no mercado de recebíveis |
| 9 | — | anos de empresa |
| 1 | prefixo `R$`, sufixo `bi+` | antecipado em 9 anos de operação |
| 100 | sufixo `+` | empresas parceiras atendidas |

Os dados vieram do cliente e são verbatim-críticos. Prefixo e sufixo são texto estático; só o numeral anima.

**Sem `<h2>` visível.** A referência do cliente não mostra título nesta seção, e ela funciona como faixa de dados, não como argumento com cabeçalho. Leva um `<h2 className="sr-only">` (algo como "Celer Capital em números") para manter o landmark de acessibilidade — mesmo tratamento que a seção Soluções já usa e que o manual registra.

**Restrição de contraste que define o design desta seção:** sobre dourado, texto branco dá 3,1:1 no tom escuro e 2,0:1 no claro — reprova nos dois. **Todo texto desta seção é navy**, que dá 5,5:1 sobre `#C68622` e 8,5:1 sobre `#F2AA3A`. Não existe variante clara viável aqui.

**Ressalva conhecida:** o card do bilhão conta de 0 a 1. A animação nele é praticamente imperceptível, ao contrário dos outros três (30, 9, 100). Fica assim por consistência de tratamento; se incomodar visualmente, a saída é remover a contagem desse card específico, não inventar uma escala falsa.

### `CountingNumber` — implementação nativa

```tsx
interface CountingNumberProps {
  target: number;
  from?: number;
  durationMs?: number;
  className?: string;
}
```

- `requestAnimationFrame` com easing `easeOutCubic`, sem dependência externa
- Dispara pelo `useInViewOnce` que o projeto já tem, **não no mount**. O componente do prompt usa `autoStart` no mount: se a seção estiver fora da tela, a animação passa antes de o usuário chegar nela.
- Formatação com `toLocaleString("pt-BR")`
- **`prefers-reduced-motion` precisa de tratamento explícito.** A regra global em `globals.css` zera `animation-duration` e `transition-duration`, mas não afeta contagem dirigida por `requestAnimationFrame` em JS. O componente consulta `matchMedia("(prefers-reduced-motion: reduce)")` e, se ativo, escreve o valor final direto sem animar.

## 6. Seção Atendimento reformulada

**Arquivo:** `web/src/components/atendimento.tsx` (conteúdo substituído) · **`id`:** `atendimento`

Todo o conteúdo atual sai. Fica apenas:

> **CONECTANDO VALOR,**
> **CRESCENDO JUNTOS**

Em caixa alta, `font-heading`, `font-bold`, tamanho grande (`text-4xl` no mobile até `text-7xl` no desktop), em duas linhas fixas. A primeira linha em navy, a segunda em `navy-bright` — dois tons, como a referência do cliente, ambos com folga de contraste sobre o wash claro (14,9:1 e 9,4:1).

Cada palavra revela separadamente, com fade, no mesmo espírito do escalonamento da linha do tempo do Processo.

**A tagline é o `<h2>` da seção**, não um parágrafo decorativo: é o único conteúdo que sobra, e a seção precisa de cabeçalho para não abrir buraco na hierarquia de headings da página. As palavras são `<span>`s dentro desse `<h2>` único — não um `<h2>` por palavra, o que criaria quatro cabeçalhos irmãos sem sentido semântico.

### Por que esta seção NÃO usa o componente `Reveal`

`Reveal` renderiza um `<div>`. Um `<div>` dentro de um `<h2>` é HTML inválido: o modelo de conteúdo de heading aceita apenas conteúdo de fluxo textual. Embrulhar cada palavra em `Reveal` produziria markup inválido, e embrulhar o `<h2>` inteiro num único `Reveal` revelaria tudo de uma vez, que é justamente o que o cliente não quer.

A implementação correta aqui é mais simples que usar o primitivo, não mais complexa:

- **um** `useInViewOnce` aplicado ao `<h2>` (o hook que o `Reveal` já usa internamente)
- cada palavra é um `<span className="inline-block">` que alterna entre estado escondido e visível conforme esse único booleano
- o escalonamento vem de `style={{ transitionDelay: \`${i * 0.12}s\` }}` por span

Um observer em vez de quatro, markup válido, e nenhuma mudança na assinatura do `Reveal`, que é consumido por todas as outras seções. O `inline-block` é necessário porque `transform` não se aplica a elementos inline.

`prefers-reduced-motion` já é tratado pela regra global de `globals.css`, porque aqui a animação é transição CSS — ao contrário do `CountingNumber`, que é JS e precisa de tratamento próprio.

## 7. Rodapé

**Arquivo:** `web/src/components/footer.tsx`

Remover o parágrafo da tagline. Sobra o bloco de copyright e CNPJ, que passa a ocupar o rodapé sozinho — o layout `sm:justify-between` precisa virar centralizado, senão o texto fica encostado à esquerda sem par.

O `TODO` sobre registro regulatório permanece: é pendência aberta e não tem relação com esta mudança.

## 8. Manual de marca

`docs/brand-guidelines.md` recebe:

- Token `gold-bright` `#F2AA3A` na tabela de paleta, marcado como pedido do cliente e fora da paleta original
- **Regra nova e dura:** texto sobre superfície dourada é sempre navy. Branco reprova nos dois extremos do gradiente (3,1:1 e 2,0:1). Isso generaliza a regra que já existia para botões dourados
- Remoção das 5 menções à seção "Para Quem", incluindo o padrão "grid de cards 2×N" e o exemplo do card com `border-t-4` de destaque, que era dela
- A tagline muda de papel: deixa de ser assinatura de rodapé e vira seção própria. A seção 5 do manual descreve o uso antigo e precisa ser atualizada
- A seção do sistema de gradientes ganha o gradiente dourado das caixas e a distinção entre gradiente de bookend (90°) e de caixa (135°)

---

## Verificação

- `npx tsc --noEmit`, `npx eslint .` e `npm run build` limpos
- Ordem das seções no DOM e alternância do wash conferidas por `getComputedStyle`, emenda a emenda
- Navbar com 3 links, todas as âncoras resolvendo; nenhuma referência remanescente a `#para-quem`
- Contraste medido nos dois extremos de cada gradiente novo: texto navy sobre a caixa dourada, texto branco `/70` sobre a caixa navy, texto navy nas caixas de Missão e Visão
- `CountingNumber` verificado por asserção de DOM: valor final correto e formatado em pt-BR
- Responsivo em 1440px, 768px e 375px, sem overflow horizontal de documento

**Limitações conhecidas do ambiente**, todas já verificadas nesta base de código e nenhuma delas defeito do site:

- O painel do navegador não compõe frames: `IntersectionObserver` não dispara, então blocos em `Reveal` ficam em `opacity: 0` e a contagem do `CountingNumber` não inicia sozinha. Verificar chamando o disparo programaticamente e conferindo o valor final no DOM.
- Transições CSS não avançam. Medir estado por classe (`grow-[3]`) em vez de largura animada.
- Cores computadas vêm em `oklab()` no Tailwind v4. Cálculo de contraste exige converter para sRGB antes de compor o alpha.
- Ao mudar a viewport, recarregar antes de medir.

## Achados menores desta rodada, deixados em aberto

Levantados pela revisão final, julgados polimento e não corrigidos. Registrados para não serem redescobertos do zero:

- **`rounded-[2rem]` nas duas caixas novas** (`sobre.tsx`, `numeros.tsx`) é valor arbitrário fora da escala de raio do projeto. Com `--radius: 1.25rem`, `rounded-2xl` dá 2.25rem e `rounded-3xl` dá 2.75rem, e o manual pede essa faixa. Resolver com um token novo ou ajustando a escala.
- **`CountingNumber` não reinicia `value` quando as props mudam.** O efeito depende de `[inView, from, target, durationMs]`, mas uma mudança de prop no meio do voo faz o número saltar para trás e recontar. Inalcançável hoje (todas as props são literais de módulo), mas é armadilha para o próximo consumidor. O `frameRef.current` também nunca é zerado depois do último frame.
- **`atendimento.tsx` e o `id="atendimento"`** descrevem uma seção cujo conteúdo inteiro virou a tagline da marca. Nenhuma âncora aponta para ela, então renomear é de graça.

## Pendências herdadas, ainda abertas

- Aviso de serialização RSC no console em dev, do acordeão de Valores — documentado em `2026-07-31-gradientes-sobre-valores-design.md`, produção não afetada
- Confirmar se a URL de login é definitiva
- Confirmar se a cobrança do devedor no vencimento é feita pela Celer
- Confirmar se há registro regulatório a declarar no rodapé
