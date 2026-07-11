<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class HealthPlanDoc
{
    #[OA\Post(
        path: '/api/planos-saude',
        summary: 'Cadastra um plano de saúde (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Planos de Saúde'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nome'],
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Hapvida', description: 'Único'),
                    new OA\Property(property: 'ativo', type: 'boolean', example: true, description: 'Opcional; default true'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Plano criado', content: new OA\JsonContent(ref: '#/components/schemas/HealthPlanAdmin')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 422, description: 'Erro de validação (nome já cadastrado)'),
        ]
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/api/planos-saude/{healthPlan}',
        summary: 'Atualiza um plano de saúde (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Planos de Saúde'],
        parameters: [
            new OA\Parameter(name: 'healthPlan', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do plano de saúde'),
        ],
        requestBody: new OA\RequestBody(
            description: 'Todos os campos são opcionais, mas nome não pode vir vazio se enviado. Use ativo para ativar/desativar o plano.',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Hapvida', description: 'Único'),
                    new OA\Property(property: 'ativo', type: 'boolean', example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Plano atualizado', content: new OA\JsonContent(ref: '#/components/schemas/HealthPlanAdmin')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Plano não encontrado'),
            new OA\Response(response: 422, description: 'Erro de validação (nome já cadastrado em outro plano)'),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/planos-saude/{healthPlan}',
        summary: 'Exclui um plano de saúde (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Planos de Saúde'],
        parameters: [
            new OA\Parameter(name: 'healthPlan', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do plano de saúde'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Plano de saúde excluído com sucesso'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Plano não encontrado'),
            new OA\Response(response: 409, description: 'Plano possui agendamentos vinculados'),
            new OA\Response(response: 500, description: 'Erro interno ao excluir'),
        ]
    )]
    public function destroy(): void {}

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
                    items: new OA\Items(ref: '#/components/schemas/HealthPlan')
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}

    #[OA\Get(
        path: '/api/planos-saude/all',
        summary: 'Lista todos os planos de saúde, incluindo inativos (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Planos de Saúde'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista completa de planos, com o campo ativo',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/HealthPlanAdmin')
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
        ]
    )]
    public function listAll(): void {}
}
