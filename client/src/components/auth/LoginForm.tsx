"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await apiFetch("/api/login", {
      method: "POST",
      token: null,
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message ?? "Credenciais Inválidas");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">E-mail</label>
        <input
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
        <label className="text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="text-right">
        <button type="button" className="text-xs text-emerald-600 hover:underline">
          Esqueceu a senha?
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
      >
        Entrar
      </button>

      <p className="text-center text-xs text-gray-400 mt-2">
        Não tem conta?{" "}
        <button type="button" onClick={onSwitchToRegister} className="text-emerald-600 font-medium hover:underline">
          Cadastre-se
        </button>
      </p>
    </form>
  );
}
