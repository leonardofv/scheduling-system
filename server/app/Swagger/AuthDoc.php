<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class AuthDoc
{
    #[OA\Post(
        path: '/api/login',
        summary: 'Autentica o usuário e retorna o token',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'paciente@email.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'senha123'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Login realizado, retorna user e token'),
            new OA\Response(response: 422, description: 'Credenciais inválidas'),
            new OA\Response(response: 429, description: 'Muitas tentativas (rate limit)'),
        ]
    )]
    public function login(): void {}

    #[OA\Post(
        path: '/api/logout',
        summary: 'Revoga o token atual',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'Logout realizado com sucesso'),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function logout(): void {}
}
