<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Doctor',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'nome', type: 'string', example: 'Dr. João Cardoso'),
        new OA\Property(property: 'crm', type: 'string', example: 'CRM-CE 12345'),
        new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true, example: 'joao.cardoso@hospital.com'),
        new OA\Property(property: 'telefone', type: 'string', nullable: true, example: '85999990000'),
        new OA\Property(property: 'especialidade_id', type: 'integer', example: 1),
        new OA\Property(
            property: 'specialty',
            ref: '#/components/schemas/Specialty',
            description: 'Presente apenas quando a relação é carregada'
        ),
    ]
)]
class DoctorSchema
{
}
