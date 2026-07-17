"use client";

import { useState, useEffect, useMemo } from "react";

interface Specialty {
  id: number;
  nome: string;
  descricao: string | null;
}

interface Doctor {
  id: number;
  nome: string;
  crm: string;
  email: string | null;
  telefone: string | null;
  especialidade: Specialty | null;
}

interface Exam {
  id: number;
  nome: string;
  valor: string;
}

interface HealthPlan {
  id: number;
  nome: string;
  ativo: boolean;
}

type Tab = "especialidades" | "medicos" | "exames" | "planos";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("especialidades");
  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [exames, setExames] = useState<Exam[]>([]);
  const [planos, setPlanos] = useState<HealthPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const base = process.env.NEXT_PUBLIC_API_URL;

      try {
        const [resEsp, resMed, resExa, resPlan] = await Promise.all([
          fetch(`${base}/api/especialidades`, { headers }),
          fetch(`${base}/api/medicos`, { headers }),
          fetch(`${base}/api/exames`, { headers }),
          fetch(`${base}/api/planos-saude`, { headers }),
        ]);

        if (resEsp.ok) setEspecialidades((await resEsp.json()).data ?? (await resEsp.json()));
        if (resMed.ok) setMedicos((await resMed.json()).data ?? (await resMed.json()));
        if (resExa.ok) setExames((await resExa.json()).data ?? (await resExa.json()));
        if (resPlan.ok) setPlanos((await resPlan.json()).data ?? (await resPlan.json()));
      } catch {
        setError("Erro ao carregar serviços. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const q = search.toLowerCase();

  const filteredEsp = useMemo(() => {
    if (!q) return especialidades;
    return especialidades.filter((e) => e.nome.toLowerCase().includes(q) || e.descricao?.toLowerCase().includes(q));
  }, [especialidades, q]);

  const filteredMed = useMemo(() => {
    if (!q) return medicos;
    return medicos.filter(
      (m) =>
        m.nome.toLowerCase().includes(q) ||
        m.crm.toLowerCase().includes(q) ||
        m.especialidade?.nome.toLowerCase().includes(q)
    );
  }, [medicos, q]);

  const filteredExa = useMemo(() => {
    if (!q) return exames;
    return exames.filter((e) => e.nome.toLowerCase().includes(q));
  }, [exames, q]);

  const filteredPlan = useMemo(() => {
    if (!q) return planos;
    return planos.filter((p) => p.nome.toLowerCase().includes(q));
  }, [planos, q]);

  const counts: Record<Tab, number> = {
    especialidades: filteredEsp.length,
    medicos: filteredMed.length,
    exames: filteredExa.length,
    planos: filteredPlan.length,
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "especialidades",
      label: "Especialidades",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      key: "medicos",
      label: "Médicos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: "exames",
      label: "Exames",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "planos",
      label: "Planos de Saúde",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  function formatValor(valor: string) {
    const num = parseFloat(valor);
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-1">Confira os serviços disponíveis para agendamento</p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            {tab.label}
            {!loading && (
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <span className="ml-3 text-sm text-gray-500">Carregando...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {activeTab === "especialidades" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEsp.length === 0 ? (
                <EmptyState label={search ? "Nenhuma especialidade encontrada para essa busca" : "Nenhuma especialidade encontrada"} />
              ) : (
                filteredEsp.map((esp) => (
                  <div
                    key={esp.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{esp.nome}</h3>
                    {esp.descricao && (
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{esp.descricao}</p>
                    )}
                    <p className="mt-3 text-xs text-gray-400">
                      {medicos.filter((m) => m.especialidade?.id === esp.id).length} médico(s) nesta especialidade
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "medicos" && (
            <div className="space-y-4">
              {filteredMed.length === 0 ? (
                <EmptyState label={search ? "Nenhum médico encontrado para essa busca" : "Nenhum médico encontrado"} />
              ) : (
                filteredMed.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                      {med.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">{med.nome}</h3>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          CRM {med.crm}
                        </span>
                      </div>
                      {med.especialidade && (
                        <p className="mt-1 text-sm text-emerald-700 font-medium">
                          {med.especialidade.nome}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        {med.email && <span>{med.email}</span>}
                        {med.telefone && <span>{med.telefone}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "exames" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExa.length === 0 ? (
                <EmptyState label={search ? "Nenhum exame encontrado para essa busca" : "Nenhum exame encontrado"} />
              ) : (
                filteredExa.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100 text-violet-700 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{ex.nome}</h3>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      {formatValor(ex.valor)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "planos" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlan.length === 0 ? (
                <EmptyState label={search ? "Nenhum plano encontrado para essa busca" : "Nenhum plano encontrado"} />
              ) : (
                filteredPlan.map((pl) => (
                  <div
                    key={pl.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-100 text-teal-700 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{pl.nome}</h3>
                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        pl.ativo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {pl.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
