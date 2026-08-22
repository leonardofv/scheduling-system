"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  House,
  ClipboardClock,
  Stethoscope,
  User,
  FileText,
  ShieldCheck,
  Users,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <House className="w-5 h-5" />,
  },
  {
    label: "Agendamentos",
    href: "/dashboard/admin/appointments",
    icon: <ClipboardClock className="w-5 h-5" />,
  },
  {
    label: "Especialidades",
    href: "/dashboard/admin/specialties",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    label: "Médicos",
    href: "/dashboard/admin/doctors",
    icon: <User className="w-5 h-5" />,
  },
  {
    label: "Exames",
    href: "/dashboard/admin/exams",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Planos de Saúde",
    href: "/dashboard/admin/health-plans",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    label: "Usuários",
    href: "/dashboard/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-24 z-30 h-screen lg:h-[calc(100vh-8rem)] w-64 shrink-0 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 lg:pt-0">
          <div className="mb-6 lg:mt-0 mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Admin
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Painel de Controle</h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={isActive(item.href) ? "text-emerald-700" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
