"use client";

import { useEffect, useRef } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export type AuthMode = "login" | "register";

interface Props {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

export default function AuthDialog({ mode, onModeChange, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Esc fecha o modal e Tab fica preso dentro dele
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // trava o scroll do fundo enquanto o modal está aberto
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // leva o foco pro modal e devolve pro botão que abriu ao fechar
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  const tabClass = (active: boolean) =>
    `flex-1 py-4 text-sm font-semibold transition-colors ${
      active
        ? "text-emerald-600 border-b-2 border-emerald-600"
        : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        tabIndex={-1}
        className="relative my-auto w-full max-w-md outline-none"
      >
        <h2 id="auth-dialog-title" className="sr-only">
          {mode === "login" ? "Entrar na sua conta" : "Criar uma conta"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => onModeChange("login")}
              className={tabClass(mode === "login")}
            >
              Entrar
            </button>
            <button
              onClick={() => onModeChange("register")}
              className={tabClass(mode === "register")}
            >
              Cadastrar-se
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm onSwitchToRegister={() => onModeChange("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => onModeChange("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
