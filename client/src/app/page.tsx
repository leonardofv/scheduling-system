"use client";
import { useState } from "react";
import Footer from "../components/dashboard/Footer";
import AuthDialog, { type AuthMode } from "../components/auth/AuthDialog";

const vantagens = [
  {
    titulo: "Agendamento Rápido",
    descricao:
      "Marque consultas e exames em poucos cliques, sem filas ou burocracia.",
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
    titulo: "Histórico Centralizado",
    descricao:
      "Todo o seu histórico de atendimentos organizado em um único lugar.",
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
    titulo: "Lembretes Inteligentes",
    descricao:
      "Receba notificações e evite esquecimentos nos seus agendamentos.",
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
    titulo: "Equipe Dedicada",
    descricao:
      "Suporte humanizado para orientar você em cada etapa do cuidado.",
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

const depoimentos = [
  {
    nome: "Maria Oliveira",
    texto:
      "O AgendaFácil transformou minha rotina de cuidados. Consigo agendar tudo sem sair de casa e nunca mais perdi uma consulta.",
    nota: 5,
  },
  {
    nome: "Carlos Mendes",
    texto:
      "Simples, rápido e intuitivo. Recomendo para todos que buscam praticidade na hora de marcar exames e consultas.",
    nota: 5,
  },
  {
    nome: "Ana Beatriz",
    texto:
      "Finalmente um sistema que organiza tudo direitinho. O histórico de atendimentos me ajuda muito a acompanhar minha saúde.",
    nota: 5,
  },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">AgendaFácil</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth("login")}
                className="text-sm font-semibold text-white hover:text-emerald-100 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuth("register")}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Cadastrar-se
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 mb-6 ring-1 ring-white/20">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Agende sua saúde com{" "}
              <span className="text-emerald-300">praticidade</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100 max-w-xl">
              O AgendaFácil conecta você aos serviços de saúde de forma simples
              e segura. Marque consultas, acompanhe seu histórico e cuide-se sem
              complicação.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => openAuth("register")}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
              >
                Criar conta gratuita
              </button>
              <button
                onClick={() => openAuth("login")}
                className="rounded-lg border border-emerald-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Já tenho conta
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-emerald-700">SOBRE NÓS</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
              Transformando o agendamento de saúde
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              O <strong className="text-gray-900">AgendaFácil</strong> nasceu da
              necessidade de tornar o agendamento de serviços de saúde mais
              acessível e organizado. Sabemos como pode ser frustrante enfrentar
              filas, papéis e telefonemas sem fim para marcar uma simples
              consulta.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Nossa missão é oferecer uma plataforma intuitiva que conecte
              pacientes aos profissionais de saúde, centralizando todo o
              processo em poucos cliques. Acreditamos que cuidar da saúde deve
              ser simples, não mais uma fonte de estresse.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-emerald-700">VANTAGENS</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
              Por que escolher o AgendaFácil?
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Uma plataforma pensada para simplificar sua jornada de cuidados.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {vantagens.map((v) => (
              <div
                key={v.titulo}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  {v.icone}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {v.titulo}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {v.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-800 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-white">DEPOIMENTOS</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {depoimentos.map((d) => (
              <div
                key={d.nome}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-emerald-500 mb-4">
                  {Array.from({ length: d.nota }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-600 italic">
                  &ldquo;{d.texto}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {d.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {d.nome}
                    </p>
                    <p className="text-xs text-gray-500">Paciente</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {authOpen && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </div>
  );
}
