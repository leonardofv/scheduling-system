<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'HealthPlanAdmin',
    description: 'Plano de saúde na visão do admin, com o campo ativo',
    allOf: [
        new OA\Schema(ref: '#/components/schemas/HealthPlan'),
        new OA\Schema(
            properties: [
                new OA\Property(property: 'ativo', type: 'boolean', example: false),
            ]
        ),
    ]
)]
class HealthPlanAdminSchema
{
}
