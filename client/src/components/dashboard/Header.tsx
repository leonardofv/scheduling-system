"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, User as UserIcon, ChevronDown, Lock, LogOut } from "lucide-react";
import { apiFetch } from "../../lib/api";
import type { User } from "../../types/user";

interface HeaderProps {
  onOpenMenu: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Header({ onOpenMenu, collapsed, onToggleCollapse }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch("/api/user");

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          if (data.role === "admin") {
            setIsAdmin(true);
          }
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

  async function handleLogout() {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/");
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-emerald-800 shadow-sm transition-[margin] duration-200 ${
        collapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-emerald-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-1 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-emerald-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    {user.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">
                    Olá, {user.name}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                    {isAdmin && (
                      <button
                        onClick={() => { setDropdownOpen(false); router.push("/dashboard/admin"); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                      >
                        <Lock className="w-4 h-4 text-violet-600" />
                        Painel Admin
                      </button>
                    )}
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      Meu Perfil
                    </button>
                    <div className="px-2 py-2">
                      <p className="text-xs text-gray-500 px-2 py-2">{user.email}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
