<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class SpecialtyDoc
{
    #[OA\Get(
        path: '/api/especialidades',
        summary: 'Lista todas as especialidades',
        security: [['sanctum' => []]],
        tags: ['Especialidades'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de especialidades',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'nome', type: 'string', example: 'Cardiologia'),
                            new OA\Property(property: 'descricao', type: 'string', nullable: true, example: 'Diagnóstico e tratamento de doenças do coração'),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
