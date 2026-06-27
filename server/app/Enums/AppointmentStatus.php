<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Pending = 'pendente';
    case Confirmed = 'confirmado';
    case Cancelled = 'cancelado';
    case NoShow = 'falta';
}
