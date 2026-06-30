<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Private = 'particular';
    case HealthPlan = 'plano';
}
