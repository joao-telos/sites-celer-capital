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
