"use client";

interface AppointmentModalProps {
  isOpen: boolean;
  mode: "edit" | "delete" | null;
  appointment: any;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  isLoading?: boolean;
}

export default function AppointmentModal({
  isOpen,
  mode,
  appointment,
  onClose,
  onConfirm,
  isLoading = false
}: AppointmentModalProps) {
  if (!isOpen || !mode) return null;

  if (mode === "delete") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0V9m0 4v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Deseja cancelar este agendamento?
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-4">
            Serviço: <strong>{appointment?.service}</strong>
            <br />
            Data: <strong>{appointment?.date}</strong> às <strong>{appointment?.time}</strong>
          </p>

          <p className="text-xs text-red-600 text-center mb-6">
            Esta ação não poderá ser desfeita.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm()}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Editar Agendamento
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Serviço</label>
              <input
                type="text"
                defaultValue={appointment?.service}
                disabled
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  defaultValue={appointment?.date}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  defaultValue={appointment?.time}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm()}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
