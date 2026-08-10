"use client";

import { useId, useState } from "react";
import { apiFetch } from "../../lib/api";

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fieldId = useId();


  function formatPhone(value: string){
    const numbers = value.replace(/\D/g, "").slice(0,11);

    if (numbers.length <= 2){
      return numbers;
    }

    if (numbers.length <= 7){
      return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    }

    return `(${numbers.slice(0,2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhone(value) : value,
    }))

  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/register", {
        method: "POST",
        token: null,
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.message ??
            (res.status === 429
              ? "Muitas tentativas. Aguarde alguns instantes."
              : "Não foi possível concluir o cadastro.")
        );
        return;
      }
      setSuccess(true);
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">
          Cadastro realizado com sucesso! Faça login para continuar.
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${fieldId}-name`}
          className="text-sm font-medium text-gray-700"
        >
          Nome completo
        </label>
        <input
          id={`${fieldId}-name`}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Seu nome"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${fieldId}-email`}
          className="text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          id={`${fieldId}-email`}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="seu@email.com"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${fieldId}-phone`}
          className="text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <input
          id={`${fieldId}-phone`}
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="(85) 99999-9999"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${fieldId}-password`}
          className="text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <input
          id={`${fieldId}-password`}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${fieldId}-confirm-password`}
          className="text-sm font-medium text-gray-700"
        >
          Confirmar senha
        </label>
        <input
          id={`${fieldId}-confirm-password`}
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      {error && <p role="alert" className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 active:bg-emerald-900 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-xs text-gray-500 mt-2">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-emerald-700 font-medium hover:underline"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}
