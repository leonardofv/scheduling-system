<?php

namespace App\Enums;

enum AppointmentType: string
{
    case Consultation = 'consulta';
    case FollowUp = 'retorno';
    case Exam = 'exame';
}
