<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'API Sistema de Agendamento',
    description: 'API para agendamento de consultas, retornos e exames',
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    description: 'Token gerado no login/register. Informe apenas o token, sem o prefixo Bearer.'
)]
class OpenApiSpec
{
}
