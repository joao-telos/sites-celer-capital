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
