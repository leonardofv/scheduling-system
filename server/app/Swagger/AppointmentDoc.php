<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class AppointmentDoc
{
    #[OA\Get(
        path: '/api/agendamentos',
        summary: 'Lista os agendamentos (paginado; paciente vê os seus, admin vê todos)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                in: 'query',
                required: false,
                description: 'Página da listagem (15 agendamentos por página, mais recentes primeiro)',
                schema: new OA\Schema(type: 'integer', minimum: 1, example: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista paginada de agendamentos',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 10),
                                    new OA\Property(property: 'user_id', type: 'integer', example: 3),
                                    new OA\Property(property: 'tipo', type: 'string', enum: ['consulta', 'retorno', 'exame'], example: 'consulta'),
                                    new OA\Property(property: 'medico_id', type: 'integer', nullable: true, example: 1, description: 'Presente em consulta/retorno; null em exame'),
                                    new OA\Property(property: 'exame_id', type: 'integer', nullable: true, example: null, description: 'Presente em exame; null em consulta/retorno'),
                                    new OA\Property(property: 'agendamento_origem_id', type: 'integer', nullable: true, example: null, description: 'Consulta de origem, quando tipo=retorno'),
                                    new OA\Property(property: 'plano_id', type: 'integer', nullable: true, example: null),
                                    new OA\Property(property: 'date', type: 'string', format: 'date', example: '2026-07-15'),
                                    new OA\Property(property: 'time', type: 'string', example: '09:00:00'),
                                    new OA\Property(property: 'status', type: 'string', enum: ['pendente', 'confirmado', 'cancelado', 'falta'], example: 'pendente'),
                                    new OA\Property(property: 'forma_pagamento', type: 'string', enum: ['particular', 'plano'], example: 'particular'),
                                    new OA\Property(property: 'observation', type: 'string', nullable: true, example: null),
                                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-07-10T12:00:00.000000Z'),
                                    new OA\Property(property: 'user', type: 'object', description: 'Dados do paciente (id, name, email, phone, role, created_at)'),
                                    new OA\Property(property: 'doctor', type: 'object', nullable: true, description: 'Dados do médico, quando consulta/retorno'),
                                    new OA\Property(property: 'exam', type: 'object', nullable: true, description: 'Dados do exame, quando tipo=exame'),
                                ]
                            )
                        ),
                        new OA\Property(property: 'links', type: 'object', description: 'first, last, prev, next'),
                        new OA\Property(property: 'meta', type: 'object', description: 'current_page, last_page, per_page, total, path...'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
