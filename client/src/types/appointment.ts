export interface Appointment {
  id: number;
  tipo: string;
  date: string;
  time: string;
  status: string;
  forma_pagamento?: string;
  observation?: string | null;
  user?: { name: string; email: string } | null;
  medico?: { nome: string; crm?: string; especialidade?: { nome: string } } | null;
  exame?: { nome: string; valor?: string } | null;
  healthPlan?: { nome: string } | null;
}
