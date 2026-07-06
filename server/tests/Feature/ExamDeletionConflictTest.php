<?php

namespace Tests\Feature;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExamDeletionConflictTest extends TestCase
{
    use RefreshDatabase;

    public function test_nao_permite_excluir_exame_com_agendamento_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $patient = User::factory()->create();
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        Sanctum::actingAs($patient);
        $this->postJson('/api/agendamentos', [
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ])->assertStatus(201);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/exames/{$exam->id}")
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'Não é possível excluir: este exame possui agendamentos vinculados.']);

        $this->assertDatabaseHas('exames', ['id' => $exam->id]);
    }

    public function test_permite_excluir_exame_sem_agendamento_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $exam = Exam::create(['nome' => 'Raio-X', 'valor' => 120]);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/exames/{$exam->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Exame excluído com sucesso']);

        $this->assertDatabaseMissing('exames', ['id' => $exam->id]);
    }
}
