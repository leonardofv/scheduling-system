<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class ExamDoc
{
    #[OA\Get(
        path: '/api/exames',
        summary: 'Lista todos os exames disponíveis',
        security: [['sanctum' => []]],
        tags: ['Exames'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de exames',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'nome', type: 'string', example: 'Eletrocardiograma'),
                            new OA\Property(property: 'valor', type: 'string', example: '150.00', description: 'Valor em reais, serializado como string decimal'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
