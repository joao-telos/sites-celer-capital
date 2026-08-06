# Formulário de captação — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um formulário de captação qualificada acima do CTA Final, que grava cada envio numa planilha do Google e dispara um e-mail.

**Architecture:** O formulário posta para uma Server Action do próprio Next, hospedado na Vercel. A action revalida tudo com o mesmo módulo de validação que o cliente usa, grava na planilha primeiro e envia o e-mail depois. Validação, planilha e e-mail vivem em módulos separados, cada um com uma responsabilidade.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, Tailwind CSS 4.3.2, TypeScript 5, Node 24. Dependências novas: `resend` e `google-auth-library`.

## Global Constraints

**Este projeto não tem test runner.** `package.json` expõe apenas `dev`, `build`, `start` e `lint`. **Não instale vitest, jest ou playwright.** A verificação é `npx tsc --noEmit`, `npx eslint .`, asserções no DOM pelo navegador, e — novidade desta rodada — um script Node que exercita o módulo de validação diretamente. O Node 24 executa TypeScript nativamente, então isso não exige nenhuma dependência.

**Só duas dependências novas são permitidas:** `resend` e `google-auth-library`. **Não instale `googleapis`** — são dezenas de megabytes para consumirmos um endpoint; a chamada ao Sheets é `fetch` na API REST. Não instale `zod`.

- **Leia antes de escrever código:** `web/AGENTS.md` manda consultar `node_modules/next/dist/docs/`.
- **Nenhum segredo no repositório.** Tudo em variável de ambiente.
- Paleta fechada: navy `#001A4B`, navy-bright `#003599`, gold `#C68622`, gold-bright `#F2AA3A`, gold-light `#E1A951`, gold-dark `#6D4A13`, cream `#EFF1F4`, ink `#0B0C0C`, white `#FFFFFF`, whatsapp `#1DA851`.
- **Tamanhos de texto vêm dos tokens da escala** (`text-micro`, `text-caption`, `text-body`, `text-lead`, `text-node`, `text-h3`, `text-h2`, `text-stat`, `text-display`), nunca valores soltos, e **sem `sm:`/`lg:` de tamanho por cima** — os tokens são `clamp()` fluidos.
- Texto navy sobre fundo claro: mínimo `/65`. Texto corrido em container largo: `max-w-[68ch]`.
- Tailwind v4.3.2: `bg-linear-to-*`, não `bg-gradient-to-*` (depreciado).
- Sem em dash (—) em copy visível. Em comentário de código é livre.
- **As sete faixas de faturamento são copy do cliente e são verbatim-críticas.** Não reescreva, não abrevie, não reordene.

---

## Estrutura de arquivos

**Criar:**
| Arquivo | Responsabilidade |
|---|---|
| `web/src/lib/validacao.ts` | Regras de validação puras, sem imports. Usadas pelo cliente e pelo servidor |
| `web/scripts/verificar-validacao.ts` | Script Node que exercita o módulo acima |
| `web/src/lib/planilha.ts` | Grava uma linha na planilha do Google |
| `web/src/lib/email.ts` | Envia o e-mail do envio |
| `web/src/app/actions/enviar-formulario.ts` | Server Action que orquestra |
| `web/src/components/formulario.tsx` | A seção e a UI |

**Modificar:**
| Arquivo | O quê |
|---|---|
| `web/package.json` | Duas dependências e o script de verificação |
| `web/src/app/page.tsx` | Inserir `<Formulario />` antes de `<CtaFinal />` |
| `docs/brand-guidelines.md` | Registrar a exceção à regra de "sem formulário" |
| `web/.env.example` | Documentar as variáveis exigidas (arquivo novo, mas listado aqui por ser configuração) |

---

## Task 1: Módulo de validação

**Files:**
- Create: `web/src/lib/validacao.ts`
- Create: `web/scripts/verificar-validacao.ts`
- Modify: `web/package.json` (script `verificar`)

**Interfaces:**
- Consumes: nada.
- Produces: `FAIXAS_FATURAMENTO` (array readonly de 7 strings), o tipo `DadosFormulario` com as chaves `nome`, `cnpj`, `empresa`, `whatsapp`, `email`, `faturamento` (todas `string`), o tipo `ErrosFormulario` (`Partial<Record<keyof DadosFormulario, string>>`), e as funções `limpaCnpj(v: string): string`, `cnpjValido(v: string): boolean`, `limpaTelefone(v: string): string`, `whatsappValido(v: string): boolean`, `emailValido(v: string): boolean`, `validar(d: DadosFormulario): ErrosFormulario`. As Tasks 3 e 4 consomem tudo isso.

- [ ] **Step 1: Criar o módulo de validação**

Criar `web/src/lib/validacao.ts`. **Sem imports** — o script de verificação do Step 3 executa este arquivo direto pelo Node, e um import de alias `@/` quebraria isso:

