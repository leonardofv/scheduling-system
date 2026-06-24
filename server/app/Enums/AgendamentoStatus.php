<?php

namespace App\Enums;

enum AgendamentoStatus: string
{
    case Pendente = 'pendente';
    case Confirmado = 'confirmado';
    case Cancelado = 'cancelado';
    case Falta = 'falta';
}
