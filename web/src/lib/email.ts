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
export function escapaHtml(valor: string): string {
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
    subject: `Novo contato pelo site: ${dados.empresa.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
    html: `<h2>Novo contato pelo site</h2>\n${linhas}`,
  });

  if (error) throw new Error(`Resend recusou o envio: ${error.message}`);
}
