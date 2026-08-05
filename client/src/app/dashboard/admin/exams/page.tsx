"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../../../../lib/api";
import { formatCurrency, parseCurrencyToDecimal } from "../../../../lib/format";

interface Exam {
  id: number;
  nome: string;
  valor: string;
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formValor, setFormValor] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadExams() {
    try {
      const res = await apiFetch("/api/exames");
      if (res.ok) {
        const data = await res.json();
        setExams(data.data ?? data);
      }
    } catch {
      setError("Erro ao carregar exames.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadExams();
  }, [token]);

  function openCreateModal() {
    setEditingExam(null);
    setFormNome("");
    setFormValor("");
    setModalOpen(true);
  }

  function openEditModal(exam: Exam) {
    setEditingExam(exam);
    setFormNome(exam.nome);
    setFormValor(exam.valor);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!formNome.trim() || !formValor.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const valorDecimal = parseCurrencyToDecimal(formValor);
      const body = { nome: formNome.trim(), valor: valorDecimal };
      let res;

      if (editingExam) {
        res = await apiFetch(`/api/exames/${editingExam.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        res = await apiFetch("/api/exames", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadExams();
      } else {
        const err = await res.json();
        setError(err.message || "Erro ao salvar exame.");
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
      const res = await apiFetch(`/api/exames/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteConfirm(null);
        loadExams();
      } else {
        const err = await res.json();
        setDeleteError(err.message || "Não foi possível excluir. Verifique se há agendamentos vinculados.");
      }
    } catch {
      setDeleteError("Erro de conexão ao excluir.");
    }
  }

  const q = search.toLowerCase();
  const filtered = exams.filter((e) => e.nome.toLowerCase().includes(q));

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
          <h1 className="text-2xl font-bold text-gray-900">Exames</h1>
          <p className="text-gray-800 mt-1">Gerencie os exames disponíveis no sistema</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Exame
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar exame..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {search ? "Nenhum exame encontrado para essa busca." : "Nenhum exame cadastrado."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">{exam.nome}</h3>
              <p className="text-sm font-semibold text-emerald-700 mt-1">{formatCurrency(exam.valor)}</p>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(exam)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleteConfirm(exam.id)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingExam ? "Editar Exame" : "Novo Exame"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Hemograma completo"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                <input
                  type="text"
                  value={formValor}
                  onChange={(e) => setFormValor(e.target.value)}
                  placeholder="Ex: 150,00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Use vírgula para centavos (ex: 150,00)</p>
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
                disabled={saving || !formNome.trim() || !formValor.trim()}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : editingExam ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0V9m0 4v2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Excluir Exame?</h3>
            <p className="text-sm text-gray-800 text-center mb-6">
              Esta ação não poderá ser desfeita. Se houver agendamentos vinculados, a exclusão será bloqueada.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
