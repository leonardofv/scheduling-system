"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { formatDateBR, toLocalISODate } from "../../lib/format";
import { getStatusColor, getStatusLabel } from "../../lib/appointments";
import type { Appointment } from "../../types/appointment";

interface User {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setError(null);
      try {
        const [userRes, apptRes] = await Promise.all([
          apiFetch("/api/user"),
          apiFetch("/api/agendamentos?all=1"),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (apptRes.ok) {
          const data = await apptRes.json();
          setAppointments(data.data ?? data);
        } else {
          setError("Erro ao carregar agendamentos.");
        }
      } catch {
        setError("Erro ao carregar os dados da sua conta.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const pending = appointments.filter((a) => a.status === "pendente");
  const confirmed = appointments.filter((a) => a.status === "confirmado");
  const today = toLocalISODate(new Date());
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
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 rounded-2xl p-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {loading ? "..." : firstName}!
          </h2>
          <p className="text-white mb-6">
            Gerencie seus agendamentos de forma fácil e prática. Veja abaixo um resumo da sua conta.
          </p>
          <button
            onClick={() => router.push("/dashboard/appointments/new")}
            className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl">
        <StatCard
          label="Total"
          value={appointments.length}
          loading={loading}
          color="bg-blue-200 text-blue-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          label="Pendentes"
          value={pending.length}
          loading={loading}
          color="bg-yellow-200 text-yellow-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Confirmados"
          value={confirmed.length}
          loading={loading}
          color="bg-emerald-200 text-emerald-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Próximos"
          value={upcoming.length}
          loading={loading}
          color="bg-violet-200 text-violet-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
      </div>

      <section className="grid gap-6 xl:items-start">
        <div className="space-y-6">
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
                  onClick={() => router.push("/dashboard/appointments/new")}
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
                      <span className="text-xs font-bold leading-none">{formatDateBR(appt.date).slice(0, 2)}</span>
                      <span className="text-[10px] font-medium leading-none mt-0.5">{formatDateBR(appt.date).slice(3, 5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {appt.tipo === "exame" ? appt.exam?.nome ?? "Exame" : appt.doctor?.nome ?? "Consulta"}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(appt.status)}`}>
                          {getStatusLabel(appt.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {appt.time?.slice(0, 5)}
                        {appt.doctor?.specialty?.nome && ` · ${appt.doctor.specialty.nome}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Precisa de ajuda?</h2>
            <p className="mt-1 text-sm text-gray-600">Nossa equipe está pronta para orientar você sobre seus atendimentos.</p>
          </div>
        </div>
        <a href="#" className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
          Falar com o suporte
        </a>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
  loading,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        {loading ? (
          <span className="h-8 w-10 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
