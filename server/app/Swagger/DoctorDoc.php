<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class DoctorDoc
{
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
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'nome', type: 'string', example: 'Dr. João Cardoso'),
                            new OA\Property(property: 'crm', type: 'string', example: 'CRM-CE 12345'),
                            new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true, example: 'joao.cardoso@hospital.com'),
                            new OA\Property(property: 'telefone', type: 'string', nullable: true, example: '85999990000'),
                            new OA\Property(property: 'especialidade_id', type: 'integer', example: 1),
                            new OA\Property(
                                property: 'specialty',
                                type: 'object',
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 1),
                                    new OA\Property(property: 'nome', type: 'string', example: 'Cardiologia'),
                                    new OA\Property(property: 'descricao', type: 'string', nullable: true, example: 'Diagnóstico e tratamento de doenças do coração'),
                                ]
                            ),
                        ]
                    )
                )
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
        ]
    )]
    public function list(): void {}
}
