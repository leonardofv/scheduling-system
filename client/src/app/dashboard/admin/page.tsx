"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Appointment {
  id: number;
  tipo: string;
  date: string;
  time: string;
  status: string;
  user?: { name: string; email: string };
  medico?: { nome: string; especialidade?: { nome: string } } | null;
  exame?: { nome: string } | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pending: 0,
    confirmed: 0,
    totalUsers: 0,
    totalDoctors: 0,
    totalSpecialties: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const base = process.env.NEXT_PUBLIC_API_URL;

      try {
        const [apptRes, usersRes, doctorsRes, specialtiesRes] = await Promise.all([
          fetch(`${base}/api/agendamentos?page=1&per_page=100`, { headers }),
          fetch(`${base}/api/users`, { headers }),
          fetch(`${base}/api/medicos`, { headers }),
          fetch(`${base}/api/especialidades`, { headers }),
        ]);

        let appointments: Appointment[] = [];
        if (apptRes.ok) {
          const data = await apptRes.json();
          appointments = data.data ?? data;
        }

        let users: User[] = [];
        if (usersRes.ok) {
          const data = await usersRes.json();
          users = data.data ?? data;
        }

        let doctors: any[] = [];
        if (doctorsRes.ok) {
          const data = await doctorsRes.json();
          doctors = data.data ?? data;
        }

        let specialties: any[] = [];
        if (specialtiesRes.ok) {
          const data = await specialtiesRes.json();
          specialties = data.data ?? data;
        }

        setStats({
          totalAppointments: appointments.length,
          pending: appointments.filter((a) => a.status === "pendente").length,
          confirmed: appointments.filter((a) => a.status === "confirmado").length,
          totalUsers: users.length,
          totalDoctors: doctors.length,
          totalSpecialties: specialties.length,
        });

        setRecentAppointments(
          appointments
            .sort((a, b) => b.id - a.id)
            .slice(0, 5)
        );
      } catch {
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmado": return "bg-emerald-100 text-emerald-700";
      case "pendente": return "bg-yellow-100 text-yellow-700";
      case "cancelado": return "bg-red-100 text-red-700";
      case "falta": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">Erro ao carregar dados</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Agendamentos",
      value: stats.totalAppointments,
      color: "bg-blue-100 text-blue-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: "/dashboard/admin/appointments",
    },
    {
      label: "Pendentes",
      value: stats.pending,
      color: "bg-yellow-100 text-yellow-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/dashboard/admin/appointments?status=pendente",
    },
    {
      label: "Confirmados",
      value: stats.confirmed,
      color: "bg-emerald-100 text-emerald-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/dashboard/admin/appointments?status=confirmado",
    },
    {
      label: "Usuários",
      value: stats.totalUsers,
      color: "bg-violet-100 text-violet-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: "/dashboard/admin/users",
    },
    {
      label: "Médicos",
      value: stats.totalDoctors,
      color: "bg-cyan-100 text-cyan-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: "/dashboard/admin/doctors",
    },
    {
      label: "Especialidades",
      value: stats.totalSpecialties,
      color: "bg-orange-100 text-orange-700",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      href: "/dashboard/admin/specialties",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-800 mt-1">Visão geral do sistema de agendamentos</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => router.push(card.href)}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.color} mb-3`}>
              {card.icon}
            </div>
            <span className="text-2xl font-bold text-gray-900">{card.value}</span>
            <p className="text-sm font-medium text-gray-800 mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Agendamentos Recentes</h2>
            <p className="text-sm text-gray-700">Últimos 5 agendamentos cadastrados</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/admin/appointments")}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Ver todos →
          </button>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-700">
            Nenhum agendamento encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Paciente</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Data</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Horário</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appt) => (
                  <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">
                      {appt.user?.name ?? "—"}
                    </td>
                    <td className="py-3 px-2 text-gray-800 capitalize">{appt.tipo}</td>
                    <td className="py-3 px-2 text-gray-800">{formatDate(appt.date)}</td>
                    <td className="py-3 px-2 text-gray-800">{appt.time?.slice(0, 5)}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appt.status)}`}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => router.push("/dashboard/admin/appointments")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Confirmar agendamentos</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/doctors")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar médicos</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/specialties")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar especialidades</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/users")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar usuários</span>
          </button>
        </div>
      </div>
    </div>
  );
}
