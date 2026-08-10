"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../lib/api";
import { formatDateLong, formatRole } from "../../../lib/format";
import type { User as Profile } from "../../../types/user";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiFetch("/api/user");

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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("A imagem deve ter no máximo 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setUploading(true);
    try {
      const res = await apiFetch("/api/user/photo", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setProfile(await res.json());
      } else {
        const err = await res.json().catch(() => null);
        setPhotoError(err?.message || "Não foi possível atualizar a foto.");
      }
    } catch {
      setPhotoError("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

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
          <div className="relative h-16 w-16">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-2xl font-bold ring-1 ring-white/20">
              {profile.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Alterar foto de perfil"
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow ring-2 ring-emerald-800 hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          {photoError && <p className="mt-2 text-xs text-red-200">{photoError}</p>}
          <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>
          <p className="mt-1 text-sm text-emerald-100">{profile.email}</p>

          <dl className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm">
            <div>
              <dt className="text-emerald-200">Tipo de conta</dt>
              <dd className="mt-1 font-semibold">{formatRole(profile.role)}</dd>
            </div>
            <div>
              <dt className="text-emerald-200">Membro desde</dt>
              <dd className="mt-1 font-semibold">{formatDateLong(profile.created_at)}</dd>
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
