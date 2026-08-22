"use client";
import "react-day-picker/style.css";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { parseLocalDate, isSameDay } from "../../../lib/format";
import { getPaymentLabel, getStatusColor, getStatusLabel } from "../../../lib/appointments";
import type { Appointment } from "../../../types/appointment";

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    async function fetchAppointments() {
      setError(null);
      try {
        const res = await apiFetch("/api/agendamentos");
        if (res.ok) {
          const data = await res.json();
          setAppointments(data.data ?? data);
        } else {
          setError("Erro ao carregar agendamentos.");
        }
      } catch {
        setError("Erro ao carregar agendamentos.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  const appointmentDates = useMemo(
    () => appointments.map((a) => parseLocalDate(a.date)),
    [appointments]
  );

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter((a) => isSameDay(parseLocalDate(a.date), selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-emerald-700">CALENDÁRIO</p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">Seus agendamentos no mês</h2>
        <p className="mt-1 text-sm text-gray-600">
          Dias com uma marcação possuem agendamentos. Clique em um dia para ver os detalhes.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid gap-8 xl:grid-cols-3">
        <div className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
          ) : (
            <DayPicker
              mode="single"
              locale={ptBR}
              selected={selectedDate}
              onSelect={setSelectedDate}
              showOutsideDays
              modifiers={{ hasAppointment: appointmentDates }}
              className="w-full"
              classNames={{
                months: "relative flex flex-col sm:flex-row gap-4 w-full",
                month: "space-y-4 w-full",
                month_caption:
                  "flex justify-center items-center h-9 relative px-10 font-semibold text-gray-900 capitalize",
                nav: "z-10 flex items-center justify-between absolute inset-x-0 top-0 h-9",
                button_previous:
                  "h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-700",
                button_next:
                  "h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-700",
                month_grid: "w-full border-collapse mt-2",
                weekdays: "flex",
                weekday: "flex-1 text-gray-400 text-xs font-medium h-9 flex items-center justify-center capitalize",
                week: "flex w-full mt-1",
                day: "flex-1 h-10 text-center text-sm p-0 relative",
                day_button:
                  "w-full h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-emerald-50 transition-colors",
                today: "[&>button]:font-bold [&>button]:text-emerald-700",
                selected:
                  "[&>button]:bg-emerald-600 [&>button]:text-white [&>button]:hover:bg-emerald-700 [&>button]:after:bg-white!",
                outside: "text-gray-300",
                disabled: "text-gray-300",
              }}
              modifiersClassNames={{
                hasAppointment:
                  "[&>button]:after:content-[''] [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:w-1.5 [&>button]:after:h-1.5 [&>button]:after:rounded-full [&>button]:after:bg-emerald-500",
              }}
            />
          )}
        </div>

        <div className="rounded-2xl border border-emerald-300 bg-white p-6 shadow-sm sm:p-8 xl:col-span-2">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-700">
              {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "Nenhum dia selecionado"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">
              {selectedDayAppointments.length === 0
                ? "Nenhum agendamento"
                : `${selectedDayAppointments.length} agendamento${selectedDayAppointments.length > 1 ? "s" : ""}`}
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
          ) : selectedDayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Nenhum agendamento neste dia.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">
                    {appt.time?.slice(0, 5)}
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
                    {appt.doctor?.specialty?.nome && (
                      <p className="text-xs text-gray-500 mt-0.5">{appt.doctor.specialty.nome}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getPaymentLabel(appt.forma_pagamento)}
                      {appt.forma_pagamento === "plano" && appt.healthPlan?.nome && ` (${appt.healthPlan.nome})`}
                    </p>
                    {appt.observation && (
                      <p className="text-xs text-gray-400 mt-0.5 italic truncate" title={appt.observation}>
                        {appt.observation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
