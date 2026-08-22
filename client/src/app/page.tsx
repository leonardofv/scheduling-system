"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Footer from "../components/home/Footer";
import AuthDialog, { type AuthMode } from "../components/auth/AuthDialog";
import SpecialityGrid from "../components/home/SpecialityGrid";
import HowItWorks from "../components/home/HowItWorks";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-white font-bold text-lg">
                Agenda Fácil
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => openAuth("login")}
                className="text-sm font-semibold text-white hover:text-emerald-100 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuth("register")}
                className="whitespace-nowrap rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 sm:px-4"
              >
                Cadastrar-se
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="bg-linear-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Marque sua consulta com {" "}
                <span className="text-emerald-300">praticidade</span>
              </h1>
              <p className="mt-4 text-lg text-emerald-100 max-w-xl">
                Consultas, exames e teleconsulta da Clínica São Rafael em um só lugar: escolha o horário, receba a confirmação e acompanhe seu histórico.
              </p>
            </div>
          </div>
        </section>
        <HowItWorks />
        <CallToAction
          onAgendar={() => openAuth("register")}
          onEntrar={() => openAuth("login")}
        />
        <SpecialityGrid />
      </main>
      <Footer />
      {authOpen && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </div>
  );
}
