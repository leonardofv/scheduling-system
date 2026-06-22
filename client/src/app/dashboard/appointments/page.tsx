"use client";

import { useState } from "react";
import AppointmentModal from "../../../components/dashboard/AppointmentModal";

interface Appointment {
  id: number;
  service: string;
  date: string;
  time: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, service: "Consulta Geral", date: "22/06/2026", time: "14:30", status: "Confirmado" },
    { id: 2, service: "Limpeza", date: "25/06/2026", time: "10:00", status: "Pendente" },
    { id: 3, service: "Avaliação Dentária", date: "28/06/2026", time: "15:00", status: "Confirmado" }
  ]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null as "edit" | "delete" | null,
    appointment: null as Appointment | null
  });

  const [isLoading, setIsLoading] = useState(false);

  function openEditModal(appointment: Appointment) {
    setModalState({
      isOpen: true,
      mode: "edit",
      appointment
    });
  }

  function openDeleteModal(appointment: Appointment) {
    setModalState({
      isOpen: true,
      mode: "delete",
      appointment
    });
  }

  function closeModal() {
    setModalState({
      isOpen: false,
      mode: null,
      appointment: null
    });
  }

  async function handleConfirm() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (modalState.mode === "delete" && modalState.appointment) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${modalState.appointment.id}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (res.ok) {
          setAppointments(appointments.filter(a => a.id !== modalState.appointment?.id));
          closeModal();
        }
      } else if (modalState.mode === "edit") {
        // Implementar edição quando backend estiver pronto
        alert("Funcionalidade de edição em desenvolvimento");
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao processar solicitação:", error);
      alert("Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie todos os seus agendamentos</p>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.service}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Horário</p>
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 ml-6">
                  <button
                    onClick={() => openEditModal(appointment)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(appointment)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum agendamento
            </h3>
            <p className="text-sm text-gray-600">
              Você ainda não possui agendamentos. Clique em "Novo Agendamento" para criar um.
            </p>
          </div>
        </div>
      )}

      {modalState.isOpen && (
        <AppointmentModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          appointment={modalState.appointment}
          onConfirm={handleConfirm}
          onClose={closeModal}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
