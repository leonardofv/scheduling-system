"use client";

import { useState, useEffect } from "react";
import { Plus, Search, User, TriangleAlert } from "lucide-react";
import { apiFetch } from "../../../../lib/api";

interface Specialty {
  id: number;
  nome: string;
}

interface Doctor {
  id: number;
  nome: string;
  crm: string;
  email: string | null;
  telefone: string | null;
  especialidade_id: number;
  specialty?: Specialty | null;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formCrm, setFormCrm] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formEspecialidadeId, setFormEspecialidadeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadData() {
    try {
      const [docRes, espRes] = await Promise.all([
        apiFetch("/api/medicos"),
        apiFetch("/api/especialidades"),
      ]);

      if (docRes.ok) {
        const data = await docRes.json();
        setDoctors(data.data ?? data);
      }
      if (espRes.ok) {
        const data = await espRes.json();
        setSpecialties(data.data ?? data);
      }
    } catch {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  function openCreateModal() {
    setEditingDoctor(null);
    setFormNome("");
    setFormCrm("");
    setFormEmail("");
    setFormTelefone("");
    setFormEspecialidadeId("");
    setModalOpen(true);
  }

  function openEditModal(doctor: Doctor) {
    setEditingDoctor(doctor);
    setFormNome(doctor.nome);
    setFormCrm(doctor.crm);
    setFormEmail(doctor.email ?? "");
    setFormTelefone(doctor.telefone ?? "");
    setFormEspecialidadeId(String(doctor.especialidade_id));
    setModalOpen(true);
  }

  async function handleSave() {
    if (!formNome.trim() || !formCrm.trim() || !formEspecialidadeId) return;
    setSaving(true);
    setError(null);

    try {
      const body: Record<string, any> = {
        nome: formNome.trim(),
        crm: formCrm.trim(),
        especialidade_id: Number(formEspecialidadeId),
      };
      if (formEmail.trim()) body.email = formEmail.trim();
      if (formTelefone.trim()) body.telefone = formTelefone.trim();

      let res;

      if (editingDoctor) {
        res = await apiFetch(`/api/medicos/${editingDoctor.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        res = await apiFetch("/api/medicos", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        setError(err.message || "Erro ao salvar médico.");
      }
    } catch {
      setError("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteError(null);
    try {
      const res = await apiFetch(`/api/medicos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteConfirm(null);
        loadData();
      } else {
        const err = await res.json();
        setDeleteError(err.message || "Não foi possível excluir. Verifique se há agendamentos vinculados.");
      }
    } catch {
      setDeleteError("Erro de conexão ao excluir.");
    }
  }

  const q = search.toLowerCase();
  const filtered = doctors.filter(
    (d) =>
      d.nome.toLowerCase().includes(q) ||
      d.crm.toLowerCase().includes(q) ||
      d.specialty?.nome.toLowerCase().includes(q)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-gray-800 mt-1">Gerencie os médicos cadastrados no sistema</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Médico
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar médico por nome, CRM ou especialidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {deleteError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteError}
          <button onClick={() => setDeleteError(null)} className="ml-2 underline">Fechar</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-700">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
          {search ? "Nenhum médico encontrado para essa busca." : "Nenhum médico cadastrado."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                    {doctor.nome.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{doctor.nome}</h3>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        CRM {doctor.crm}
                      </span>
                    </div>
                    {doctor.specialty && (
                      <p className="text-sm text-emerald-700 font-medium mt-0.5">
                        {doctor.specialty.nome}
                      </p>
                    )}
                    {(doctor.email || doctor.telefone) && (
                      <div className="flex gap-4 mt-1 text-xs text-gray-700">
                        {doctor.email && <span>{doctor.email}</span>}
                        {doctor.telefone && <span>{doctor.telefone}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => openEditModal(doctor)}
                    className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(doctor.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingDoctor ? "Editar Médico" : "Novo Médico"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CRM *</label>
                  <input
                    type="text"
                    value={formCrm}
                    onChange={(e) => setFormCrm(e.target.value)}
                    placeholder="Ex: 12345"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade *</label>
                  <select
                    value={formEspecialidadeId}
                    onChange={(e) => setFormEspecialidadeId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formNome.trim() || !formCrm.trim() || !formEspecialidadeId}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : editingDoctor ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <TriangleAlert className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Excluir Médico?</h3>
            <p className="text-sm text-gray-800 text-center mb-6">
              Esta ação não poderá ser desfeita. Se houver agendamentos vinculados, a exclusão será bloqueada.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
