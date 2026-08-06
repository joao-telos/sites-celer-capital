"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  enviarFormulario,
  type EstadoEnvio,
} from "@/app/actions/enviar-formulario";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  FAIXAS_FATURAMENTO,
  limpaCnpj,
  limpaTelefone,
  validar,
  type DadosFormulario,
  type ErrosFormulario,
} from "@/lib/validacao";
import { cn } from "@/lib/utils";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", auto: "name" },
  { nome: "cnpj", rotulo: "CNPJ", tipo: "text", auto: "off" },
  { nome: "empresa", rotulo: "Nome da empresa", tipo: "text", auto: "organization" },
  { nome: "whatsapp", rotulo: "WhatsApp", tipo: "tel", auto: "tel" },
  { nome: "email", rotulo: "E-mail", tipo: "email", auto: "email" },
] as const;

const ORDEM_CAMPOS: Array<keyof DadosFormulario> = [
  "nome",
  "cnpj",
  "empresa",
  "whatsapp",
  "email",
  "faturamento",
];

const VALORES_INICIAIS: DadosFormulario = {
  nome: "",
  cnpj: "",
  empresa: "",
  whatsapp: "",
  email: "",
  faturamento: "",
};

const ESTADO_INICIAL: EstadoEnvio = { status: "inicial" };

/*
  Máscara por posição, não por classe de dígito: desde 2026 o CNPJ é
  alfanumérico nos doze primeiros caracteres, então não dá para assumir
  que só números aparecem ali.
*/
function formataCnpj(limpo: string): string {
  let saida = "";
  for (let i = 0; i < limpo.length; i++) {
    if (i === 2 || i === 5) saida += ".";
    if (i === 8) saida += "/";
    if (i === 12) saida += "-";
    saida += limpo[i];
  }
  return saida;
}

/** (00) 00000-0000 para celular (11 dígitos); (00) 0000-0000 para fixo (10). */
function formataTelefone(limpo: string): string {
  if (limpo.length === 0) return "";
  const ddd = limpo.slice(0, 2);
  if (limpo.length <= 2) return `(${ddd}`;
  const resto = limpo.slice(2);
  const primeiraLargura = limpo.length > 10 ? 5 : 4;
  const primeira = resto.slice(0, primeiraLargura);
  const segunda = resto.slice(primeiraLargura);
  return segunda ? `(${ddd}) ${primeira}-${segunda}` : `(${ddd}) ${primeira}`;
}

/*
  Se vier com +55 na frente (comum ao colar um número direto do WhatsApp),
  remove o DDI antes de aplicar o teto de 11 dígitos. Só trata como DDI
  quando o limpo tem 12 ou 13 dígitos e começa com "55": um DDD real —
  inclusive o DDD 55, do Rio Grande do Sul — nunca produz sozinho um limpo
  de 12 ou 13 dígitos, então não há colisão possível. Sem essa remoção, o
  corte de 11 dígitos cortava dentro do número em vez de cortar o DDI,
  aceitando em silêncio um número diferente do que a pessoa colou.
*/
function normalizaWhatsapp(bruto: string): string {
  let limpo = limpaTelefone(bruto);
  if ((limpo.length === 12 || limpo.length === 13) && limpo.startsWith("55")) {
    limpo = limpo.slice(2);
  }
  if (limpo.length > 11) {
    // Não trunca dado real: deixa passar como está para `validar` rejeitar.
    return limpo;
  }
  return formataTelefone(limpo);
}

/*
  Tentativa de preservar o caret em edição no meio do campo (contar
  caracteres significativos antes do caret e recolocá-lo com
  requestAnimationFrame após a máscara reescrever o valor) foi feita e
  descartada em 2026-08-06: sob digitação rápida, o rAF de uma tecla podia
  disparar depois que teclas seguintes já tinham mudado o valor, colapsando
  uma seleção no momento errado e duplicando o texto digitado. Um caret que
  pula para o fim em edição no meio do campo é um incômodo Minor; texto
  duplicado é pior. Ver PR/relatório de 2026-08-06 para o histórico.
*/

