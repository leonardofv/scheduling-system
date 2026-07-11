<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class SpecialtyDoc
{
    #[OA\Post(
        path: '/api/especialidades',
        summary: 'Cria uma especialidade (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Especialidades'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nome'],
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Dermatologia'),
                    new OA\Property(property: 'descricao', type: 'string', maxLength: 255, nullable: true, example: 'Cuidados com a pele'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Especialidade criada', content: new OA\JsonContent(ref: '#/components/schemas/Specialty')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 422, description: 'Erro de validação'),
        ]
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/api/especialidades/{specialty}',
        parameters: [
            new OA\Parameter(name: 'specialty', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID da especialidade'),
        ],
        summary: 'Atualiza uma especialidade (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Especialidades'],
        requestBody: new OA\RequestBody(
            description: 'Todos os campos são opcionais, mas nome não pode vir vazio se enviado',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Dermatologia'),
                    new OA\Property(property: 'descricao', type: 'string', maxLength: 255, nullable: true, example: 'Cuidados com a pele'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Especialidade atualizada', content: new OA\JsonContent(ref: '#/components/schemas/Specialty')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Especialidade não encontrada'),
            new OA\Response(response: 422, description: 'Erro de validação'),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/especialidades/{specialty}',
        parameters: [
            new OA\Parameter(name: 'specialty', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID da especialidade'),
        ],
        summary: 'Exclui uma especialidade (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Especialidades'],
        responses: [
            new OA\Response(response: 200, description: 'Especialidade excluída com sucesso'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Especialidade não encontrada'),
            new OA\Response(response: 409, description: 'Especialidade possui médicos vinculados'),
            new OA\Response(response: 500, description: 'Erro interno ao excluir'),
        ],
    )]
    public function destroy(): void {}


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
                    items: new OA\Items(ref: '#/components/schemas/Specialty')
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
