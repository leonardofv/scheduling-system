"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
        {/* Hero Section */}
        <div id="inicio" className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Dashboard!
            </h2>
            <p className="text-gray-600 mb-6">
              Gerencie seus agendamentos de forma fácil e prática. Veja abaixo as principais funcionalidades.
            </p>
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Novo Agendamento
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div id="secoes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Agendamentos</h3>
            <p className="text-sm text-gray-600 mb-4">Visualize e gerencie todos os seus agendamentos.</p>
            <button
              onClick={() => router.push("/dashboard/appointments")}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Ver mais →
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços</h3>
            <p className="text-sm text-gray-600 mb-4">Confira os serviços disponíveis para agendamento.</p>
            <button
              onClick={() => router.push("/dashboard/services")}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Ver mais →
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
            <p className="text-sm text-gray-600 mb-4">Análise dos seus agendamentos em gráficos e tabelas.</p>
            <button
              onClick={() => router.push("/dashboard/reports")}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Ver mais →
            </button>
          </div>
        </div>
    </div>
  );
}