```ts
/*
  Regras de validação compartilhadas entre o formulário (cliente) e a
  Server Action (servidor). O servidor revalida tudo do zero: validação
  no cliente é conveniência de UX, não segurança — qualquer um posta
  direto no endpoint.

  Este arquivo não importa nada de propósito, para poder ser executado
  diretamente pelo Node em scripts/verificar-validacao.ts.
*/

/** Copy do cliente. Verbatim: não reescrever, abreviar nem reordenar. */
export const FAIXAS_FATURAMENTO = [
  "Menos de 3 milhões por ano",
  "Entre 3 milhões e 9,6 milhões por ano",
  "Entre 9,6 milhões e 24 milhões por ano",
  "Entre 24 milhões e 60 milhões por ano",
  "Entre 60 milhões e 150 milhões por ano",
  "Entre 150 milhões e 300 milhões por ano",
  "Acima de 300 milhões",
] as const;

export interface DadosFormulario {
  nome: string;
  cnpj: string;
  empresa: string;
  whatsapp: string;
  email: string;
  faturamento: string;
}

export type ErrosFormulario = Partial<Record<keyof DadosFormulario, string>>;

/*
  CNPJ alfanumérico, em vigor desde 2026. Os doze primeiros caracteres
  podem ser letras ou dígitos; os dois últimos continuam numéricos.

  A conversão de caractere é o valor ASCII menos 48, então "0" vira 0,
  "9" vira 9 e "A" vira 17. Isso é o que mantém compatibilidade com o
  CNPJ puramente numérico: para um CNPJ só de dígitos, este algoritmo
  reduz exatamente ao clássico, e por isso os pesos abaixo são os mesmos
  de sempre. Ver a nota no plano sobre o que foi e o que não foi
  confirmado em fonte oficial.
*/
const PESOS_DV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_DV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function valorDoCaractere(c: string): number {
  return c.charCodeAt(0) - 48;
}

export function limpaCnpj(valor: string): string {
  return valor.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

function digitoVerificador(base: string, pesos: number[]): number {
  const soma = pesos.reduce(
    (acc, peso, i) => acc + valorDoCaractere(base[i]) * peso,
    0
  );
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cnpjValido(valor: string): boolean {
  const c = limpaCnpj(valor);
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(c)) return false;
  // Sequências de um caractere só passam no módulo 11 mas não existem.
  if (/^(.)\1{13}$/.test(c)) return false;
  if (digitoVerificador(c.slice(0, 12), PESOS_DV1) !== Number(c[12])) {
    return false;
  }
  return digitoVerificador(c.slice(0, 13), PESOS_DV2) === Number(c[13]);
}

export function limpaTelefone(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function whatsappValido(valor: string): boolean {
  const t = limpaTelefone(valor);
  if (t.length !== 10 && t.length !== 11) return false;
  const ddd = Number(t.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  // Celular com 11 dígitos sempre tem 9 depois do DDD.
  if (t.length === 11 && t[2] !== "9") return false;
  return true;
}

export function emailValido(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

export function validar(dados: DadosFormulario): ErrosFormulario {
  const erros: ErrosFormulario = {};

  if (dados.nome.trim().length < 2) {
    erros.nome = "Informe seu nome completo.";
  }
  if (!cnpjValido(dados.cnpj)) {
    erros.cnpj = "CNPJ inválido.";
  }
  if (dados.empresa.trim().length < 2) {
    erros.empresa = "Informe o nome da empresa.";
  }
  if (!whatsappValido(dados.whatsapp)) {
    erros.whatsapp = "Informe um WhatsApp com DDD.";
  }
  if (!emailValido(dados.email)) {
    erros.email = "Informe um e-mail válido.";
  }
  if (!(FAIXAS_FATURAMENTO as readonly string[]).includes(dados.faturamento)) {
    erros.faturamento = "Selecione uma faixa de faturamento.";
  }

  return erros;
}
```

- [ ] **Step 2: Criar o script de verificação**

Criar `web/scripts/verificar-validacao.ts`. Não é framework de teste: é um script Node que roda o módulo e imprime o que falhou.

