const passos = [
  {
    n: "01",
    titulo: "Agendamento em segundos",
    texto: "Consultas e exames marcados em poucos cliques, sem ligação, fila ou papel.",
    icone: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    n: "02",
    titulo: "Histórico centralizado",
    texto: "Atendimentos, exames e prescrições de toda a família em um único prontuário.",
    icone: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    n: "03",
    titulo: "Confirmação automática",
    texto: "Lembretes com reagendamento em um toque. Menos faltas.",
    icone: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
  {
    n: "04",
    titulo: "Recepção por perto",
    texto: "Dúvidas sobre preparo ou convênio? Fale com a recepção pelo portal ou por telefone.",
    icone: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-emerald-700">COMO FUNCIONA</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Como funciona para o paciente
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo) => (
            <article
              key={passo.n}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  {passo.icone}
                </div>
                <span className="text-sm font-semibold tracking-widest text-gray-400">
                  {passo.n}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {passo.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {passo.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
