# Pivô Visual v2 — Celer Capital LP

**Data:** 2026-07-10 · **Status:** Implementado e verificado, pronto para revisão do usuário.

## Contexto

Depois de ver a v1 (Hero + 6 seções) implementada, o usuário pediu uma correção de rumo visual: a v1 não ficou parecida o suficiente com as referências (Clause, Finpay) que inspiraram o Hero originalmente. Pedido consolidado:

1. Fonte Coolvetica (fonte real de marca do cliente, Adobe Fonts) no lugar de Cormorant Garamond
2. Cantos arredondados em cards, botões e textos/badges — sempre
3. Uma cor única de fundo no site inteiro, com cards em tons suaves para variação (em vez da alternância Navy→Black→Cream da v1)
4. Todos os blocos/textos centralizados na página
5. Remover o mockup de WhatsApp do Hero
6. Remover a seção "Empresas que já confiam na Celer"
7. Header transparente sobre o Hero, compila numa pill com as seções ao rolar
8. Botão "Login" na header, linkando para `https://digital.celercapital.com.br/#/authentication/login`
9. Usar as logos reais do cliente (`3_celerlogo.webp`, `7_celerlogo.webp`), com animação de logo completa → ícone ao compilar a header

## Decisões tomadas (com o usuário, via clarifying questions)

- **Coolvetica:** não encontrada em nenhuma pasta de fonte do sistema nem no cache do Adobe Creative Cloud. Usuário optou por exportar o arquivo depois — `@font-face` já configurado em `globals.css` apontando para `web/public/fonts/coolvetica.woff2` (arquivo ainda não existe, fallback `Arial Narrow` ativo).
- **Logo só na versão clara:** confirmado via composição em fundo navy que os arquivos só existem em branco/claro (funcionam sobre fundo escuro, invisíveis sobre fundo claro). Usuário optou por manter Hero (e a header transparente sobre ele) em fundo escuro — não pediu uma versão colorida da logo.
- **Escopo do "centralizar":** blocos/títulos de seção centralizados; parágrafos longos dentro de cards continuam alinhados à esquerda (não fizemos `text-align:center` em todo texto corrido).

## Decisões técnicas próprias (não perguntadas, resolvidas durante a implementação)

- **Ícone da logo:** o usuário descreveu "a logo 7 aparece expandida, a logo 3 vira só o ícone ao compilar" — mas o arquivo `7_celerlogo.webp` é um lockup **vertical/empilhado** (não cabe numa navbar horizontal fina) e `3_celerlogo.webp` é o lockup **horizontal** completo (ícone+texto, não só ícone). Adaptei: recortei um ícone-only a partir do mesmo ícone presente nos dois arquivos (`web/public/logo/celer-icon.png`) para o estado compilado, e uso o lockup horizontal (`celer-horizontal.png`, do arquivo 3) para o estado expandido — a versão vertical (`celer-vertical.png`) ficou salva mas sem uso ainda, disponível para peças futuras.
- **Bookends escuros:** Hero e CTA Final permanecem navy/ink; todo o resto da página é cream — essa é meu interpretação de "uma cor só de fundo" combinada com "Hero continua escuro" (resposta do usuário), já que ambas as referências (Clause, Finpay) também usam 1-2 momentos escuros como pontuação num site majoritariamente claro, não fundo único absoluto.
- **`TextAnimate` (Magic UI) removido do Hero:** ao validar no navegador, o H1 renderizado via `TextAnimate` (animação palavra-por-palavra) ficou preso mostrando só a primeira palavra em cinza, de forma reproduzível em navegação limpa. Não investiguei a fundo a causa (podia ser o próprio componente, ou lentidão de hidratação neste ambiente de automação combinada com a complexidade do componente) — troquei pelo mesmo `Reveal`/`BlurFade` usado no resto da página, mais simples e já comprovadamente confiável em todas as outras seções. Resultado visual final ficou bom e consistente.
- **Diferenciais:** convertida de seção inteira em navy para um card branco arredondado (`rounded-3xl`) flutuando sobre o fundo cream, mantendo a tabela semântica já implementada.
- **Contraste:** durante a conversão de várias seções para o fundo cream, encontrei e corrigi repetidamente o mesmo problema — texto `text-navy` abaixo de ~65% de opacidade cai abaixo de 4.5:1 (AA) sobre cream. Ver `docs/brand-guidelines.md` seção 3 (Acessibilidade), que documenta o piso de opacidade seguro agora.

## Verificação

- `tsc --noEmit` e `eslint .` limpos
- Navegador: Hero, Processo, Para Quem, Diferenciais, Quebra de Objeção, CTA Final e Footer conferidos visualmente em 1440px e 390px (mobile), incluindo o comportamento da navbar (transparente → pill) e a troca de logo ao rolar
- Snapshot de acessibilidade: hierarquia de heading correta (h1 único no Hero, h2 por seção), nenhuma seção quebrada

## Pendências para o usuário

- Exportar o arquivo real da Coolvetica (`.woff2` ou `.otf`) e salvar em `web/public/fonts/`
- Confirmar se a URL de login (`https://digital.celercapital.com.br/#/authentication/login`) é definitiva
- Se precisar da logo sobre fundo claro no futuro, pedir ao cliente uma versão navy/dourada — só existe a versão branca hoje
