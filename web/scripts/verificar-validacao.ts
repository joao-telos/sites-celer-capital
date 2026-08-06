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
