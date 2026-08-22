import { apiFetch } from "@/src/lib/api";
import { Specialty } from "@/src/types/appointment";
import { useEffect, useState } from "react";


export default function SpecialityGrid() {
  const [specialty, setSpecialty] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpecialty() {
      try {
        const res = await apiFetch('/api/especialidades', { token: null });

        if (!res.ok) {
          throw new Error(`Erro ${res.status}`);
        }

        const data = await res.json();
        setSpecialty(data.data ?? data);
      } catch {
        setError('Não foi possível carregar as especialidades');
      } finally {
        setLoading(false);
      }
    }
    fetchSpecialty();
  }, []);

  return (
    <section id="especialidades" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-emerald-700">
            ESPECIALIDADES E SERVIÇOS
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            O que você agenda na clínica
          </h2>
        </div>

        {loading && (
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(215px,1fr))] border-t border-l border-gray-200 p-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="min-h-27 animate-pulse border-r border-b border-gray-200 bg-white" />
            ))}
          </ul>
        )}

        {error && <p className="text-center text-sm text-gray-600">{error}</p>}

        {!loading && !error && (
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(215px,1fr))] border-t border-l border-gray-200 p-0">
            {specialty.map((e, i) => (
              <li key={e.id} className="flex min-h-27 flex-col gap-1.5 border-r border-b border-gray-200 bg-white px-4 py-5 transition-colors hover:bg-emerald-50">
                <span className="text-xs tracking-widest text-gray-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg leading-tight font-semibold text-gray-900">{e.nome}</span>
                <span className="mt-auto text-xs font-medium uppercase tracking-wide text-emerald-700">{e.descricao}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
