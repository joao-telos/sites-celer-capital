export function Footer() {
  return (
    <footer className="border-t border-navy/8 px-6 py-7 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] leading-[1.7] tracking-wide text-navy/65">
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