export function Formulario() {
  const [estado, acao, enviando] = useActionState(
    enviarFormulario,
    ESTADO_INICIAL
  );
  const idBase = useId();

  const valoresIniciais =
    estado.status === "erro" ? estado.valores : VALORES_INICIAIS;
  const [valores, setValores] = useState<DadosFormulario>(valoresIniciais);
  const [errosCliente, setErrosCliente] = useState<ErrosFormulario>({});
  const refsCampos = useRef<
    Partial<Record<keyof DadosFormulario, HTMLInputElement | HTMLSelectElement | null>>
  >({});
  const resultadoRef = useRef<HTMLParagraphElement>(null);

  /*
    Os campos de texto são controlados e sobrevivem ao reset automático de
    <form action> do React 19 (ele mexe no DOM, não no estado do React). O
    <select>, porém, não: form.reset() reposiciona um <select> pelo atributo
    HTML `selected` de cada <option> (que o React nunca escreve para um
    select controlado), então ele volta à primeira opção mesmo com o estado
    do React intacto — daí a correção imperativa no efeito abaixo, que roda
    depois do reset nativo.

    A cada resposta nova do servidor também sincronizamos `valores` com
    `estado.valores` (defesa a mais) e zeramos as sobreposições de validação
    do cliente, para não mascarar um erro novo do servidor com um "válido"
    obtido antes da última submissão. Ajuste de estado durante a
    renderização (não em efeito) é o padrão recomendado pelo React para
    "sincronizar com uma prop que mudou".
  */
  const [estadoAnterior, setEstadoAnterior] = useState(estado);
  if (estado !== estadoAnterior) {
    setEstadoAnterior(estado);
    if (estado.status === "erro") {
      setValores(estado.valores);
      setErrosCliente({});
    }
  }

  const errosServidor = estado.status === "erro" ? estado.erros : {};
  // Erro do servidor é a base; validação de blur no cliente sobrepõe campo a
  // campo assim que o usuário sai de um campo específico.
  const erros: ErrosFormulario = { ...errosServidor, ...errosCliente };

  useEffect(() => {
    if (estado.status === "erro") {
      // Corrige o <select> que form.reset() reposicionou (ver comentário
      // acima). Os campos de texto já estão certos, mas reforçar todos não
      // tem custo e blinda contra qualquer navegador que se comporte
      // diferente.
      for (const campo of ORDEM_CAMPOS) {
        const elemento = refsCampos.current[campo];
        if (elemento) elemento.value = estado.valores[campo];
      }
      const primeiroCampoComErro = ORDEM_CAMPOS.find(
        (campo) => estado.erros[campo]
      );
      if (primeiroCampoComErro) {
        refsCampos.current[primeiroCampoComErro]?.focus();
      } else {
        resultadoRef.current?.focus();
      }
    } else if (estado.status === "sucesso") {
      resultadoRef.current?.focus();
    }
  }, [estado]);

  const validarCampo = (campo: keyof DadosFormulario, atual: DadosFormulario) => {
    const resultado = validar(atual);
    setErrosCliente((prev) => ({ ...prev, [campo]: resultado[campo] }));
  };

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

            {estado.status === "sucesso" ? (
              <p
                ref={resultadoRef}
                tabIndex={-1}
                aria-live="polite"
                className="text-body mt-10 text-center font-bold text-navy outline-none"
              >
                Recebemos seus dados. Entraremos em contato em breve.
              </p>
            ) : (
              <form action={acao} className="mt-10 flex flex-col gap-5">
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
                  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
                    let valor = e.target.value;
                    if (campo.nome === "cnpj") {
                      valor = formataCnpj(limpaCnpj(valor).slice(0, 14));
                    } else if (campo.nome === "whatsapp") {
                      valor = normalizaWhatsapp(valor);
                    }
                    setValores((v) => ({ ...v, [campo.nome]: valor }));
                  };
                  const onBlur = () => {
                    validarCampo(campo.nome, { ...valores });
                  };
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
                        value={valores[campo.nome]}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={(el) => {
                          refsCampos.current[campo.nome] = el;
                        }}
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
                    value={valores.faturamento}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setValores((v) => ({ ...v, faturamento: valor }));
                    }}
                    onBlur={() => validarCampo("faturamento", { ...valores })}
                    ref={(el) => {
                      refsCampos.current.faturamento = el;
                    }}
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
                  Seus dados são usados apenas para o contato comercial da
                  Celer Capital e ficam registrados em serviços de planilha e
                  e-mail para essa finalidade.
                </p>

                <p
                  ref={resultadoRef}
                  tabIndex={-1}
                  aria-live="polite"
                  className="text-body text-center outline-none"
                >
                  {estado.status === "erro" && estado.mensagem ? (
                    <span className="text-gold-dark">{estado.mensagem}</span>
                  ) : null}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
