"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { formatCurrency, formatDateBR } from "../../../../lib/format";
import type { Appointment, Doctor, Exam, HealthPlan, Specialty } from "../../../../types/appointment";

type Tipo = "consulta" | "retorno" | "exame";

async function fetchAllAppointments(): Promise<Appointment[]> {
  const all: Appointment[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await apiFetch(`/api/agendamentos?page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    all.push(...(data.data ?? data));
    lastPage = data.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage && page <= 10);

  return all;
}

export default function NewAppointmentPage() {
  const router = useRouter();

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [exames, setExames] = useState<Exam[]>([]);
  const [planos, setPlanos] = useState<HealthPlan[]>([]);
  const [ownAppointments, setOwnAppointments] = useState<Appointment[]>([]);

  const [tipo, setTipo] = useState<Tipo | "">("");
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [exameId, setExameId] = useState("");
  const [origemId, setOrigemId] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<"particular" | "plano" | "">("");
  const [planoId, setPlanoId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [observation, setObservation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const [resEsp, resMed, resExa, resPlan, appointments] = await Promise.all([
          apiFetch("/api/especialidades"),
          apiFetch("/api/medicos"),
          apiFetch("/api/exames"),
          apiFetch("/api/planos-saude"),
          fetchAllAppointments(),
        ]);

        if (resEsp.ok) {
          const data = await resEsp.json();
          setEspecialidades(data.data ?? data);
        }
        if (resMed.ok) {
          const data = await resMed.json();
          setMedicos(data.data ?? data);
        }
        if (resExa.ok) {
          const data = await resExa.json();
          setExames(data.data ?? data);
        }
        if (resPlan.ok) {
          const data = await resPlan.json();
          setPlanos(data.data ?? data);
        }
        setOwnAppointments(appointments);
      } catch {
        setCatalogError("Erro ao carregar dados para o agendamento. Tente novamente.");
      } finally {
        setCatalogLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const filteredMedicos = useMemo(() => {
    if (!especialidadeFiltro) return medicos;
    return medicos.filter(
      (m) => String(m.especialidade_id ?? m.specialty?.id ?? "") === especialidadeFiltro
    );
  }, [medicos, especialidadeFiltro]);

  const eligibleOrigins = useMemo(() => {
    const now = new Date();
    const usedOriginIds = new Set(
      ownAppointments
        .filter((a) => a.agendamento_origem_id != null && a.status !== "cancelado")
        .map((a) => a.agendamento_origem_id)
    );

    return ownAppointments
      .filter((a) => a.tipo === "consulta" && a.status === "confirmado")
      .filter((a) => !usedOriginIds.has(a.id))
      .filter((a) => new Date(`${a.date}T${a.time}`).getTime() < now.getTime())
      .sort((a, b) => (a.date + a.time > b.date + b.time ? -1 : 1));
  }, [ownAppointments]);

  const selectedOrigin = useMemo(
    () => eligibleOrigins.find((o) => o.id === Number(origemId)) ?? null,
    [eligibleOrigins, origemId]
  );

  const selectedExam = useMemo(
    () => exames.find((e) => e.id === Number(exameId)) ?? null,
    [exames, exameId]
  );

  function handleTipoChange(next: Tipo) {
    setTipo(next);
    setEspecialidadeFiltro("");
    setMedicoId("");
    setExameId("");
    setOrigemId("");
    setFormError(null);
  }

  function validate(): string | null {
    if (!tipo) return "Selecione o tipo de agendamento.";
    if (tipo === "consulta" && !medicoId) return "Selecione o médico.";
    if (tipo === "exame" && !exameId) return "Selecione o exame.";
    if (tipo === "retorno" && !origemId) return "Selecione a consulta de origem do retorno.";
    if (!formaPagamento) return "Selecione a forma de pagamento.";
    if (formaPagamento === "plano" && !planoId) return "Selecione o plano de saúde.";
    if (!date) return "Informe a data do agendamento.";
    if (!time) return "Informe o horário do agendamento.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload: Record<string, unknown> = {
      tipo,
      forma_pagamento: formaPagamento,
      date,
      time,
    };
    if (observation.trim()) payload.observation = observation.trim();
    if (tipo === "exame") {
      payload.exame_id = Number(exameId);
    } else if (tipo === "consulta") {
      payload.medico_id = Number(medicoId);
    } else if (tipo === "retorno") {
      payload.medico_id = selectedOrigin?.doctor?.id;
      payload.agendamento_origem_id = Number(origemId);
    }
    if (formaPagamento === "plano") payload.plano_id = Number(planoId);

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await apiFetch("/api/agendamentos", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard/appointments");
        return;
      }

      const err = await res.json().catch(() => null);
      setFormError(err?.message || "Não foi possível criar o agendamento.");
    } catch {
      setFormError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  if (catalogLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <button
          onClick={() => router.push("/dashboard/appointments")}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Voltar para meus agendamentos
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Novo Agendamento</h1>
        <p className="text-gray-600 mt-1">Escolha o tipo de atendimento e preencha os dados abaixo</p>
      </div>

      {catalogError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{catalogError}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">Tipo de agendamento</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { key: "consulta", label: "Consulta", desc: "Atendimento com um médico" },
                { key: "retorno", label: "Retorno", desc: "Vinculado a uma consulta anterior" },
                { key: "exame", label: "Exame", desc: "Realização de exame" },
              ] as { key: Tipo; label: string; desc: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleTipoChange(opt.key)}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  tipo === opt.key
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40"
                }`}
              >
                <p className="font-semibold text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {tipo === "consulta" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Especialidade (opcional)</label>
              <select
                value={especialidadeFiltro}
                onChange={(e) => {
                  setEspecialidadeFiltro(e.target.value);
                  setMedicoId("");
                }}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Todas as especialidades</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Médico</label>
              <select
                value={medicoId}
                onChange={(e) => setMedicoId(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Selecione um médico</option>
                {filteredMedicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                    {m.specialty?.nome ? ` — ${m.specialty.nome}` : ""}
                  </option>
                ))}
              </select>
              {filteredMedicos.length === 0 && (
                <p className="text-xs text-gray-500">Nenhum médico encontrado para essa especialidade.</p>
              )}
            </div>
          </div>
        )}

        {tipo === "retorno" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Consulta de origem</label>
              <select
                value={origemId}
                onChange={(e) => setOrigemId(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Selecione a consulta</option>
                {eligibleOrigins.map((o) => (
                  <option key={o.id} value={o.id}>
                    {formatDateBR(o.date)} às {o.time?.slice(0, 5)} — {o.doctor?.nome ?? "Médico"}
                  </option>
                ))}
              </select>
              {eligibleOrigins.length === 0 && (
                <p className="text-xs text-gray-500">
                  Você não possui consultas confirmadas e já realizadas elegíveis para retorno.
                </p>
              )}
            </div>

            {selectedOrigin && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
                Retorno com <strong>{selectedOrigin.doctor?.nome ?? "—"}</strong>
                {selectedOrigin.doctor?.specialty?.nome && ` (${selectedOrigin.doctor.specialty.nome})`}
              </div>
            )}
          </div>
        )}

        {tipo === "exame" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Exame</label>
            <select
              value={exameId}
              onChange={(e) => setExameId(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Selecione um exame</option>
              {exames.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nome}
                </option>
              ))}
            </select>
            {selectedExam?.valor && (
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Valor: {formatCurrency(selectedExam.valor)}
              </p>
            )}
          </div>
        )}

        {tipo && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900">Forma de pagamento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormaPagamento("particular");
                    setPlanoId("");
                  }}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    formaPagamento === "particular"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">Particular</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormaPagamento("plano")}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    formaPagamento === "plano"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">Plano de saúde</p>
                </button>
              </div>

              {formaPagamento === "plano" && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Plano de saúde</label>
                  <select
                    value={planoId}
                    onChange={(e) => setPlanoId(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione o plano</option>
                    {planos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                  {planos.length === 0 && (
                    <p className="text-xs text-gray-500">Nenhum plano de saúde disponível no momento.</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Observação (opcional)</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value.slice(0, 255))}
                maxLength={255}
                rows={3}
                placeholder="Alguma informação adicional para o atendimento"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{observation.length}/255</p>
            </div>
          </>
        )}

        {formError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{formError}</div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/appointments")}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !tipo}
            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Agendando..." : "Confirmar agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
}
