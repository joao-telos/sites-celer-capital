/*
  A folga de baixo é maior que a de cima por causa do botão flutuante de
  WhatsApp. Ele é `fixed`, então mora no canto inferior direito da viewport
  e não sai de lá: com `py-7` nos dois lados, o botão cobria o texto do
  rodapé exatamente quando a pessoa rola até o fim para ler o CNPJ. Medido
  em 375px: o botão ia de y 732 a 788 e o texto de 754 a 784. `pb-28`
  (112px) limpa os 80px que o botão ocupa no celular e os 88px do desktop.
*/
export function Footer() {
  return (
    <footer className="border-t border-navy/8 px-6 pt-7 pb-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-micro tracking-wide text-navy/65">
          © {new Date().getFullYear()} Celer Capital · Todos os direitos
          reservados
          <br />
          CNPJ 28.857.128/0001-95
          {/* TODO: confirmar com o cliente se há registro regulatório específico a declarar (ex: CVM) antes de afirmar qualquer status regulatório publicamente */}
        </p>
      </div>
    </footer>
  );
}