```ts
/*
  Exercita o módulo de validação sem dependência nenhuma. O Node 24
  executa TypeScript nativamente, então isto roda com `node`.

  Rodar: npm run verificar
*/
import {
  cnpjValido,
  emailValido,
  validar,
  whatsappValido,
  FAIXAS_FATURAMENTO,
} from "../src/lib/validacao.ts";

const casos: Array<[string, boolean]> = [];
const checa = (nome: string, real: boolean, esperado: boolean) =>
  casos.push([nome, real === esperado]);

// CNPJ numérico conhecido como válido. Se este falhar, os pesos estão
// errados: o algoritmo alfanumérico tem que reduzir ao clássico.
checa("CNPJ numérico válido", cnpjValido("11.222.333/0001-81"), true);
checa("CNPJ numérico sem máscara", cnpjValido("11222333000181"), true);
checa("CNPJ com DV errado", cnpjValido("11222333000182"), false);
checa("CNPJ curto demais", cnpjValido("1122233300018"), false);
checa("CNPJ todo igual", cnpjValido("00000000000000"), false);
checa("CNPJ com letra no DV", cnpjValido("11222333000A81"), false);

checa("WhatsApp celular 11 dígitos", whatsappValido("(41) 99569-9494"), true);
checa("WhatsApp fixo 10 dígitos", whatsappValido("(41) 3569-9494"), true);
checa("WhatsApp com DDD inválido", whatsappValido("(01) 99569-9494"), false);
checa("WhatsApp curto", whatsappValido("99569949"), false);
checa("Celular sem o 9", whatsappValido("(41) 89569-9494"), false);

checa("E-mail válido", emailValido("rodrigo@metalurgica.com.br"), true);
checa("E-mail sem arroba", emailValido("rodrigo.metalurgica.com.br"), false);
checa("E-mail sem domínio", emailValido("rodrigo@"), false);

const completo = {
  nome: "Rodrigo Silva",
  cnpj: "11222333000181",
  empresa: "Metalúrgica Silva",
  whatsapp: "41995699494",
  email: "rodrigo@metalurgica.com.br",
  faturamento: FAIXAS_FATURAMENTO[2],
};
checa("Formulário completo sem erros", Object.keys(validar(completo)).length === 0, true);
checa(
  "Faturamento fora da lista é rejeitado",
  validar({ ...completo, faturamento: "Uns 5 milhões" }).faturamento !== undefined,
  true
);
checa(
  "Nome vazio é rejeitado",
  validar({ ...completo, nome: "   " }).nome !== undefined,
  true
);

const falhas = casos.filter(([, ok]) => !ok);
for (const [nome, ok] of casos) {
  console.log(`${ok ? "ok  " : "FALHOU"}  ${nome}`);
}
console.log(`\n${casos.length - falhas.length}/${casos.length} passaram`);
if (falhas.length > 0) process.exit(1);
```

- [ ] **Step 3: Adicionar o script ao package.json**

Em `web/package.json`, dentro de `"scripts"`:

```json
    "verificar": "node scripts/verificar-validacao.ts"
```

- [ ] **Step 4: Rodar a verificação**

```bash
cd web && npm run verificar
```

Esperado: todos os casos com `ok` e saída `17/17 passaram`.

**O caso decisivo é "CNPJ numérico válido".** Se ele falhar, os pesos estão errados — o algoritmo alfanumérico tem que reduzir exatamente ao clássico para CNPJ só de dígitos, então um CNPJ numérico conhecido é a prova de que a implementação está certa. Não ajuste o teste para passar: ajuste o algoritmo.

**Sobre o formato alfanumérico especificamente:** a conversão ASCII menos 48 e a regra do módulo 11 estão confirmadas em fonte oficial. Os arrays de peso não puderam ser lidos literalmente de documento oficial e foram derivados da compatibilidade com o formato numérico. **Antes de ir ao ar, valide um CNPJ alfanumérico real** contra um validador público ou contra o cliente, e registre o resultado. Se divergir, o conserto é nos arrays, e o caso numérico continua sendo a rede de proteção.

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/validacao.ts web/scripts/verificar-validacao.ts web/package.json
git commit -m "Adicionar modulo de validacao do formulario

Inclui CNPJ alfanumerico, em vigor desde 2026: os doze primeiros
caracteres podem ser letras. Um validador so de digitos rejeitaria
empresa recem-aberta, que e justamente quem mais precisa de antecipacao.

A conversao ASCII menos 48 e a regra do modulo 11 vem de fonte oficial.
Os pesos foram derivados da compatibilidade com o formato numerico: para
CNPJ so de digitos o algoritmo reduz ao classico, entao o caso numerico
do script de verificacao prova os pesos.

O script roda com node puro, sem framework de teste: o Node 24 executa
TypeScript nativamente."
```

---

## Task 2: Clientes de planilha e e-mail

**Files:**
- Modify: `web/package.json` (dependências)
- Create: `web/src/lib/planilha.ts`
- Create: `web/src/lib/email.ts`
- Create: `web/.env.example`

**Interfaces:**
- Consumes: o tipo `DadosFormulario` de `@/lib/validacao`.
- Produces: `gravarNaPlanilha(dados: DadosFormulario): Promise<void>` de `@/lib/planilha` e `enviarEmail(dados: DadosFormulario): Promise<void>` de `@/lib/email`. As duas lançam `Error` em falha; a Task 3 trata cada uma de forma diferente.

- [ ] **Step 1: Instalar as duas dependências**

```bash
cd web && npm install resend google-auth-library
```

**Não instale `googleapis`.** A chamada ao Sheets é `fetch` na API REST.

- [ ] **Step 2: Documentar as variáveis de ambiente**

**Antes de criar o arquivo:** o `.gitignore` do Next tem `.env*`, que engole `.env.example` também. Sem tratar isso, o `git add` do Step 7 falha em silêncio e o arquivo nunca entra no repositório. Adicione a negação em `web/.gitignore`, logo abaixo da linha `.env*`:

```
!.env.example
```

Confirme com `git check-ignore -v .env.example`, que deve deixar de casar.

Agora crie `web/.env.example`:

```bash
# Resend — chave da API e remetente verificado no domínio do cliente.
RESEND_API_KEY=
EMAIL_REMETENTE=

