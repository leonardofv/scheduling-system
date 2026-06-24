<?php

namespace App\Enums;

enum AgendamentoTipo: string
{
    case Consulta = 'consulta';
    case Retorno = 'retorno';
    case Exame = 'exame';
}
