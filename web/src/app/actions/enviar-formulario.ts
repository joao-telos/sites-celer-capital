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