# Destinatários dos envios, separados por vírgula.
EMAILS_DESTINO=

# Service account do Google com permissão de edição na planilha.
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

# ID da planilha, o trecho entre /d/ e /edit na URL.
PLANILHA_ID=
```

`.env.local` já está no `.gitignore` do Next. **Nenhum valor real entra no repositório.**

- [ ] **Step 3: Cliente da planilha**

Criar `web/src/lib/planilha.ts`:

```ts
import { JWT } from "google-auth-library";

import type { DadosFormulario } from "@/lib/validacao";

/*
  Grava uma linha por envio via API REST do Sheets. Usa só a biblioteca
  de autenticação, não o pacote `googleapis` completo: seriam dezenas de
  megabytes para consumir um endpoint.
*/
function credenciais(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const chave = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !chave) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL ou GOOGLE_PRIVATE_KEY não configurada."
    );
  }

  return new JWT({
    email,
    // A chave vem da variável de ambiente com \n escapado.
    key: chave.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function gravarNaPlanilha(dados: DadosFormulario): Promise<void> {
  const planilhaId = process.env.PLANILHA_ID;
  if (!planilhaId) throw new Error("PLANILHA_ID não configurada.");

  const auth = credenciais();
  // getAccessToken() da google-auth-library devolve { token, res }, não
  // { access_token }. Trocar isso faz o Bearer virar "undefined" e o
  // Sheets responder 401 com mensagem que não aponta a causa.
  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("Não foi possível autenticar no Google.");

  const linha = [
    new Date().toISOString(),
    dados.nome,
    dados.cnpj,
    dados.empresa,
    dados.whatsapp,
    dados.email,
    dados.faturamento,
  ];

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${planilhaId}` +
    `/values/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [linha] }),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text();
    throw new Error(`Sheets respondeu ${resposta.status}: ${corpo}`);
  }
}
```

- [ ] **Step 4: Cliente de e-mail**

Criar `web/src/lib/email.ts`:

```ts
import { Resend } from "resend";

import type { DadosFormulario } from "@/lib/validacao";

/*
  Escapa HTML antes de interpolar. A validação NÃO protege aqui: `nome` e
  `empresa` não restringem caractere nenhum, e `cnpj` e `whatsapp` são
  validados numa cópia limpa enquanto o valor cru é o que vai no e-mail.
  Sem escapar, quem preenche o formulário controla o HTML que chega na
  caixa de quem lê o lead — vetor de phishing contra o time do cliente.

  O & vem primeiro de propósito: escapá-lo depois dos outros re-escaparia
  as entidades que acabaram de ser criadas.
*/
function escapaHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Lê uma variável de ambiente obrigatória, nomeando exatamente a que falta. */
function exigeEnv(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`${nome} não configurada.`);
  return valor;
}

const ROTULOS: Array<[keyof DadosFormulario, string]> = [
  ["nome", "Nome completo"],
  ["cnpj", "CNPJ"],
  ["empresa", "Empresa"],
  ["whatsapp", "WhatsApp"],
  ["email", "E-mail"],
  ["faturamento", "Faturamento anual"],
];

export async function enviarEmail(dados: DadosFormulario): Promise<void> {
  const chave = exigeEnv("RESEND_API_KEY");
  const remetente = exigeEnv("EMAIL_REMETENTE");
  const destino = exigeEnv("EMAILS_DESTINO");

  const linhas = ROTULOS.map(
    ([campo, rotulo]) =>
      `<p><strong>${rotulo}:</strong> ${escapaHtml(dados[campo])}</p>`
  ).join("\n");

  const resend = new Resend(chave);
  const { error } = await resend.emails.send({
    from: remetente,
    // filter(Boolean) descarta entrada vazia de vírgula sobrando na variável.
    to: destino
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean),
    subject: `Novo contato pelo site: ${dados.empresa}`,
    html: `<h2>Novo contato pelo site</h2>\n${linhas}`,
  });

  if (error) throw new Error(`Resend recusou o envio: ${error.message}`);
}
```

- [ ] **Step 5: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 6: Verificar o comportamento sem credenciais**

As credenciais reais são pendência do cliente e não existem ainda. O que **é** verificável agora é que a ausência delas produz erro claro em vez de falha silenciosa:

```bash
cd web && node --input-type=module -e "
const { gravarNaPlanilha } = await import('./src/lib/planilha.ts');
const { enviarEmail } = await import('./src/lib/email.ts');
const d = { nome:'x', cnpj:'x', empresa:'x', whatsapp:'x', email:'x', faturamento:'x' };
for (const [nome, fn] of [['planilha', gravarNaPlanilha], ['email', enviarEmail]]) {
  try { await fn(d); console.log(nome + ': NAO LANCOU (errado)'); }
  catch (e) { console.log(nome + ': ' + e.message); }
}
"
```

Esperado: as duas linhas citando qual variável falta, e nenhuma dizendo "NAO LANCOU".

- [ ] **Step 7: Commit**

```bash
git add web/package.json web/package-lock.json web/.gitignore web/src/lib/planilha.ts web/src/lib/email.ts web/.env.example
git commit -m "Adicionar clientes de planilha e e-mail

