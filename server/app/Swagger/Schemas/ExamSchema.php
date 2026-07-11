<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Exam',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'nome', type: 'string', example: 'Eletrocardiograma'),
        new OA\Property(property: 'valor', type: 'string', example: '150.00', description: 'Valor em reais, serializado como string decimal'),
    ]
)]
class ExamSchema
{
}
