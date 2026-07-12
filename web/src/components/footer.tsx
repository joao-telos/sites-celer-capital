export function Footer() {
  return (
    <footer className="border-t border-navy/8 px-6 py-7 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-[10px] leading-[1.7] tracking-wide text-navy/65">
          © {new Date().getFullYear()} Celer Capital · Todos os direitos
          reservados
          <br />
          {/* TODO: confirmar CNPJ real com o cliente antes de publicar */}
          CNPJ XX.XXX.XXX/0001-XX
          {/* TODO: confirmar com o cliente se há registro regulatório específico a declarar (ex: CVM) antes de afirmar qualquer status regulatório publicamente */}
        </p>
        <p className="font-heading text-[13px] text-gold-dark italic">
          &ldquo;Conectando Valor, Crescendo Juntos&rdquo;
        </p>
      </div>
    </footer>
  );
}
