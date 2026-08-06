# Formulário de captação de leads

**Data:** 2026-08-05 · **Status:** Design aprovado pelo usuário, pronto para plano de implementação.

## Contexto

O site converte hoje exclusivamente por WhatsApp. O cliente quer um formulário de captação que qualifique o lead antes do contato, com faixa de faturamento anual, e que entregue os dados em dois canais: uma planilha que a agência e o cliente abrem, e um e-mail a cada envio.

## Decisões tomadas com o usuário

- **Hospedagem: Vercel**, já em uso. Isso permite receber o formulário no próprio site, via Server Action, sem serviço de formulário de terceiro no meio.
- **Destino dos dados: planilha do Google** compartilhada entre agência e cliente, mais e-mail a cada envio.
- **Abordagem: Server Action + Google Sheets API + Resend.** Descartadas: Apps Script (o e-mail sairia de um `@gmail.com`, ruim para uma securitizadora falando com CFO) e serviços prontos de formulário (teto de ~50 envios/mês no gratuito, integração com planilha paga, e o dado passaria a morar com o fornecedor — pior posição sob LGPD).
- **Anti-spam: honeypot + armadilha de tempo**, sem estado compartilhado.
- **Posição: acima do CTA Final**, entre Atendimento e o fechamento em WhatsApp.

---

## 1. Conflito registrado com o manual de marca

O manual proíbe formulário em dois lugares:

- Seção 2, tabela de tom: *"CTA / WhatsApp — convite de baixo atrito, sem formulário"*
- Seção 7, checklist: *"CTA final sempre aponta para WhatsApp, nunca formulário"*

**A regra do checklist sobrevive intacta:** o CTA Final continua sendo o WhatsApp, e o formulário é uma seção separada acima dele. Os dois caminhos de conversão coexistem.

**A regra da tabela de tom muda de fato.** O raciocínio original, ancorado na persona (Rodrigo, 46, dono de metalúrgica, que "desconfia de processo lento"), era que atrito baixo converte melhor nesse público. Seis campos obrigatórios com CNPJ são atrito alto.

Isso não é erro: pedir faixa de faturamento é qualificação de lead, uma decisão comercial legítima do cliente, e a existência do WhatsApp logo abaixo preserva o caminho de baixo atrito para quem não quiser preencher. Mas é mudança deliberada de uma regra documentada, e vai registrada no manual — não contrariada em silêncio.

## 2. Posição e wash

Ordem nova: `Hero → Processo → Sobre → Números → Valores → Soluções → Atendimento → Formulário → CTA Final → Footer`

Atendimento é `surface-wash-up` e termina em branco. O Formulário entra como **`surface-wash-down`**, começa em branco e fecha em cream, encostando no CTA Final escuro — que já é corte duro por ser bookend. A alternância fecha sem ajuste em nenhuma outra seção.

## 3. Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| `web/src/components/formulario.tsx` | A seção e a UI. Client Component: tem estado de formulário |
| `web/src/app/actions/enviar-formulario.ts` | Server Action: revalida, grava, envia |
| `web/src/lib/validacao.ts` | Regras de validação, importadas pelo cliente e pelo servidor |
| `web/src/lib/planilha.ts` | Cliente do Google Sheets |
| `web/src/lib/email.ts` | Cliente do Resend |

**A validação vive num módulo só e o servidor revalida tudo do zero.** Validação no cliente é conveniência de UX; qualquer um posta direto no endpoint. As duas camadas usam as mesmas funções, então não podem divergir.

### Dependências novas

Duas são inevitáveis:

- **`resend`** — cliente oficial, pequeno
- **`google-auth-library`** — só a autenticação. **Não usar o pacote `googleapis` completo**: são dezenas de megabytes para consumirmos um único endpoint. A chamada ao Sheets é um `fetch` na API REST.

A validação é escrita à mão em `lib/validacao.ts`, sem `zod`. São seis campos, e os dígitos verificadores de CNPJ ocupam poucas linhas. Trazer um validador de schema para isso não se paga.

## 4. Campos

Todos obrigatórios.

