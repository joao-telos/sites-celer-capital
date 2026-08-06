import { JWT } from "google-auth-library";

import { limpaCnpj, limpaTelefone, type DadosFormulario } from "@/lib/validacao";

/** Lê uma variável de ambiente obrigatória, nomeando exatamente a que falta. */
function exigeEnv(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`${nome} não configurada.`);
  return valor;
}

/*
  Grava uma linha por envio via API REST do Sheets. Usa só a biblioteca
  de autenticação, não o pacote `googleapis` completo: seriam dezenas de
  megabytes para consumir um endpoint.
*/
function credenciais(): JWT {
  const email = exigeEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const chave = exigeEnv("GOOGLE_PRIVATE_KEY");

  return new JWT({
    email,
    // A chave vem da variável de ambiente com \n escapado.
    key: chave.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function gravarNaPlanilha(dados: DadosFormulario): Promise<void> {
  const planilhaId = exigeEnv("PLANILHA_ID");

  const auth = credenciais();
  // getAccessToken() da google-auth-library devolve { token, res }, não
  // { access_token }. Trocar isso faz o Bearer virar "undefined" e o
  // Sheets responder 401 com mensagem que não aponta a causa.
  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("Não foi possível autenticar no Google.");

  const linha = [
    new Date().toISOString(),
    dados.nome,
    limpaCnpj(dados.cnpj),
    dados.empresa,
    limpaTelefone(dados.whatsapp),
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
