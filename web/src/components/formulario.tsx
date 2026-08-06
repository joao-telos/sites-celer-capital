"use client";

import { useActionState, useId, useState } from "react";

import {
  enviarFormulario,
  type EstadoEnvio,
} from "@/app/actions/enviar-formulario";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { FAIXAS_FATURAMENTO } from "@/lib/validacao";
import { cn } from "@/lib/utils";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", auto: "name" },
  { nome: "cnpj", rotulo: "CNPJ", tipo: "text", auto: "off" },
  { nome: "empresa", rotulo: "Nome da empresa", tipo: "text", auto: "organization" },
  { nome: "whatsapp", rotulo: "WhatsApp", tipo: "tel", auto: "tel" },
  { nome: "email", rotulo: "E-mail", tipo: "email", auto: "email" },
] as const;

const ESTADO_INICIAL: EstadoEnvio = { status: "inicial" };

export function Formulario() {
  const [estado, acao, enviando] = useActionState(
    enviarFormulario,
    ESTADO_INICIAL
  );
  const idBase = useId();
  // Marca quando o formulário apareceu, para a armadilha de tempo do servidor.
  // Inicializador preguiçoso: roda uma única vez, na primeira renderização.
  const [renderizadoEm] = useState(() => Date.now());

  const erros = estado.status === "erro" ? estado.erros : {};

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

            <form action={acao} className="mt-10 flex flex-col gap-5">
              <input
                type="hidden"
                name="renderizadoEm"
                value={renderizadoEm}
              />
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
                  defaultValue=""
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
                Seus dados são usados apenas para o contato comercial da Celer
                Capital e não são compartilhados com terceiros.
              </p>

              <p aria-live="polite" className="text-body text-center">
                {estado.status === "sucesso" ? (
                  <span className="font-bold text-navy">
                    Recebemos seus dados. Entraremos em contato em breve.
                  </span>
                ) : null}
                {estado.status === "erro" && estado.mensagem ? (
                  <span className="text-gold-dark">{estado.mensagem}</span>
                ) : null}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
