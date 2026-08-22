"use client";

type FooterLink = { label: string; href: string };

const atendimento: FooterLink[] = [
  { label: "Como funciona", href: "#" },
  { label: "Especialidades", href: "#" },
  { label: "Orientações", href: "#" },
];

const clinica: FooterLink[] = [
  { label: "Sobre a clínica", href: "#" },
  { label: "Unidade e horários", href: "#" },
  { label: "Convênios aceitos", href: "#" },
];

const legal: FooterLink[] = [
  { label: "Termos de uso", href: "#" },
  { label: "Privacidade e LGPD", href: "#" },
  { label: "Segurança", href: "#" },
];

const social: FooterLink[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
];

function Coluna({ titulo, links }: { titulo: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300">
        {titulo}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-emerald-100 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-800 bg-emerald-800">
      <div className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-8 px-4 pb-8 pt-10 sm:px-6 sm:pt-16">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded bg-emerald-600 text-white ring-1 ring-white/20">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            <span className="text-[17px] font-semibold text-white">
              Agenda Fácil
            </span>
          </div>
          <p className="max-w-[30ch] text-[13px] leading-relaxed text-emerald-100">
            Rua dos bobos, 0 - Centro. Recepção (98) 3333-2222, seg a sex
            7h–19h.
          </p>
        </div>

        <Coluna titulo="Atendimento" links={atendimento} />
        <Coluna titulo="A clínica" links={clinica} />
        <Coluna titulo="Legal" links={legal} />
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3.5 border-t border-emerald-600 px-4 pb-8 pt-4 text-xs text-emerald-200 sm:px-6">
        <span>
          © {currentYear} Clínica Fantasia. Agendamento pelo sistema
          AgendaFácil.
        </span>
        <div className="flex gap-4">
          {social.map((rede) => (
            <a
              key={rede.label}
              href={rede.href}
              className="text-emerald-100 transition-colors hover:text-white"
            >
              {rede.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
