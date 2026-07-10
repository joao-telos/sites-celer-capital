# Para Quem — Celer Capital LP — Design Spec

**Data:** 2026-07-10 · **Status:** Executado em continuação (retomado manualmente após a run agendada travar), autorrevisão registrada abaixo.
**Escopo:** Terceira seção da LP — grid 2×2 com 4 situações de uso.

## Camada 1 — Referência visual

| Fonte | Padrão | Aplicação |
|---|---|---|
| Mockup v3 (`.para-quem`/`.pq-grid`) | Primeira seção clara da LP (fundo cream), cards brancos com borda esquerda colorida variando por item, número fantasma grande no canto em baixa opacidade | Estrutura mantida 1:1 — é o padrão "grid de cards" documentado no brand guideline §6 |
| Alternância de fundo (brand guideline §6) | Navy → Black → Cream → ... — Para Quem é a primeira seção clara, quebrando o ritmo das duas seções escuras anteriores (Hero navy, Processo black) | Confirma que a ordem Hero(navy)→Processo(black)→Para Quem(cream) segue a regra de nunca repetir duas seções escuras/claras seguidas |

Copy das 4 situações travada no mockup v3 (nenhuma alteração de conteúdo aprovado).

## Camada 2 — Critério de UI/UX e riscos

- **Heading:** `<h2>` "Situações em que a Celer resolve." — mantém a hierarquia (Hero=h1 único da página, demais seções=h2, itens internos=h3 quando há título de card).
- **Contraste:** texto navy sobre cream ≈ 14.9:1 (AAA, já validado no brand guideline §3). Texto secundário cinza (#666 no mockup) sobre branco — preciso confirmar ≥4.5:1: cinza #666666 sobre branco = 5.7:1, ok AA.
- **Grid responsivo:** 2 colunas em desktop/tablet, 1 coluna em mobile (`grid-cols-1 sm:grid-cols-2`) — o mockup usava 2 colunas fixas mesmo em telas menores (comportamento antigo do HTML estático); aqui corrijo para 1 coluna abaixo de `sm` (regra de UI/UX: nunca forçar 2 colunas apertadas em telas pequenas).
- **Número fantasma decorativo:** `aria-hidden="true"` — é puramente decorativo (posição/hierarquia visual), não carrega informação que precise ser lida por leitor de tela.
- **Motion:** stagger via `Reveal`, mesmo padrão do Hero/Processo. Nenhuma animação contínua.
- **Sem estado vazio/erro:** conteúdo estático.
- **Item 3 ("O banco não foi uma opção viável"):** menciona "CNPJ na Serasa" — copy já validada nas guidelines de voz (evita acusar o cliente, culpa a limitação do banco). Nenhuma alteração necessária.

## Camada 3 — Componentes

- **shadcn `Card`** reaproveitado para os 4 itens (em vez de `div` solto como no mockup original) — ganha consistência com o resto do sistema de componentes (Card já usado no WhatsApp mock do Hero). Borda esquerda colorida aplicada via className por cima do Card base.
- **`Reveal`** para stagger de entrada dos 4 cards.
- Sem Magic UI adicional — conteúdo de leitura, não headline.
- `id="para-quem"` para o link já existente na navbar.

## Critérios de aceite

- [x] `<h2>` único da seção, tag "Para quem" em dourado acima, sobre fundo cream (primeira seção clara)
- [x] Grid 1 coluna mobile → 2 colunas `sm:` acima
- [x] 4 cards com borda esquerda colorida (gold/teal/navy-30/silver), número fantasma `aria-hidden`
- [x] Contraste validado (navy/cream AAA, texto secundário AA)
- [x] Stagger via `Reveal`, reduced-motion herdado
- [x] `id="para-quem"` para navegação âncora
