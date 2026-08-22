"use client";
import { usePathname, useRouter } from "next/navigation";
import { House, ClipboardClock, CalendarDays, ClipboardCheck } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Início",
    href: "/dashboard",
    icon: <House className="w-5 h-5" />,
  },
  {
    label: "Agendamentos",
    href: "/dashboard/appointments",
    icon: <ClipboardClock className="w-5 h-5" />,
  },
  {
    label: "Calendário",
    href: "/dashboard/calendar",
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    label: "Serviços",
    href: "/dashboard/services",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen shrink-0 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-200 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4">
          <div className={`mb-6 flex items-center gap-3 ${collapsed ? "lg:flex-col" : ""}`}>
            <button
              onClick={() => router.push("/dashboard")}
              title="AgendaFácil"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 shrink-0 hover:bg-emerald-700 transition-colors"
            >
              <CalendarDays className="w-5 h-5 text-white" />
            </button>
            <span className={`text-lg font-bold text-gray-900 whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}>
              AgendaFácil
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onCloseMobile();
                }}
                title={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  collapsed ? "lg:justify-center" : ""
                } ${
                  isActive(item.href)
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={isActive(item.href) ? "text-emerald-700" : "text-gray-400"}>
                  {item.icon}
                </span>
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
