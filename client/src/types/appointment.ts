export interface Specialty {
  id: number;
  nome: string;
  descricao?: string | null;
}

export interface Doctor {
  id: number;
  nome: string;
  crm?: string;
  email?: string | null;
  telefone?: string | null;
  especialidade_id?: number;
  specialty?: Specialty | null;
}

export interface Exam {
  id: number;
  nome: string;
  valor?: string;
}

export interface HealthPlan {
  id: number;
  nome: string;
  ativo?: boolean;
}

export interface Appointment {
  id: number;
  tipo: string;
  date: string;
  time: string;
  status: string;
  forma_pagamento?: string;
  plano_id?: number | null;
  agendamento_origem_id?: number | null;
  observation?: string | null;
  user?: { name: string; email: string } | null;
  doctor?: Doctor | null;
  exam?: Exam | null;
  healthPlan?: HealthPlan | null;
  origin?: Appointment | null;
}