Sheets via API REST com google-auth-library, nao com o pacote googleapis
completo: seriam dezenas de megabytes para um endpoint.

As duas funcoes lancam erro nomeando a variavel de ambiente que falta, em
vez de falhar em silencio — as credenciais ainda sao pendencia do cliente
e o erro precisa dizer o que falta."
```

---

## Task 3: Server Action

**Files:**
- Create: `web/src/app/actions/enviar-formulario.ts`

**Interfaces:**
- Consumes: `validar`, `DadosFormulario`, `ErrosFormulario` de `@/lib/validacao`; `gravarNaPlanilha` de `@/lib/planilha`; `enviarEmail` de `@/lib/email`.
- Produces: `enviarFormulario(_estadoAnterior: EstadoEnvio, formData: FormData): Promise<EstadoEnvio>` e o tipo `EstadoEnvio`, ambos exportados. A Task 4 consome os dois via `useActionState`.

- [ ] **Step 1: Criar a action**

Criar `web/src/app/actions/enviar-formulario.ts`:

```ts
"use server";

import { enviarEmail } from "@/lib/email";
import { gravarNaPlanilha } from "@/lib/planilha";
import { validar, type DadosFormulario, type ErrosFormulario } from "@/lib/validacao";

export type EstadoEnvio =
  | { status: "inicial" }
  | { status: "erro"; erros: ErrosFormulario; mensagem?: string }
  | { status: "sucesso" };

/** Envio em menos disto é bot: humano não preenche seis campos tão rápido. */
const SEGUNDOS_MINIMOS = 3;

