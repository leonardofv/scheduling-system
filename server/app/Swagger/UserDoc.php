<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class UserDoc
{
    #[OA\Get(
        path: '/api/users',
        summary: 'Lista os usuários cadastrados (paginado, apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Users'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                in: 'query',
                required: false,
                description: 'Página da listagem (15 usuários por página)',
                schema: new OA\Schema(type: 'integer', minimum: 1, example: 1)
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Lista paginada: registros em "data", navegação em "links" e "meta"'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
        ]
    )]
    public function users(): void {}
}
