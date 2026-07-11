<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class ExamDoc
{
    #[OA\Post(
        path: '/api/exames',
        summary: 'Cadastra um exame (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Exames'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nome', 'valor'],
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Hemograma completo'),
                    new OA\Property(property: 'valor', type: 'number', format: 'float', minimum: 0, example: 80.00, description: 'Enviar como número; na resposta é serializado como string decimal'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Exame criado', content: new OA\JsonContent(ref: '#/components/schemas/Exam')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 422, description: 'Erro de validação'),
        ]
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/api/exames/{exam}',
        summary: 'Atualiza um exame (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Exames'],
        parameters: [
            new OA\Parameter(name: 'exam', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do exame'),
        ],
        requestBody: new OA\RequestBody(
            description: 'Todos os campos são opcionais, mas não podem vir vazios se enviados',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Hemograma completo'),
                    new OA\Property(property: 'valor', type: 'number', format: 'float', minimum: 0, example: 90.00),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Exame atualizado', content: new OA\JsonContent(ref: '#/components/schemas/Exam')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Exame não encontrado'),
            new OA\Response(response: 422, description: 'Erro de validação'),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/exames/{exam}',
        summary: 'Exclui um exame (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Exames'],
        parameters: [
            new OA\Parameter(name: 'exam', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do exame'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Exame excluído com sucesso'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Exame não encontrado'),
            new OA\Response(response: 409, description: 'Exame possui agendamentos vinculados'),
            new OA\Response(response: 500, description: 'Erro interno ao excluir'),
        ]
    )]
    public function destroy(): void {}

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
                    items: new OA\Items(ref: '#/components/schemas/Exam')
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
