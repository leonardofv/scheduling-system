<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class HealthPlanDoc
{
    #[OA\Get(
        path: '/api/planos-saude',
        summary: 'Lista os planos de saúde ativos (aceitos pelo hospital)',
        security: [['sanctum' => []]],
        tags: ['Planos de Saúde'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de planos ativos (planos inativos não aparecem)',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'nome', type: 'string', example: 'Unimed'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
