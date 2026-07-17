"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Appointment {
  id: number;
  tipo: string;
  date: string;
  time: string;
  status: string;
  medico?: { nome: string; especialidade?: { nome: string } } | null;
  exame?: { nome: string } | null;
  forma_pagamento: string;
}

interface User {
  name: string;
  email: string;
}

const quickLinks = [
  {
    title: "Agendamentos",
    description: "Consulte seus horários e acompanhe cada atendimento.",
    href: "/dashboard/appointments",
    color: "bg-blue-100 text-blue-700",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Serviços",
    description: "Encontre consultas, exames e especialidades disponíveis.",
    href: "/dashboard/services",
    color: "bg-emerald-100 text-emerald-700",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "confirmado":
      return "bg-emerald-100 text-emerald-700";
    case "pendente":
      return "bg-yellow-100 text-yellow-700";
    case "cancelado":
      return "bg-red-100 text-red-700";
    case "falta":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "confirmado": return "Confirmado";
    case "pendente": return "Pendente";
    case "cancelado": return "Cancelado";
    case "falta": return "Falta";
    default: return status;
  }
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function FeedbackSection() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitted(true);
    setText("");
  }

  if (submitted) {
    return (
      <section className="rounded-2xl border border-emerald-300 p-7 shadow-sm sm:p-17">
        <p className="text-sm font-semibold text-emerald-700">DEIXE AQUI SEU FEEDBACK</p>
        <h2 className="mt-3 text-lg font-bold text-emerald-700">Obrigado pelo seu feedback!</h2>
        <p className="mt-1 text-sm text-emerald-700">Sua opinião é muito importante para nós.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-semibold text-emerald-700 underline hover:text-emerald-300"
        >
          Enviar outro
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-300 p-7 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-emerald-700">DEIXE AQUI SEU FEEDBACK</p>
      <h2 className="mt-1 text-2xl font-bold text-gray-900"></h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Escreva seu feedback aqui..."
          className="w-full resize-none rounded-lg border border-emerald-300 px-4 py-3 text-sm text-emerald-700 placeholder-emerald-700 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-50"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const base = process.env.NEXT_PUBLIC_API_URL;

      try {
        const [userRes, apptRes] = await Promise.all([
          fetch(`${base}/api/user`, { headers }),
          fetch(`${base}/api/agendamentos`, { headers }),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (apptRes.ok) {
          const data = await apptRes.json();
          setAppointments(data.data ?? data);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const pending = appointments.filter((a) => a.status === "pendente");
  const confirmed = appointments.filter((a) => a.status === "confirmado");
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments
    .filter((a) => a.date >= today && a.status !== "cancelado")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const firstName = user?.name?.split(" ")[0] ?? "usuário";

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-linear-to-br bg-emerald-700 rounded-2xl p-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white border-red-700 mb-2">
            {getGreeting()}, {loading ? "..." : firstName}!
          </h2>
          <p className="text-white mb-6">
            Gerencie seus agendamentos de forma fácil e prática. Veja abaixo um resumo da sua conta.
          </p>
          <button
            onClick={() => router.push("/dashboard/appointments")}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
          >
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl border border-emerald-300 ">
        <StatCard
          label="Total"
          value={appointments.length}
          color="bg-blue-200 text-blue-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          label="Pendentes"
          value={pending.length}
          color="bg-yellow-200 text-yellow-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Confirmados"
          value={confirmed.length}
          color="bg-emerald-200 text-emerald-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Próximos"
          value={upcoming.length}
          color="bg-violet-200 text-violet-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
      </div>

      {/* Layout: quickLinks + conteúdo */}
      <section className="grid gap-6 xl:grid-cols-12 xl:items-start">
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
                    <span className="text-lg text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600">→</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-gray-600">{link.description}</p>
                </div>
              </div>
            </button>
          ))}

        {/* Feedback section */}
          <FeedbackSection />
        </aside>

        <div className="space-y-6 xl:col-span-8">
          {/* Próximos Agendamentos */}
          <section className="rounded-2xl border border-emerald-300 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-emerald-700">AGENDAMENTOS</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">Próximas consultas</h2>
              </div>
              <button
                onClick={() => router.push("/dashboard/appointments")}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Ver todos →
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              </div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mb-4">Nenhum agendamento futuro.</p>
                <button
                  onClick={() => router.push("/dashboard/appointments")}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Criar agendamento
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 5).map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <span className="text-xs font-bold leading-none">{formatDate(appt.date).slice(0, 2)}</span>
                      <span className="text-[10px] font-medium leading-none mt-0.5">{formatDate(appt.date).slice(3, 5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {appt.tipo === "exame" ? appt.exame?.nome ?? "Exame" : appt.medico?.nome ?? "Consulta"}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(appt.status)}`}>
                          {getStatusLabel(appt.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {appt.time?.slice(0, 5)}
                        {appt.medico?.especialidade?.nome && ` · ${appt.medico.especialidade.nome}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Como funciona */}
          <section className="rounded-2xl border border-emerald-300 bg-white p-7 shadow-sm sm:p-10.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">COMO FUNCIONA</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">Uma rotina de cuidado mais leve</h2>
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 sm:flex">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {[
                ["1", "Escolha o serviço", "Consulte especialidades, médicos e exames disponíveis."],
                ["2", "Faça seu agendamento", "Escolha o melhor horário e confirme em poucos cliques."],
                ["3", "Acompanhe seus cuidados", "Mantenha seu histórico organizado sempre que precisar."],
              ].map(([step, title, description]) => (
                <div key={step} className="rounded-xl bg-gray-50 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{step}</span>
                  <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Ajuda */}
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-300 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
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
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
