<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Pendente = 'pendente';
    case Confirmado = 'confirmado';
    case Cancelado = 'cancelado';
    case Falta = 'falta';
}