export async function enviarFormulario(
  _estadoAnterior: EstadoEnvio,
  formData: FormData
): Promise<EstadoEnvio> {
  /*
    Honeypot: campo escondido de humanos. Se veio preenchido, é bot.
    Responde sucesso de propósito — bot que descobre que falhou ajusta e
    volta.
  */
  if (String(formData.get("apelido") ?? "").length > 0) {
    return { status: "sucesso" };
  }

  // Armadilha de tempo. Não é limite de taxa: limite real exigiria estado
  // compartilhado entre instâncias serverless. Segura bot de varredura,
  // que é a ameaça realista aqui.
  const renderizadoEm = Number(formData.get("renderizadoEm"));
  const decorrido = (Date.now() - renderizadoEm) / 1000;
  if (!Number.isFinite(renderizadoEm) || decorrido < SEGUNDOS_MINIMOS) {
    return { status: "sucesso" };
  }

  const dados: DadosFormulario = {
    nome: String(formData.get("nome") ?? "").trim(),
    cnpj: String(formData.get("cnpj") ?? "").trim(),
    empresa: String(formData.get("empresa") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    faturamento: String(formData.get("faturamento") ?? "").trim(),
  };

  // Revalidação completa. O cliente já validou, mas qualquer um posta
  // direto neste endpoint.
  const erros = validar(dados);
  if (Object.keys(erros).length > 0) {
    return { status: "erro", erros };
  }

  /*
    A planilha vem primeiro de propósito: é o registro durável. Se o
    e-mail falhar depois, o lead não se perde.
  */
  try {
    await gravarNaPlanilha(dados);
  } catch (e) {
    console.error("Falha ao gravar na planilha:", e);
    return {
      status: "erro",
      erros: {},
      mensagem:
        "Não conseguimos registrar seus dados agora. Fale com a gente pelo WhatsApp, que respondemos na hora.",
    };
  }

  try {
    await enviarEmail(dados);
  } catch (e) {
    // O lead já está na planilha. Falhar aqui não é motivo para dizer ao
    // usuário que deu errado.
    console.error("Falha ao enviar o e-mail do formulário:", e);
  }

  return { status: "sucesso" };
}
```

- [ ] **Step 2: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 3: Commit**

```bash
git add web/src/app/actions/enviar-formulario.ts
git commit -m "Adicionar Server Action do formulario

Grava na planilha antes de enviar o e-mail, de proposito: se o e-mail
falhar o lead nao se perde, e a falha vai para o log em vez de virar erro
para o usuario. Se a planilha falhar, a mensagem manda a pessoa para o
WhatsApp, que e um caminho que funciona e nao depende disto.

Honeypot responde sucesso: bot que descobre que falhou ajusta e volta."
```

---

## Task 4: A seção do formulário

**Files:**
- Create: `web/src/components/formulario.tsx`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Consumes: `enviarFormulario` e `EstadoEnvio` de `@/app/actions/enviar-formulario`; `FAIXAS_FATURAMENTO` de `@/lib/validacao`; `buttonVariants` de `@/components/ui/button`; `cn` de `@/lib/utils`; `Reveal` de `@/components/motion/reveal`.
- Produces: componente `Formulario()` sem props, âncora `#formulario`.

- [ ] **Step 1: Criar a seção**

Criar `web/src/components/formulario.tsx`. É Client Component: usa `useActionState` e estado de formulário.

```tsx
"use client";

import { useActionState, useId, useRef } from "react";

import {
  enviarFormulario,
  type EstadoEnvio,
} from "@/app/actions/enviar-formulario";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { FAIXAS_FATURAMENTO } from "@/lib/validacao";
import { cn } from "@/lib/utils";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", auto: "name" },
  { nome: "cnpj", rotulo: "CNPJ", tipo: "text", auto: "off" },
  { nome: "empresa", rotulo: "Nome da empresa", tipo: "text", auto: "organization" },
  { nome: "whatsapp", rotulo: "WhatsApp", tipo: "tel", auto: "tel" },
  { nome: "email", rotulo: "E-mail", tipo: "email", auto: "email" },
] as const;

const ESTADO_INICIAL: EstadoEnvio = { status: "inicial" };

export function Formulario() {
  const [estado, acao, enviando] = useActionState(
    enviarFormulario,
    ESTADO_INICIAL
  );
  const idBase = useId();
  // Marca quando o formulário apareceu, para a armadilha de tempo do servidor.
  const renderizadoEm = useRef(Date.now());

  const erros = estado.status === "erro" ? estado.erros : {};

  return (
    <section id="formulario" className="surface-wash-down">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-16">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-heading text-h2 text-center font-bold text-navy">
              Comece por aqui
            </h2>
            <p className="text-body mx-auto mt-5 max-w-[68ch] text-center font-light text-navy/70">
              Preencha os dados da sua empresa e a gente retorna com o que é
              possível fazer.
            </p>

            <form action={acao} className="mt-10 flex flex-col gap-5">
              <input
                type="hidden"
                name="renderizadoEm"
                value={renderizadoEm.current}
              />
              {/* Honeypot. Escondido de humanos, visível para bot. */}
              <input
                type="text"
                name="apelido"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {CAMPOS.map((campo) => {
                const erro = erros[campo.nome];
                const idErro = `${idBase}-${campo.nome}-erro`;
                return (
                  <div key={campo.nome} className="flex flex-col gap-2">
                    <label
                      htmlFor={`${idBase}-${campo.nome}`}
                      className="text-caption font-bold tracking-wide text-navy uppercase"
                    >
                      {campo.rotulo}
                    </label>
                    <input
                      id={`${idBase}-${campo.nome}`}
                      name={campo.nome}
                      type={campo.tipo}
                      autoComplete={campo.auto}
                      required
                      aria-invalid={erro ? true : undefined}
                      aria-describedby={erro ? idErro : undefined}
                      className={cn(
                        "text-body rounded-2xl border bg-white px-5 py-3.5 text-navy outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        erro ? "border-gold-dark" : "border-navy/15"
                      )}
                    />
                    {erro ? (
                      <p id={idErro} className="text-caption text-gold-dark">
                        {erro}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${idBase}-faturamento`}
                  className="text-caption font-bold tracking-wide text-navy uppercase"
                >
                  Faturamento anual
                </label>
                <select
                  id={`${idBase}-faturamento`}
                  name="faturamento"
                  required
                  defaultValue=""
                  aria-invalid={erros.faturamento ? true : undefined}
                  aria-describedby={
                    erros.faturamento ? `${idBase}-faturamento-erro` : undefined
                  }
                  className={cn(
                    "text-body rounded-2xl border bg-white px-5 py-3.5 text-navy outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    erros.faturamento ? "border-gold-dark" : "border-navy/15"
                  )}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {FAIXAS_FATURAMENTO.map((faixa) => (
                    <option key={faixa} value={faixa}>
                      {faixa}
                    </option>
                  ))}
                </select>
                {erros.faturamento ? (
                  <p
                    id={`${idBase}-faturamento-erro`}
                    className="text-caption text-gold-dark"
                  >
                    {erros.faturamento}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={enviando}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "text-caption mt-2 h-auto rounded-full bg-gold px-9 py-4 font-bold tracking-wider text-navy uppercase hover:bg-gold-light disabled:opacity-60"
                )}
              >
                {enviando ? "Enviando..." : "Quero uma análise"}
              </button>

              <p className="text-micro text-center text-navy/65">
                Seus dados são usados apenas para o contato comercial da Celer
                Capital e não são compartilhados com terceiros.
              </p>

              <p aria-live="polite" className="text-body text-center">
                {estado.status === "sucesso" ? (
                  <span className="font-bold text-navy">
                    Recebemos seus dados. Entraremos em contato em breve.
                  </span>
                ) : null}
                {estado.status === "erro" && estado.mensagem ? (
                  <span className="text-gold-dark">{estado.mensagem}</span>
                ) : null}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Inserir na página**

