import { CountingNumber } from "@/components/ui/counting-number";
import { Reveal } from "@/components/motion/reveal";
import { NUMEROS_BOX_GRADIENT } from "@/components/ui/gradient-background";

/*
  Dados institucionais fornecidos pelo cliente em 2026-08-01. Verbatim:
  nenhum destes números pode ser arredondado, estimado ou "melhorado".

  O card do bilhão conta de 0 a 1, então a animação nele é praticamente
  imperceptível — decisão consciente, registrada no spec. A alternativa
  seria inventar uma escala falsa (contar até 1000 e chamar de milhões),
  que seria pior.
*/
const NUMEROS = [
  {
    prefixo: "",
    target: 30,
    sufixo: "+",
    label: "anos de experiência no mercado de recebíveis",
  },
  {
    prefixo: "",
    target: 9,
    sufixo: "",
    label: "anos de empresa",
  },
  {
    prefixo: "R$ ",
    target: 1,
    sufixo: " bi+",
    label: "antecipado em 9 anos de operação",
  },
  {
    prefixo: "",
    target: 100,
    sufixo: "+",
    label: "empresas parceiras atendidas",
  },
];

/*
  Todo texto aqui é text-navy sem opacidade. Sobre o gradiente dourado,
  branco reprova nos dois extremos (3,1:1 e 2,0:1) e navy com opacidade
  escorrega (text-navy/80 cai para 4,31:1 na ponta escura).
*/
export function Numeros() {
  return (
    <section id="numeros" className="surface-wash-down">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
        {/* Sem título visível: a referência do cliente não tem um, e a seção
            funciona como faixa de dados. O sr-only mantém o landmark. */}
        <h2 className="sr-only">Celer Capital em números</h2>

        <Reveal>
          <div
            className="rounded-[2rem] px-8 py-12 sm:px-12 lg:px-16 lg:py-16"
            style={{ background: NUMEROS_BOX_GRADIENT }}
          >
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {NUMEROS.map((item) => (
                <div key={item.label} className="text-center">
                  <dt className="font-heading text-4xl leading-none font-bold text-navy sm:text-5xl">
                    {item.prefixo}
                    <CountingNumber target={item.target} />
                    {item.sufixo}
                  </dt>
                  <dd className="mt-3 text-sm leading-[1.5] font-light text-navy">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
