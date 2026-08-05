"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import { getToken } from "../../lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        onOpenMenu={() => setMobileMenuOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <main
        className={`flex-1 min-w-0 pb-24 lg:pb-0 transition-[margin] duration-200 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="max-w-400 mx-auto px-4 sm:px-6 py-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
