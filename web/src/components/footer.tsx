export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-navy px-6 py-7 sm:px-10 lg:px-16">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-[10px] leading-[1.7] tracking-wide text-white/30">
          © {new Date().getFullYear()} Celer Capital · Todos os direitos
          reservados
          <br />
          {/* TODO: confirmar CNPJ real com o cliente antes de publicar */}
          CNPJ XX.XXX.XXX/0001-XX
          {/* TODO: confirmar com o cliente se há registro regulatório específico a declarar (ex: CVM) antes de afirmar qualquer status regulatório publicamente */}
        </p>
        <p className="font-heading text-[13px] text-gold/60 italic">
          &ldquo;Conectando Valor, Crescendo Juntos&rdquo;
        </p>
      </div>
    </footer>
  );
}
