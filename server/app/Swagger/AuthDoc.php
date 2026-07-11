<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class AuthDoc
{
    #[OA\Post(
        path: '/api/register',
        summary: 'Registra um novo usuário e retorna o token',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', maxLength: 255, example: 'Maria da Silva'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'maria@email.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 8, example: 'senha123'),
                    new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'senha123'),
                    new OA\Property(property: 'phone', type: 'string', maxLength: 20, nullable: true, example: '85999990000'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Usuário criado, retorna user e token'),
            new OA\Response(response: 422, description: 'Erro de validação (e-mail já cadastrado, senha curta, confirmação não confere)'),
            new OA\Response(response: 429, description: 'Muitas tentativas (rate limit)'),
        ]
    )]
    public function register(): void {}

    #[OA\Post(
        path: '/api/login',
        summary: 'Autentica o usuário e retorna o token',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@email.com'),
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

    #[OA\Get(
        path: '/api/user',
        summary: 'Retorna o usuário autenticado',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Dados do usuário autenticado',
                content: new OA\JsonContent(ref: '#/components/schemas/User')
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function user(): void {}

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
