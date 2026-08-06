"use server";

import { enviarEmail } from "@/lib/email";
import { gravarNaPlanilha } from "@/lib/planilha";
import { validar, type DadosFormulario, type ErrosFormulario } from "@/lib/validacao";

export type EstadoEnvio =
  | { status: "inicial" }
  | {
      status: "erro";
      erros: ErrosFormulario;
      valores: DadosFormulario;
      mensagem?: string;
    }
  | { status: "sucesso" };

export async function enviarFormulario(
  _estadoAnterior: EstadoEnvio,
  formData: FormData
): Promise<EstadoEnvio> {
  /*
    Só o honeypot. Uma armadilha de tempo baseada em Date.now() do
    navegador foi removida em 2026-08-06: ela comparava o relógio do
    cliente com o do servidor, então qualquer aparelho adiantado tinha o
    envio descartado em silêncio, com mensagem de sucesso. Perder lead
    legítimo é pior que deixar passar bot.
  */
  if (String(formData.get("apelido") ?? "").length > 0) {
    console.warn("Envio descartado pelo honeypot.");
    return { status: "sucesso" };
  }

  /*
    `formData.get` devolve string ou File. Um File passaria por String()
    virando "[object File]", que escaparia da checagem de comprimento do
    nome e sujaria a planilha. Só string interessa aqui.
  */
  const texto = (campo: string): string => {
    const valor = formData.get(campo);
    return typeof valor === "string" ? valor.trim() : "";
  };

  const dados: DadosFormulario = {
    nome: texto("nome"),
    cnpj: texto("cnpj"),
    empresa: texto("empresa"),
    whatsapp: texto("whatsapp"),
    email: texto("email"),
    faturamento: texto("faturamento"),
  };

  // Revalidação completa. O cliente já validou, mas qualquer um posta
  // direto neste endpoint.
  const erros = validar(dados);
  if (Object.keys(erros).length > 0) {
    return { status: "erro", erros, valores: dados };
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
      valores: dados,
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
