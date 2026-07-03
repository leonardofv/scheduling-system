<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentCancellationTest extends TestCase
{
    use RefreshDatabase;

    private function createAppointment(User $patient, string $status): Appointment
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        return Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'status' => $status,
            'forma_pagamento' => 'particular',
        ]);
    }

    public function test_nao_permite_cancelar_agendamento_marcado_como_falta(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'falta');

        Sanctum::actingAs($patient);
        $this->patchJson("/api/agendamentos/{$appointment->id}/cancel")
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'Apenas agendamentos pendentes ou confirmados podem ser cancelados']);

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'falta',
        ]);
    }

    public function test_permite_cancelar_agendamento_pendente(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'pendente');

        Sanctum::actingAs($patient);
        $this->patchJson("/api/agendamentos/{$appointment->id}/cancel")
            ->assertStatus(200);

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'cancelado',
        ]);
    }

    public function test_permite_cancelar_agendamento_confirmado(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'confirmado');

        Sanctum::actingAs($patient);
        $this->patchJson("/api/agendamentos/{$appointment->id}/cancel")
            ->assertStatus(200);

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'cancelado',
        ]);
    }

    public function test_nao_permite_cancelar_agendamento_ja_cancelado(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'cancelado');

        Sanctum::actingAs($patient);
        $this->patchJson("/api/agendamentos/{$appointment->id}/cancel")
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'Este agendamento já está cancelado']);
    }
}