Em `web/src/app/page.tsx`, adicionar o import e o elemento entre `<Atendimento />` e `<CtaFinal />`:

```tsx
import { Formulario } from "@/components/formulario";
```

```tsx
        <Atendimento />
        <Formulario />
        <CtaFinal />
```

A alternância do wash fecha sozinha: Atendimento é `surface-wash-up` e termina em branco, o Formulário é `surface-wash-down` e começa em branco.

- [ ] **Step 3: Verificar tipos e lint**

```bash
cd web && npx tsc --noEmit && npx eslint .
```

Esperado: os dois sem saída.

- [ ] **Step 4: Verificar a estrutura no navegador**

Subir o preview (`preview_start` com `{name: "web-dev"}`) e rodar:

```js
(() => {
  const s = document.getElementById("formulario");
  const campos = [...s.querySelectorAll("input[name], select[name]")].map((c) => ({
    nome: c.name,
    obrigatorio: c.required,
    temLabel: !!s.querySelector(`label[for="${c.id}"]`),
  }));
  const opcoes = [...s.querySelectorAll("select option")].map((o) => o.value).filter(Boolean);
  const d = document.documentElement;
  return JSON.stringify({
    ordem: [...document.querySelectorAll("main section")].map((x) => x.id || "(hero)"),
    campos,
    qtdOpcoes: opcoes.length,
    opcoes,
    honeypotEscondido: (() => {
      const h = s.querySelector('input[name="apelido"]');
      const r = h.getBoundingClientRect();
      return r.left < -1000 || r.width === 0;
    })(),
    overflow: d.scrollWidth > d.clientWidth,
  }, null, 1);
})();
```

Esperado: `formulario` entre `atendimento` e `cta-final`; seis campos, todos com `obrigatorio: true` e `temLabel: true`, mais o honeypot; `qtdOpcoes: 7` com as sete faixas exatamente como estão no spec; `honeypotEscondido: true`; `overflow: false`.

Depois em 375px, recarregando antes de medir: `overflow: false`.

- [ ] **Step 5: Verificar que o servidor rejeita o que o cliente aceitaria**

O `required` do navegador é conveniência de UX, não segurança: ele só impede o envio pela UI. O que precisa ser provado é que **a action rejeita sozinha**, mesmo quando a validação do navegador é contornada.

Desligue a validação nativa e preencha com valores inválidos, tudo por script:

```js
(() => {
  const form = document.querySelector("#formulario form");
  form.noValidate = true;

  const invalidos = {
    nome: "x",                      // curto demais
    cnpj: "11222333000199",         // dígito verificador errado
    empresa: "x",                   // curto demais
    whatsapp: "123",                // curto demais
    email: "sem-arroba",            // sem @
    faturamento: "Uns 5 milhões",   // fora da lista das sete faixas
  };

  for (const [nome, valor] of Object.entries(invalidos)) {
    const campo = form.elements.namedItem(nome);
    // O select rejeita valor fora das options, então injeta uma.
    if (campo.tagName === "SELECT") {
      const op = document.createElement("option");
      op.value = valor;
      campo.appendChild(op);
    }
    campo.value = valor;
  }

  form.requestSubmit();
  return "enviado, aguarde a resposta do servidor";
})();
```

Espere a resposta e leia os erros que voltaram:

```js
JSON.stringify(
  [...document.querySelectorAll("#formulario [id$='-erro']")].map((e) => ({
    campo: e.id,
    mensagem: e.textContent,
  })),
  null,
  1
);
```

Esperado: **seis mensagens de erro**, uma por campo. Se vier menos de seis, algum campo está passando pela validação do servidor e isso é falha da tarefa. Registre no relatório as seis mensagens literais.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/formulario.tsx web/src/app/page.tsx
git commit -m "Adicionar secao de formulario acima do CTA Final

Wash em down para fechar a alternancia com o Atendimento, que termina em
branco.

