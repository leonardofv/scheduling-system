<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TokenExpirationTest extends TestCase
{
    use RefreshDatabase;

    public function test_token_expira_apos_o_prazo_configurado(): void
    {
        config(['sanctum.expiration' => 1440]); // fixa 24h, independente do .env

        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];

        $this->travel(25)->hours();

        $this->getJson('/api/user', $headers)->assertUnauthorized();
    }

    public function test_token_continua_valido_antes_do_prazo(): void
    {
        config(['sanctum.expiration' => 1440]);

        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];

        $this->travel(23)->hours();

        $this->getJson('/api/user', $headers)->assertOk();
    }
}
