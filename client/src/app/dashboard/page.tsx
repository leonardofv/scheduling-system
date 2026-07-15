 "use client";

import { useRouter } from "next/navigation";

const quickLinks = [
  {
    title: "Agendamentos",
    description: "Consulte seus horários e acompanhe cada atendimento.",
    href: "/dashboard/appointments",
    color: "bg-blue-100 text-blue-700",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Serviços",
    description: "Encontre consultas, exames e especialidades disponíveis.",
    href: "/dashboard/services",
    color: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Relatórios",
    description: "Acompanhe o histórico e a organização dos seus cuidados.",
    href: "/dashboard/reports",
    color: "bg-violet-100 text-violet-700",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 002 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
        {/* Hero Section */}
        <div id="inicio" className="bg-gradient-to-br from-blue-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Dashboard!
            </h2>
            <p className="text-gray-600 mb-6">
              Gerencie seus agendamentos de forma fácil e prática. Veja abaixo as principais funcionalidades.
            </p>
            <button className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
              Novo Agendamento
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div id="secoes" className="grid grid-cols-1 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center mb-2">Agendamentos</h3>
            <p className="text-sm text-gray-600 flex items-center justify-center mb-4">Visualize e gerencie todos os seus agendamentos.</p>
            <button
              onClick={() => router.push("/dashboard/appointments")}
              className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Ver meus agendamentos
            </button>
            <button
              onClick={() => router.push("/dashboard/services")}
              className="rounded-lg border border-emerald-200 bg-white/80 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Conhecer serviços
            </button>
          </div>
        </div>
      </section>

      <section id="secoes" className="grid gap-6 xl:grid-cols-12 xl:items-start">
        <aside className="space-y-4 xl:col-span-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">ACESSO RÁPIDO</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">Tudo ao seu alcance</h2>
          </div>

          {quickLinks.map((link) => (
            <button
              key={link.title}
              onClick={() => router.push(link.href)}
              className="group w-full rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${link.color}`}>
                  {link.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">{link.title}</h3>
                    <span className="text-lg text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" aria-hidden="true">→</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-gray-600">{link.description}</p>
                </div>
              </div>
            </button>
          ))}
        </aside>

        <div className="space-y-6 xl:col-span-8">
          <section className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-300">PRÓXIMO PASSO</p>
                <h2 className="mt-2 text-2xl font-bold">Planeje sua próxima visita</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-300">
                  Consulte os serviços disponíveis antes de agendar. Você terá mais clareza para escolher o atendimento certo.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/services")}
                className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Explorar serviços
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">COMO FUNCIONA</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">Uma rotina de cuidado mais leve</h2>
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 sm:flex" aria-hidden="true">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {[
                ["1", "Escolha o serviço", "Confira consultas, especialidades e exames disponíveis."],
                ["2", "Acompanhe seus horários", "Tenha seus agendamentos organizados em um único lugar."],
                ["3", "Cuide-se com tranquilidade", "Mantenha seu histórico acessível sempre que precisar."],
              ].map(([step, title, description]) => (
                <div key={step} className="rounded-xl bg-gray-50 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{step}</span>
                  <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm" aria-hidden="true">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Precisa de ajuda?</h2>
                <p className="mt-1 text-sm text-gray-600">Nossa equipe está pronta para orientar você sobre seus atendimentos.</p>
              </div>
            </div>
            <a href="mailto:suporte@agendafacil.com" className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">
              Falar com o suporte
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}
