<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthThrottleTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_e_bloqueado_apos_5_tentativas_no_mesmo_minuto(): void
    {
        $credentials = ['email' => 'alguem@example.com', 'password' => 'senha-errada'];

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', $credentials)->assertStatus(422);
        }

        $this->postJson('/api/login', $credentials)
            ->assertStatus(429)
            ->assertHeader('Retry-After');
    }

    public function test_limite_e_liberado_apos_o_intervalo(): void
    {
        $credentials = ['email' => 'alguem@example.com', 'password' => 'senha-errada'];

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/login', $credentials);
        }

        $this->travel(61)->seconds();

        // volta a responder 422 (credencial inválida), não 429
        $this->postJson('/api/login', $credentials)->assertStatus(422);
    }
}
