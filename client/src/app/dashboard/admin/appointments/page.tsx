"use client";

import { useState, useEffect } from "react";

interface Appointment {
  id: number;
  tipo: string;
  date: string;
  time: string;
  status: string;
  forma_pagamento: string;
  observation: string | null;
  user?: { name: string; email: string } | null;
  medico?: { nome: string; crm: string; especialidade?: { nome: string } } | null;
  exame?: { nome: string; valor: string } | null;
  healthPlan?: { nome: string } | null;
}

type ActionType = "confirm" | "no-show" | "cancel" | "delete" | null;

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const base = process.env.NEXT_PUBLIC_API_URL;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  async function loadAppointments() {
    setLoading(true);
    try {
      let url = `${base}/api/agendamentos?page=${page}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.data ?? data);
        if (data.meta) {
          setLastPage(data.meta.last_page);
        }
      }
    } catch {
      setError("Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadAppointments();
  }, [token, page]);

  function openActionModal(appointment: Appointment, action: ActionType) {
    setSelectedAppointment(appointment);
    setActionType(action);
    setActionError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedAppointment(null);
    setActionType(null);
    setActionError(null);
  }

  async function handleAction() {
    if (!selectedAppointment || !actionType) return;
    setProcessing(true);
    setActionError(null);

    try {
      let res;

      switch (actionType) {
        case "confirm":
          res = await fetch(`${base}/api/agendamentos/${selectedAppointment.id}/confirm`, {
            method: "PATCH",
            headers,
          });
          break;
        case "no-show":
          res = await fetch(`${base}/api/agendamentos/${selectedAppointment.id}/no-show`, {
            method: "PATCH",
            headers,
          });
          break;
        case "cancel":
          res = await fetch(`${base}/api/agendamentos/${selectedAppointment.id}/cancel`, {
            method: "PATCH",
            headers,
          });
          break;
        case "delete":
          res = await fetch(`${base}/api/agendamentos/${selectedAppointment.id}`, {
            method: "DELETE",
            headers,
          });
          break;
        default:
          return;
      }

      if (res && res.ok) {
        closeModal();
        loadAppointments();
      } else {
        const err = res ? await res.json() : { message: "Erro desconhecido" };
        setActionError(err.message || "Erro ao processar ação.");
      }
    } catch {
      setActionError("Erro de conexão.");
    } finally {
      setProcessing(false);
    }
  }

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

  function getTipoLabel(tipo: string) {
    switch (tipo) {
      case "consulta": return "Consulta";
      case "retorno": return "Retorno";
      case "exame": return "Exame";
      default: return tipo;
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  const q = search.toLowerCase();
  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.user?.name?.toLowerCase().includes(q) ||
      a.user?.email?.toLowerCase().includes(q) ||
      a.medico?.nome?.toLowerCase().includes(q) ||
      a.exame?.nome?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Agendamentos</h1>
        <p className="text-gray-800 mt-1">Confirme, marque falta, cancele ou exclua agendamentos</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por paciente, médico ou exame..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="falta">Falta</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Paciente</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Tipo</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Médico/Exame</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Data</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Horário</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-800">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-700">
                    {search || statusFilter ? "Nenhum agendamento encontrado para essa busca." : "Nenhum agendamento cadastrado."}
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-medium text-gray-900">{appt.user?.name ?? "—"}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize">{getTipoLabel(appt.tipo)}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-800">
                      {appt.medico?.nome ?? appt.exame?.nome ?? "—"}
                    </td>
                    <td className="py-3 px-3 text-gray-800">{formatDate(appt.date)}</td>
                    <td className="py-3 px-3 text-gray-800">{appt.time?.slice(0, 5)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appt.status)}`}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {appt.status === "pendente" && (
                          <button
                            onClick={() => openActionModal(appt, "confirm")}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {appt.status === "confirmado" && (
                          <button
                            onClick={() => openActionModal(appt, "no-show")}
                            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Falta
                          </button>
                        )}
                        {(appt.status === "pendente" || appt.status === "confirmado") && (
                          <button
                            onClick={() => openActionModal(appt, "cancel")}
                            className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => openActionModal(appt, "delete")}
                          className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!search && lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-800">
            Página {page} de {lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page >= lastPage}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Action Modal */}
      {modalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
              actionType === "confirm" ? "bg-emerald-100" : "bg-red-100"
            }`}>
              {actionType === "confirm" ? (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0V9m0 4v2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5" />
                </svg>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {actionType === "confirm" && "Confirmar agendamento?"}
              {actionType === "no-show" && "Marcar como falta?"}
              {actionType === "cancel" && "Cancelar agendamento?"}
              {actionType === "delete" && "Excluir agendamento?"}
            </h3>

            <p className="text-sm text-gray-800 text-center mb-4">
              {selectedAppointment.user?.name && <><strong>{selectedAppointment.user.name}</strong><br /></>}
              {getTipoLabel(selectedAppointment.tipo)} — {formatDate(selectedAppointment.date)} às {selectedAppointment.time?.slice(0, 5)}
            </p>

            {actionError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 mb-4">{actionError}</div>
            )}

            <p className="text-xs text-gray-700 text-center mb-6">
              {actionType === "confirm" && "O paciente será notificado da confirmação."}
              {actionType === "no-show" && "O paciente não compareceu ao horário agendado."}
              {actionType === "cancel" && "O agendamento será cancelado."}
              {actionType === "delete" && "Esta ação não poderá ser desfeita."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${
                  actionType === "confirm"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
