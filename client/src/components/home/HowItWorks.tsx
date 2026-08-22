import { Zap, FileText, Bell, Users } from "lucide-react";

const passos = [
  {
    n: "01",
    titulo: "Agendamento em segundos",
    texto: "Consultas e exames marcados em poucos cliques, sem ligação, fila ou papel.",
    icone: <Zap className="h-6 w-6" />,
  },
  {
    n: "02",
    titulo: "Histórico centralizado",
    texto: "Atendimentos, exames e prescrições de toda a família em um único prontuário.",
    icone: <FileText className="h-6 w-6" />,
  },
  {
    n: "03",
    titulo: "Confirmação automática",
    texto: "Lembretes com reagendamento em um toque. Menos faltas.",
    icone: <Bell className="h-6 w-6" />,
  },
  {
    n: "04",
    titulo: "Recepção por perto",
    texto: "Dúvidas sobre preparo ou convênio? Fale com a recepção pelo portal ou por telefone.",
    icone: <Users className="h-6 w-6" />,
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
