"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import AppointmentModal, { type AppointmentEditPayload } from "../../../components/dashboard/AppointmentModal";
import { apiFetch } from "../../../lib/api";
import { formatDateBR } from "../../../lib/format";
import { getPaymentLabel, getStatusColor, getStatusLabel, getTipoLabel } from "../../../lib/appointments";
import type { Appointment } from "../../../types/appointment";

type ModalMode = "edit" | "cancel" | null;

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null as ModalMode,
    appointment: null as Appointment | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadAppointments() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/agendamentos?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.data ?? data);
        if (data.meta) {
          setLastPage(data.meta.last_page);
        }
      } else {
        setError("Erro ao carregar agendamentos.");
      }
    } catch {
      setError("Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function openEditModal(appointment: Appointment) {
    setActionError(null);
    setModalState({ isOpen: true, mode: "edit", appointment });
  }

  function openCancelModal(appointment: Appointment) {
    setActionError(null);
    setModalState({ isOpen: true, mode: "cancel", appointment });
  }

  function closeModal() {
    setModalState({ isOpen: false, mode: null, appointment: null });
    setActionError(null);
  }

  async function handleConfirm(data?: AppointmentEditPayload) {
    if (!modalState.appointment) return;
    setIsLoading(true);
    setActionError(null);

    try {
      if (modalState.mode === "cancel") {
        const res = await apiFetch(`/api/agendamentos/${modalState.appointment.id}/cancel`, {
          method: "PATCH",
        });

        if (res.ok) {
          closeModal();
          loadAppointments();
        } else {
          const err = await res.json().catch(() => null);
          setActionError(err?.message || "Erro ao cancelar agendamento.");
        }
      } else if (modalState.mode === "edit") {
        const payload: Record<string, unknown> = { observation: data?.observation ?? "" };
        if (data?.date) payload.date = data.date;
        if (data?.time) payload.time = data.time;

        const res = await apiFetch(`/api/agendamentos/${modalState.appointment.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          closeModal();
          loadAppointments();
        } else {
          const err = await res.json().catch(() => null);
          setActionError(err?.message || "Erro ao atualizar agendamento.");
        }
      }
    } catch {
      setActionError("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie todos os seus agendamentos</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/appointments/new")}
          className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
        >
          Novo Agendamento
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const canCancel = appointment.status === "pendente" || appointment.status === "confirmado";
            const canEdit = appointment.status !== "cancelado" && appointment.status !== "falta";
            const subject = appointment.doctor?.nome ?? appointment.exam?.nome ?? "—";

            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getTipoLabel(appointment.tipo)} — {subject}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    {appointment.tipo === "retorno" && appointment.origin && (
                      <p className="text-xs text-gray-500 mb-3">
                        Retorno da consulta de {formatDateBR(appointment.origin.date)}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateBR(appointment.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.time?.slice(0, 5)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pagamento</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getPaymentLabel(appointment.forma_pagamento)}
                          {appointment.forma_pagamento === "plano" && appointment.healthPlan?.nome
                            ? ` (${appointment.healthPlan.nome})`
                            : ""}
                        </p>
                      </div>
                      {appointment.observation && (
                        <div>
                          <p className="text-sm text-gray-500">Observação</p>
                          <p className="text-sm font-medium text-gray-900">{appointment.observation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 ml-6">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(appointment)}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => openCancelModal(appointment)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum agendamento
              </h3>
              <p className="text-sm text-gray-600">
                Você ainda não possui agendamentos. Clique em &ldquo;Novo Agendamento&rdquo; para criar um.
              </p>
            </div>
          </div>
        )
      )}

      {!loading && lastPage > 1 && (
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

      {modalState.isOpen && (
        <AppointmentModal
          key={`${modalState.mode}-${modalState.appointment?.id}`}
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          appointment={modalState.appointment}
          onConfirm={handleConfirm}
          onClose={closeModal}
          isLoading={isLoading}
          error={actionError}
        />
      )}
    </div>
  );
}