| Campo | Tipo | Validação |
|---|---|---|
| Nome completo | texto | não vazio após `trim`, mínimo 2 caracteres |
| CNPJ | texto com máscara | formato e dígitos verificadores — ver a ressalva abaixo |
| Nome da empresa | texto | não vazio após `trim` |
| WhatsApp | telefone com máscara | DDD válido e 8 ou 9 dígitos |
| E-mail | e-mail | formato |
| Faturamento anual | select | obrigatoriamente um dos sete valores abaixo |

### As sete faixas, verbatim

```
Menos de 3 milhões por ano
Entre 3 milhões e 9,6 milhões por ano
Entre 9,6 milhões e 24 milhões por ano
Entre 24 milhões e 60 milhões por ano
Entre 60 milhões e 150 milhões por ano
Entre 150 milhões e 300 milhões por ano
Acima de 300 milhões
```

O servidor rejeita qualquer valor fora dessa lista. O `select` do navegador não é garantia: o campo chega como string arbitrária na requisição.

### Ressalva importante sobre o CNPJ

**O CNPJ alfanumérico entrou em vigor no Brasil em 2026.** O formato novo tem doze caracteres alfanuméricos seguidos de dois dígitos verificadores numéricos, e o cálculo do dígito passa a tratar letras por um valor derivado do código ASCII.

Um validador que aceite apenas dígitos **rejeitaria CNPJ recém-emitido**, exatamente o perfil de empresa nova que pode estar preenchendo o formulário. Bloquear cliente legítimo é pior que aceitar um CNPJ inválido, que o time comercial descobre no primeiro contato.

**A regra exata do dígito verificador para o formato alfanumérico precisa ser conferida na fonte oficial (Receita Federal / Serpro) antes de implementar.** Este spec não a reproduz de memória: errar aqui bloqueia cliente de verdade. Se a confirmação não vier a tempo, a saída segura é validar apenas o formato — comprimento e composição — e deixar os dígitos verificadores para depois.

## 5. Fluxo do envio

1. O cliente valida e mostra erros por campo. Nada é enviado com campo inválido.
2. A Server Action revalida tudo.
3. Checa honeypot e armadilha de tempo.
4. **Grava na planilha primeiro.** É o registro durável.
5. **Depois envia o e-mail.**

### Por que a ordem importa

Se a planilha grava e o e-mail falha, o lead **não se perde** — está na planilha, e a falha vai para o log. O usuário vê sucesso, porque do ponto de vista dele o dado chegou.

Se a **planilha** falha, é falha dura: a mensagem de erro aponta o usuário para o WhatsApp, que é o caminho de conversão que já existe e não depende de nada disto. Melhor mandar a pessoa para um canal que funciona do que pedir para tentar de novo.

## 6. Anti-spam

- **Honeypot:** campo escondido de humanos, preenchido por bot. Envio com ele preenchido é descartado silenciosamente, com resposta de sucesso — bot não deve aprender que falhou. O descarte é registrado no log: descarte silencioso sem sinal nenhum torna um defeito invisível em produção.

**Revisto em 2026-08-06: a armadilha de tempo foi removida.** O desenho original mandava o formulário carregar com o instante de renderização e o servidor rejeitar envio em menos de três segundos. O instante de renderização vem do relógio do navegador e a comparação acontece no relógio do servidor. Um aparelho com o relógio adiantado — situação comum — tinha o envio descartado em silêncio, recebendo mensagem de sucesso. Reproduzido em navegador com 60 segundos de adiantamento: envio inteiramente válido, resposta de sucesso, nada gravado. Perder lead legítimo é pior que deixar passar bot. **Só o honeypot ficou.**

**Isto não é limite de taxa.** Limite de taxa real exige estado compartilhado entre instâncias serverless, o que pediria Redis e mais uma conta. Decisão consciente: para o volume de um site institucional, o honeypot segura bot de varredura, que é a ameaça realista. Um ataque direcionado passaria — se acontecer, a saída é Upstash Redis, não uma armadilha de relógio.

## 7. Destinos

**Planilha:** uma linha por envio, com data e hora e os seis campos. A planilha vive na conta Google **do cliente**, compartilhada com a agência. Uma service account do Google Cloud recebe permissão de edição.

**E-mail:** um por envio, para os endereços configurados, com os seis campos e o horário. Enviado por Resend a partir de um endereço `@celercapital.com.br`.

Nenhum e-mail automático de confirmação para quem preencheu. Não foi pedido, e o contato humano já é a promessa do site.

