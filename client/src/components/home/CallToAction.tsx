"use client";

type CallToActionProps = {
  onAgendar: () => void;
  onEntrar: () => void;
};

export default function CallToAction({ onAgendar, onEntrar }: CallToActionProps) {
  return (
    <section className="bg-emerald-900 py-16 text-white sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            A próxima consulta pode ser marcada agora
          </h2>
          <p className="mt-3 text-emerald-100">
            Já é paciente? Entre com seu e-mail. Primeira vez na clínica? Faça o
            cadastro em um minuto.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 lg:shrink-0">
          <button
            onClick={onAgendar}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Agendar consulta
          </button>
          <button
            onClick={onEntrar}
            className="rounded-lg border border-emerald-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Entrar
          </button>
        </div>
      </div>
    </section>
  );
}
