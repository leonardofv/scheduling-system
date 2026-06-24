<?php

namespace App\Enums;

enum AppointmentType: string
{
    case Consulta = 'consulta';
    case Retorno = 'retorno';
    case Exame = 'exame';

}
