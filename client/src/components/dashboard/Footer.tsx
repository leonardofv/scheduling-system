"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">AgendaFácil</h3>
                <p className="text-xs text-gray-400">Sistema de agendamentos</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Gerencie seus agendamentos de forma fácil e prática.
            </p>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Email:</span>{" "}
                <a href="mailto:suporte@agendafacil.com" className="hover:text-indigo-400 transition-colors">
                  suporte@agendafacil.com
                </a>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Telefone:</span>{" "}
                <a href="tel:+55112345678" className="hover:text-indigo-400 transition-colors">
                  +55 (11) 2345-678
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              © {currentYear} AgendaFácil. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16.51 5.338A8.51 8.51 0 1012 20.385 8.51 8.51 0 0016.51 5.338z" fill="white" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
