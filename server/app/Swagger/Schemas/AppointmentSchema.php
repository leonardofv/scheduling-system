<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Appointment',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 10),
        new OA\Property(property: 'user_id', type: 'integer', example: 3),
        new OA\Property(property: 'tipo', type: 'string', enum: ['consulta', 'retorno', 'exame'], example: 'consulta'),
        new OA\Property(property: 'medico_id', type: 'integer', nullable: true, example: 1, description: 'Presente em consulta/retorno; null em exame'),
        new OA\Property(property: 'exame_id', type: 'integer', nullable: true, example: null, description: 'Presente em exame; null em consulta/retorno'),
        new OA\Property(property: 'agendamento_origem_id', type: 'integer', nullable: true, example: null, description: 'Consulta de origem, quando tipo=retorno'),
        new OA\Property(property: 'plano_id', type: 'integer', nullable: true, example: null),
        new OA\Property(property: 'date', type: 'string', format: 'date', example: '2026-07-15'),
        new OA\Property(property: 'time', type: 'string', example: '09:00:00'),
        new OA\Property(property: 'status', type: 'string', enum: ['pendente', 'confirmado', 'cancelado', 'falta'], example: 'pendente'),
        new OA\Property(property: 'forma_pagamento', type: 'string', enum: ['particular', 'plano'], example: 'particular'),
        new OA\Property(property: 'observation', type: 'string', nullable: true, example: null),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-07-10T12:00:00.000000Z'),
        new OA\Property(property: 'user', ref: '#/components/schemas/User', description: 'Presente apenas quando a relação é carregada'),
        new OA\Property(property: 'doctor', ref: '#/components/schemas/Doctor', nullable: true, description: 'Presente em consulta/retorno, quando a relação é carregada'),
        new OA\Property(property: 'exam', ref: '#/components/schemas/Exam', nullable: true, description: 'Presente em exame, quando a relação é carregada'),
        new OA\Property(property: 'healthPlan', ref: '#/components/schemas/HealthPlan', nullable: true, description: 'Presente apenas quando a relação é carregada'),
    ]
)]
class AppointmentSchema
{
}
