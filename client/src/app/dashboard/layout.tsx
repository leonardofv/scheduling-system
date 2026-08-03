"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/dashboard/Header";
import Footer from "../../components/dashboard/Footer";
import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  // A área /dashboard/admin já possui sua própria sidebar (AdminSidebar),
  // então o menu lateral padrão não é exibido ali para evitar duplicidade.
  const isAdminArea = pathname.startsWith("/dashboard/admin");

  if (isAdminArea) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* A sidebar é fixed e fica por cima do Header (não ocupa espaço no
          fluxo), então o conteúdo recebe uma margem à esquerda equivalente
          à largura atual da sidebar (recolhida ou expandida). */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((v) => !v)} />
      <main
        className={`flex-1 min-w-0 pb-24 lg:pb-0 transition-[margin] duration-200 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="max-w-400 mx-auto px-4 sm:px-6 py-8 w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
