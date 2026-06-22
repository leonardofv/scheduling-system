export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
        <p className="text-gray-600 mt-1">Confira os serviços disponíveis para agendamento</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços</h3>
          <p className="text-sm text-gray-600">
            Esta página será preenchida com os serviços disponíveis em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