Honeypot posicionado fora da tela em vez de display:none: leitor de tela
ignora por aria-hidden e tabIndex -1, e bot que filtra display:none nao
identifica o campo."
```

---

## Task 5: Manual de marca

**Files:**
- Modify: `docs/brand-guidelines.md`

**Interfaces:**
- Consumes: as decisões implementadas nas Tasks 1 a 4.
- Produces: nada em código.

- [ ] **Step 1: Registrar a exceção**

O manual proíbe formulário em dois lugares. Localize os dois:

```bash
grep -n -i "formul" docs/brand-guidelines.md
```

**A regra do checklist ("CTA final sempre aponta para WhatsApp, nunca formulário") continua verdadeira e não muda:** o CTA Final segue sendo o WhatsApp, e o formulário é uma seção separada acima dele.

**A regra da tabela de tom da seção 2 ("convite de baixo atrito, sem formulário") muda.** Substitua a célula por uma que reflita os dois caminhos, e acrescente logo abaixo da tabela:

```markdown
**Dois caminhos de conversão (2026-08-05).** O site passou a ter um formulário de captação qualificada, na seção `#formulario`, logo acima do CTA Final. Ele coleta nome, CNPJ, empresa, WhatsApp, e-mail e faixa de faturamento anual, todos obrigatórios.

Isso muda a regra de "convite de baixo atrito, sem formulário" que valia até aqui. O raciocínio original, ancorado na persona (Rodrigo, 46, dono de metalúrgica, que desconfia de processo lento), era que atrito baixo converte melhor nesse público — e seis campos obrigatórios são atrito alto.

A mudança é deliberada e do cliente: a faixa de faturamento qualifica o lead antes do primeiro contato. **O caminho de baixo atrito não foi removido:** o CTA Final em WhatsApp continua logo abaixo, para quem não quiser preencher. Quem for medir conversão deve comparar os dois, não só o formulário.
```

- [ ] **Step 2: Registrar o aviso de privacidade**

Na seção 7, no checklist de Copy:

```markdown
- [ ] Formulário com aviso de uso dos dados visível abaixo do botão. **Pendência conhecida:** o site não tem página de política de privacidade. O aviso curto foi decisão consciente do cliente em 2026-08-05, ciente de que compliance provavelmente pedirá política completa, base legal declarada e política de retenção
```

- [ ] **Step 3: Verificar a consistência**

Reler as seções 2 e 7 procurando qualquer outra afirmação de que o site converte só por WhatsApp.

- [ ] **Step 4: Commit**

```bash
git add docs/brand-guidelines.md
git commit -m "Registrar no manual a excecao da regra de formulario

A regra do checklist sobrevive: o CTA final continua sendo WhatsApp e o
formulario fica acima dele. A da tabela de tom muda de fato, e fica
registrada como decisao do cliente em vez de contrariada em silencio."
```

---

## Verificação final (depois da Task 5)

- [ ] **Build de produção**

```bash
cd web && npm run build
```

Esperado: compila sem erro. **A página `/` deixa de ser estática** e passa a ser dinâmica ou a conter uma Server Action — isso é esperado e não é regressão.

- [ ] **Script de validação**

```bash
cd web && npm run verificar
```

Esperado: todos os casos passando.

- [ ] **Ordem, wash e responsivo**

Seções em `hero, processo, sobre, numeros, valores, solucoes, atendimento, formulario, cta-final`. Cada seção clara terminando na cor em que a próxima começa. Sem overflow horizontal em 375px, 885px e 1440px.

- [ ] **Acessibilidade do formulário**

Percorrer todos os campos por Tab, confirmando que cada um tem rótulo associado, que o erro é anunciado por `aria-describedby`, e que a mensagem de resultado está numa live region.

- [ ] **Contraste**

Texto navy sobre o wash claro, e a mensagem de erro em `gold-dark` sobre branco. **Tailwind v4 emite cores em `oklab()`** — converter para sRGB antes de compor alpha; regex ingênua sobre a string de `getComputedStyle` produz lixo.

- [ ] **Console limpo de erros novos**

Existe um aviso conhecido e pré-existente de serialização RSC vindo do acordeão de Valores, documentado em `docs/superpowers/specs/2026-07-31-gradientes-sobre-valores-design.md`. Esse é esperado. Qualquer erro **novo** é achado.

**Limitações conhecidas do ambiente:** o painel do navegador não compõe frames, então `IntersectionObserver` não dispara e blocos em `Reveal` ficam em `opacity: 0`; transições CSS não avançam; screenshots falham. Ao mudar viewport, recarregar antes de medir.

## Pendências que travam a publicação

Nenhuma está com quem implementa. O código funciona sem elas, mas o formulário **não deve ir ao ar** antes de resolvidas:

1. **Quais e-mails recebem** os envios — preencher `EMAILS_DESTINO`
2. **De qual conta Google** é a planilha, criação da service account e compartilhamento com ela
3. **Acesso ao DNS de `celercapital.com.br`** para verificar o domínio no Resend. Sem isso o e-mail sai, mas cai em spam com frequência
4. **Validar um CNPJ alfanumérico real** contra validador público ou contra o cliente, confirmando os pesos derivados na Task 1
