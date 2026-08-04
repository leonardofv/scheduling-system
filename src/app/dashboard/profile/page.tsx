"use client";

import { useEffect, useState } from "react";

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

function formatRole(role: string) {
  return role === "admin" ? "Administrador" : "Paciente";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar seus dados.");
        }

        setProfile(await response.json());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar seus dados.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-lg font-semibold">Não foi possível abrir seu perfil</h1>
        <p className="mt-1 text-sm">{error || "Tente atualizar a página em alguns instantes."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">MINHA CONTA</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Meu perfil</h1>
        <p className="mt-2 text-gray-600">Consulte as informações vinculadas à sua conta.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <aside className="rounded-2xl bg-linear-to-br from-emerald-700 to-emerald-900 p-6 text-white lg:col-span-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/20">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>
          <p className="mt-1 text-sm text-emerald-100">{profile.email}</p>

          <dl className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm">
            <div>
              <dt className="text-emerald-200">Tipo de conta</dt>
              <dd className="mt-1 font-semibold">{formatRole(profile.role)}</dd>
            </div>
            <div>
              <dt className="text-emerald-200">Membro desde</dt>
              <dd className="mt-1 font-semibold">{formatDate(profile.created_at)}</dd>
            </div>
          </dl>
        </aside>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
          <div className="flex items-start gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700" aria-hidden="true">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A10.97 10.97 0 0112 15.5c2.51 0 4.824.842 6.879 2.304M15 11a3 3 0 11-6 0 3 3 0 016 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Informações pessoais</h2>
              <p className="mt-1 text-sm text-gray-600">Dados cadastrados para identificação e contato.</p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-gray-100">
            <div className="py-4 first:pt-0">
              <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900">{profile.name}</dd>
            </div>
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">E-mail</dt>
              <dd className="mt-1 break-all text-base font-semibold text-gray-900">{profile.email}</dd>
            </div>
            <div className="py-4 last:pb-0">
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900">{profile.phone || "Não informado"}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Se precisar corrigir algum dado, entre em contato com o suporte para receber orientação.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
