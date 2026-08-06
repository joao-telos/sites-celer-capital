import { Resend } from "resend";

import type { DadosFormulario } from "@/lib/validacao";

const ROTULOS: Array<[keyof DadosFormulario, string]> = [
  ["nome", "Nome completo"],
  ["cnpj", "CNPJ"],
  ["empresa", "Empresa"],
  ["whatsapp", "WhatsApp"],
  ["email", "E-mail"],
  ["faturamento", "Faturamento anual"],
];

export async function enviarEmail(dados: DadosFormulario): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  const remetente = process.env.EMAIL_REMETENTE;
  const destino = process.env.EMAILS_DESTINO;

  if (!chave || !remetente || !destino) {
    throw new Error(
      "RESEND_API_KEY, EMAIL_REMETENTE ou EMAILS_DESTINO não configurada."
    );
  }

  const linhas = ROTULOS.map(
    ([campo, rotulo]) => `<p><strong>${rotulo}:</strong> ${dados[campo]}</p>`
  ).join("\n");

  const resend = new Resend(chave);
  const { error } = await resend.emails.send({
    from: remetente,
    to: destino.split(",").map((e) => e.trim()),
    subject: `Novo contato pelo site: ${dados.empresa}`,
    html: `<h2>Novo contato pelo site</h2>\n${linhas}`,
  });

  if (error) throw new Error(`Resend recusou o envio: ${error.message}`);
}
