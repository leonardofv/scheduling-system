<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class DoctorDoc
{
    #[OA\Post(
        path: '/api/medicos',
        summary: 'Cadastra um médico (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Médicos'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['nome', 'crm', 'especialidade_id'],
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Dra. Ana Lima'),
                    new OA\Property(property: 'crm', type: 'string', maxLength: 20, example: 'CRM-CE 54321', description: 'Único'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', maxLength: 255, nullable: true, example: 'ana.lima@hospital.com', description: 'Único'),
                    new OA\Property(property: 'telefone', type: 'string', maxLength: 20, nullable: true, example: '85988887777'),
                    new OA\Property(property: 'especialidade_id', type: 'integer', example: 1, description: 'ID de especialidade existente'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Médico criado (sem o objeto specialty; use GET /api/medicos para obtê-lo)',
                content: new OA\JsonContent(ref: '#/components/schemas/Doctor')
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 422, description: 'Erro de validação (campos obrigatórios, crm/email já cadastrados, especialidade inexistente)'),
        ]
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/api/medicos/{doctor}',
        summary: 'Atualiza um médico (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Médicos'],
        parameters: [
            new OA\Parameter(name: 'doctor', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do médico'),
        ],
        requestBody: new OA\RequestBody(
            description: 'Todos os campos são opcionais, mas nome, crm e especialidade_id não podem vir vazios se enviados',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'nome', type: 'string', maxLength: 255, example: 'Dra. Ana Lima'),
                    new OA\Property(property: 'crm', type: 'string', maxLength: 20, example: 'CRM-CE 54321', description: 'Único'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', maxLength: 255, nullable: true, example: 'ana.lima@hospital.com', description: 'Único'),
                    new OA\Property(property: 'telefone', type: 'string', maxLength: 20, nullable: true, example: '85988887777'),
                    new OA\Property(property: 'especialidade_id', type: 'integer', example: 1, description: 'ID de especialidade existente'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Médico atualizado (sem o objeto specialty)',
                content: new OA\JsonContent(ref: '#/components/schemas/Doctor')
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Médico não encontrado'),
            new OA\Response(response: 422, description: 'Erro de validação (crm/email já cadastrados em outro médico, especialidade inexistente)'),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/medicos/{doctor}',
        summary: 'Exclui um médico (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Médicos'],
        parameters: [
            new OA\Parameter(name: 'doctor', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do médico'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Médico excluído com sucesso'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Médico não encontrado'),
            new OA\Response(response: 409, description: 'Médico possui agendamentos vinculados'),
            new OA\Response(response: 500, description: 'Erro interno ao excluir'),
        ]
    )]
    public function destroy(): void {}

    #[OA\Get(
        path: '/api/medicos',
        summary: 'Lista todos os médicos com sua especialidade',
        security: [['sanctum' => []]],
        tags: ['Médicos'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de médicos',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/Doctor')
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
