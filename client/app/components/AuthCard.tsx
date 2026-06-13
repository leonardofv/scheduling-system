"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthMode = "login" | "register";

export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AgendaFácil</h1>
        <p className="text-gray-500 mt-1 text-sm">Sistema de agendamento online</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              mode === "login"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              mode === "register"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Cadastrar-se
          </button>
        </div>

        {mode === "login" ? <LoginForm onSwitchToRegister={() => setMode("register")} /> : <RegisterForm onSwitchToLogin={() => setMode("login")} />}
      </div>
    </div>
  );
}
