<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

class AppointmentDoc
{
    #[OA\Post(
        path: '/api/agendamentos',
        summary: 'Cria um agendamento de consulta, retorno ou exame',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        requestBody: new OA\RequestBody(
            required: true,
            description: 'Campos condicionais por tipo: consulta/retorno exigem medico_id (proibido em exame); '
                . 'exame exige exame_id (proibido nos demais); retorno exige agendamento_origem_id (proibido nos demais), '
                . 'que deve ser uma consulta sua, confirmada e já ocorrida, com o mesmo médico, dentro da janela de validade '
                . 'e sem outro retorno ativo. forma_pagamento=plano exige plano_id de plano ativo (proibido em particular).',
            content: new OA\JsonContent(
                required: ['tipo', 'forma_pagamento', 'date', 'time'],
                properties: [
                    new OA\Property(property: 'tipo', type: 'string', enum: ['consulta', 'retorno', 'exame'], example: 'consulta'),
                    new OA\Property(property: 'medico_id', type: 'integer', nullable: true, example: 1, description: 'Obrigatório em consulta/retorno; proibido em exame'),
                    new OA\Property(property: 'exame_id', type: 'integer', nullable: true, example: null, description: 'Obrigatório em exame; proibido em consulta/retorno'),
                    new OA\Property(property: 'agendamento_origem_id', type: 'integer', nullable: true, example: null, description: 'Obrigatório em retorno; proibido nos demais'),
                    new OA\Property(property: 'forma_pagamento', type: 'string', enum: ['particular', 'plano'], example: 'particular'),
                    new OA\Property(property: 'plano_id', type: 'integer', nullable: true, example: null, description: 'Obrigatório se forma_pagamento=plano (apenas planos ativos); proibido se particular'),
                    new OA\Property(property: 'date', type: 'string', format: 'date', example: '2026-07-20', description: 'Formato Y-m-d'),
                    new OA\Property(property: 'time', type: 'string', example: '09:00', description: 'Formato H:i'),
                    new OA\Property(property: 'observation', type: 'string', maxLength: 255, nullable: true, example: null),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Agendamento criado (sem os objetos user/doctor/exam; use GET /api/agendamentos para obtê-los)',
                content: new OA\JsonContent(ref: '#/components/schemas/Appointment')
            ),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 409, description: 'Horário preenchido por outra requisição concorrente, ou a consulta já possui retorno'),
            new OA\Response(response: 422, description: 'Erro de validação ou conflito de horário (médico ou paciente já ocupado)'),
        ]
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/api/agendamentos/{appointment}',
        summary: 'Atualiza data, hora ou observação de um agendamento (dono ou admin)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(name: 'appointment', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do agendamento'),
        ],
        requestBody: new OA\RequestBody(
            description: 'Todos os campos são opcionais. Apenas date, time e observation podem ser alterados.',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'date', type: 'string', format: 'date', example: '2026-07-22', description: 'Formato Y-m-d'),
                    new OA\Property(property: 'time', type: 'string', example: '10:00', description: 'Formato H:i'),
                    new OA\Property(property: 'observation', type: 'string', maxLength: 255, nullable: true, example: 'Paciente pediu remarcação'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Agendamento atualizado', content: new OA\JsonContent(ref: '#/components/schemas/Appointment')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Agendamento de outro usuário'),
            new OA\Response(response: 404, description: 'Agendamento não encontrado'),
            new OA\Response(response: 409, description: 'Status não permite alteração (cancelado/falta), confirmado tentando mudar data/hora, ou horário preenchido por concorrência'),
            new OA\Response(response: 422, description: 'Erro de validação, conflito de horário ou data fora da janela do retorno'),
        ]
    )]
    public function update(): void {}

    #[OA\Patch(
        path: '/api/agendamentos/{appointment}/cancel',
        summary: 'Cancela um agendamento (dono ou admin)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(name: 'appointment', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do agendamento'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Agendamento cancelado', content: new OA\JsonContent(ref: '#/components/schemas/Appointment')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Agendamento de outro usuário'),
            new OA\Response(response: 404, description: 'Agendamento não encontrado'),
            new OA\Response(response: 409, description: 'Já cancelado, ou status não permite cancelamento (apenas pendente/confirmado)'),
        ]
    )]
    public function cancel(): void {}

    #[OA\Patch(
        path: '/api/agendamentos/{appointment}/confirm',
        summary: 'Confirma um agendamento pendente (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(name: 'appointment', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do agendamento'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Agendamento confirmado', content: new OA\JsonContent(ref: '#/components/schemas/Appointment')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Agendamento não encontrado'),
            new OA\Response(response: 409, description: 'Apenas agendamentos pendentes podem ser confirmados'),
        ]
    )]
    public function confirm(): void {}

    #[OA\Patch(
        path: '/api/agendamentos/{appointment}/no-show',
        summary: 'Marca falta em um agendamento confirmado (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(name: 'appointment', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do agendamento'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Falta registrada', content: new OA\JsonContent(ref: '#/components/schemas/Appointment')),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Agendamento não encontrado'),
            new OA\Response(response: 409, description: 'Apenas agendamentos pendentes ou confirmados podem ser marcados como falta'),
            new OA\Response(response: 422, description: 'Não é possível marcar falta antes do horário do agendamento'),
        ]
    )]
    public function markNoShow(): void {}

    #[OA\Delete(
        path: '/api/agendamentos/{appointment}',
        summary: 'Exclui um agendamento (apenas admin)',
        security: [['sanctum' => []]],
        tags: ['Agendamentos'],
        parameters: [
            new OA\Parameter(name: 'appointment', in: 'path', required: true, schema: new OA\Schema(type: 'integer'), description: 'ID do agendamento'),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Agendamento excluído'),
            new OA\Response(response: 401, description: 'Não autenticado'),
            new OA\Response(response: 403, description: 'Acesso restrito a administradores'),
            new OA\Response(response: 404, description: 'Agendamento não encontrado'),
            new OA\Response(response: 500, description: 'Erro interno ao excluir'),
        ]
    )]
    public function destroy(): void {}

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
                            items: new OA\Items(ref: '#/components/schemas/Appointment')
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
