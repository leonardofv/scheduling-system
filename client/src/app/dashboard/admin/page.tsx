"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  CircleCheck,
  Users,
  User as UserIcon,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { formatDateBR } from "../../../lib/format";
import { getStatusColor, getStatusLabel } from "../../../lib/appointments";
import type { Appointment } from "../../../types/appointment";
import type { User } from "../../../types/user";

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
      try {
        const [apptRes, usersRes, doctorsRes, specialtiesRes] = await Promise.all([
          apiFetch("/api/agendamentos?page=1&per_page=100"),
          apiFetch("/api/users"),
          apiFetch("/api/medicos"),
          apiFetch("/api/especialidades"),
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
      icon: <CalendarDays className="w-5 h-5" />,
      href: "/dashboard/admin/appointments",
    },
    {
      label: "Pendentes",
      value: stats.pending,
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="w-5 h-5" />,
      href: "/dashboard/admin/appointments?status=pendente",
    },
    {
      label: "Confirmados",
      value: stats.confirmed,
      color: "bg-emerald-100 text-emerald-700",
      icon: <CircleCheck className="w-5 h-5" />,
      href: "/dashboard/admin/appointments?status=confirmado",
    },
    {
      label: "Usuários",
      value: stats.totalUsers,
      color: "bg-violet-100 text-violet-700",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/admin/users",
    },
    {
      label: "Médicos",
      value: stats.totalDoctors,
      color: "bg-cyan-100 text-cyan-700",
      icon: <UserIcon className="w-5 h-5" />,
      href: "/dashboard/admin/doctors",
    },
    {
      label: "Especialidades",
      value: stats.totalSpecialties,
      color: "bg-orange-100 text-orange-700",
      icon: <Stethoscope className="w-5 h-5" />,
      href: "/dashboard/admin/specialties",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-800 mt-1">Visão geral do sistema de agendamentos</p>
      </div>

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
                    <td className="py-3 px-2 text-gray-800">{formatDateBR(appt.date)}</td>
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

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => router.push("/dashboard/admin/appointments")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CircleCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Confirmar agendamentos</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/doctors")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar médicos</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/specialties")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar especialidades</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/admin/users")}
            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Gerenciar usuários</span>
          </button>
        </div>
      </div>
    </div>
  );
}
