"use client";

import { useState } from "react";
import { CalendarX2 } from "lucide-react";
import { getTipoLabel } from "../../lib/appointments";
import { formatDateBR } from "../../lib/format";
import type { Appointment } from "../../types/appointment";

export interface AppointmentEditPayload {
  date?: string;
  time?: string;
  observation: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  mode: "edit" | "cancel" | null;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (data?: AppointmentEditPayload) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function AppointmentModal({
  isOpen,
  mode,
  appointment,
  onClose,
  onConfirm,
  isLoading = false,
  error = null,
}: AppointmentModalProps) {
  const [date, setDate] = useState(appointment?.date ?? "");
  const [time, setTime] = useState(appointment?.time?.slice(0, 5) ?? "");
  const [observation, setObservation] = useState(appointment?.observation ?? "");

  if (!isOpen || !mode || !appointment) return null;

  const subject = appointment.doctor?.nome ?? appointment.exam?.nome ?? "";

  if (mode === "cancel") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <CalendarX2 className="w-6 h-6 text-red-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Deseja cancelar este agendamento?
          </h3>

          <p className="text-sm text-gray-600 text-center mb-4">
            {getTipoLabel(appointment.tipo)}
            {subject && <> — <strong>{subject}</strong></>}
            <br />
            Data: <strong>{formatDateBR(appointment.date)}</strong> às <strong>{appointment.time?.slice(0, 5)}</strong>
          </p>

          <p className="text-xs text-red-600 text-center mb-6">
            Esta ação não poderá ser desfeita.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              onClick={() => onConfirm()}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Cancelando..." : "Confirmar cancelamento"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    const canEditSchedule = appointment.status === "pendente";

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Editar Agendamento
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {getTipoLabel(appointment.tipo)}
            {subject && ` — ${subject}`}
          </p>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={!canEditSchedule}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
                    !canEditSchedule ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!canEditSchedule}
                  className={`px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
                    !canEditSchedule ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {!canEditSchedule && (
              <p className="text-xs text-gray-500">
                Para alterar data/hora de um agendamento confirmado, cancele e crie um novo.
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Observação</label>
              <textarea
                value={observation ?? ""}
                onChange={(e) => setObservation(e.target.value.slice(0, 255))}
                maxLength={255}
                rows={3}
                placeholder="Observação (opcional)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{(observation ?? "").length}/255</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                onConfirm({
                  date: canEditSchedule ? date : undefined,
                  time: canEditSchedule ? time : undefined,
                  observation: observation ?? "",
                })
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
