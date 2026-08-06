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

  /*
    Number(null) é 0, não NaN — pegadilha clássica de coerção do JS. Se o
    campo vier ausente ou vazio, um Number() direto daria 0, o decorrido
    viraria a hora Unix atual em segundos, e a submissão passaria como se
    fosse humano lento. Isso liberaria justamente o bot mais comum: o que
    raspa os nomes dos campos e posta sem executar JS nenhum.
  */
  const bruto = formData.get("renderizadoEm");
  const renderizadoEm =
    typeof bruto === "string" && bruto.trim() !== "" ? Number(bruto) : NaN;
  const decorrido = (Date.now() - renderizadoEm) / 1000;
  if (!Number.isFinite(renderizadoEm) || decorrido < SEGUNDOS_MINIMOS) {
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
