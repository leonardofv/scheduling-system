<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 3),
        new OA\Property(property: 'name', type: 'string', example: 'Maria da Silva'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'maria@email.com'),
        new OA\Property(property: 'phone', type: 'string', nullable: true, example: '85999990000'),
        new OA\Property(property: 'role', type: 'string', enum: ['cliente', 'admin'], example: 'cliente'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-07-10T12:00:00.000000Z'),
    ]
)]
class UserSchema
{
}
