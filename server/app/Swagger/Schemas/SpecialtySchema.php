<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Specialty',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'nome', type: 'string', example: 'Cardiologia'),
        new OA\Property(property: 'descricao', type: 'string', nullable: true, example: 'Diagnóstico e tratamento de doenças do coração'),
    ]
)]
class SpecialtySchema
{
}