## 8. Segredos

Todos em variáveis de ambiente da Vercel. Nenhum no repositório.

```
RESEND_API_KEY
EMAIL_REMETENTE
EMAILS_DESTINO
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
PLANILHA_ID
```

`EMAIL_REMETENTE` faltava nesta lista e é obrigatória: é o endereço `@celercapital.com.br` de onde o Resend envia. Os nomes conferem com `web/.env.example`, que carrega os nomes com valor vazio e nenhum segredo.

## 9. LGPD

O formulário coleta nome, e-mail e WhatsApp de pessoa identificável, além do CNPJ da empresa.

**Decisão do usuário: aviso curto abaixo do botão, sem página de política dedicada.** O aviso diz o que é coletado e para quê.

**Risco registrado, com a decisão tomada à vista dele:** aviso curto é o mínimo. Se o compliance do cliente revisar, provavelmente vai pedir política de privacidade completa, base legal declarada e política de retenção. O site não tem nenhuma página de privacidade hoje. Isto fica documentado para não ser redescoberto como surpresa.

## 10. Acessibilidade

Padrão que o projeto já sustenta:

- `<label>` real para cada campo, nunca só `placeholder`
- Erro por campo, associado por `aria-describedby`, e `aria-invalid` no campo inválido
- A mensagem de resultado é uma live region, e o foco vai para ela ao concluir
- Contraste seguindo os pisos do manual: navy sobre claro no mínimo `/65`
- Tipografia vinda dos tokens da escala, sem valores soltos

## 11. Manual de marca

`docs/brand-guidelines.md` recebe o registro da exceção da seção 1 acima, e uma nota de que o site passou a ter dois caminhos de conversão: formulário qualificado e WhatsApp de baixo atrito.

---

## Verificação

- `npx tsc --noEmit`, `npx eslint .` e `npm run build` limpos
- Cada campo rejeita entrada inválida no cliente **e**, independentemente, no servidor — testado postando direto na action, sem passar pela UI
- CNPJ: aceita formato válido, rejeita dígito verificador errado, e **aceita o formato alfanumérico**
- Faturamento fora da lista das sete faixas é rejeitado pelo servidor
- Honeypot preenchido resulta em sucesso aparente sem gravar nada, e deixa registro no log
- Rejeição do servidor devolve os seis campos preenchidos, não um formulário em branco
- Máscara de CNPJ e de WhatsApp formatam durante a digitação, e o valor mascarado passa pela validação do servidor
- Colar `+55 41 99569-9494` resulta em `(41) 99569-9494`, não em outro número
- Falha simulada da planilha aponta o usuário para o WhatsApp; falha simulada do e-mail não perde o lead
- Ordem das seções e alternância do wash conferidas por `getComputedStyle`
- Sem overflow horizontal em 375px, 885px e 1440px
- Navegação por teclado percorre todos os campos, e o erro é anunciado

**Limitações conhecidas do ambiente:** o painel do navegador não compõe frames, então `IntersectionObserver` não dispara e blocos em `Reveal` ficam em `opacity: 0`; transições CSS não avançam; screenshots falham. Cores computadas saem em `oklab()`, exigindo conversão para sRGB antes de compor alpha em cálculo de contraste. Ao mudar viewport, recarregar antes de medir.

## Pendências que travam a publicação

Nenhuma delas está comigo, e todas entram no código como placeholder explícito e marcado:

1. **Quais e-mails recebem** os envios
2. **De qual conta Google** é a planilha, e criação da service account
3. **Acesso ao DNS de `celercapital.com.br`** para verificar o domínio no Resend. Sem isso o e-mail é enviado, mas cai em spam com frequência
4. **Confirmação da regra do dígito verificador do CNPJ alfanumérico** na fonte oficial

## Pendências herdadas, ainda abertas

- Fotografia real para os dois slots de placeholder
- Colunas da seção Sobre desbalanceadas em altura; `aspect` do `PhotoSlot` é indicativo e não contrato
- Aviso de serialização RSC no console em dev, do acordeão de Valores — produção não afetada
- Confirmar se a URL de login é definitiva
- Confirmar se a cobrança do devedor no vencimento é feita pela Celer
- Confirmar se há registro regulatório a declarar no rodapé
