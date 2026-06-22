"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface User {
  name: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  function handleProfileClick() {
    setDropdownOpen(false);
    router.push("/dashboard/profile");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* Top Row - Logo and User Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Olá, {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                    >
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Meu Perfil
                    </button>
                    <div className="px-2 py-2">
                      <p className="text-xs text-gray-500 px-2 py-2 break-words">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Navigation (Full Width) */}
      <nav className="bg-indigo-600 border-t border-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-8">
            <button
              onClick={() => {
                const pathname = window.location.pathname;
                if (pathname === "/dashboard") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/dashboard");
                }
              }}
              className="pb-0 px-1 text-sm font-medium text-white hover:text-indigo-100 border-b-2 border-transparent hover:border-indigo-100 transition-colors"
            >
              Página Inicial
            </button>
            <button
              onClick={() => {
                const pathname = window.location.pathname;
                if (pathname === "/dashboard") {
                  const section = document.getElementById("secoes");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                } else {
                  router.push("/dashboard/appointments");
                }
              }}
              className="pb-0 px-1 text-sm font-medium text-white hover:text-indigo-100 border-b-2 border-transparent hover:border-indigo-100 transition-colors"
            >
              Agendamentos
            </button>
            <button
              onClick={() => {
                const pathname = window.location.pathname;
                if (pathname === "/dashboard") {
                  const section = document.getElementById("secoes");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                } else {
                  router.push("/dashboard/services");
                }
              }}
              className="pb-0 px-1 text-sm font-medium text-white hover:text-indigo-100 border-b-2 border-transparent hover:border-indigo-100 transition-colors"
            >
              Serviços
            </button>
            <button
              onClick={() => {
                const pathname = window.location.pathname;
                if (pathname === "/dashboard") {
                  const section = document.getElementById("secoes");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                } else {
                  router.push("/dashboard/reports");
                }
              }}
              className="pb-0 px-1 text-sm font-medium text-white hover:text-indigo-100 border-b-2 border-transparent hover:border-indigo-100 transition-colors"
            >
              Relatórios
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
