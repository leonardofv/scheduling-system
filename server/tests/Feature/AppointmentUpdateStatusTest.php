<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentUpdateStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createAppointment(User $patient, string $status, string $date = '2030-01-01'): Appointment
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        return Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => $date,
            'time' => '10:00',
            'status' => $status,
            'forma_pagamento' => 'particular',
        ]);
    }


    public function test_nao_permite_atualizar_agendamento_marcado_como_falta(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'falta');

        Sanctum::actingAs($patient);
        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'date' => '2030-06-01',
            'time' => '14:00',
        ])->assertStatus(409)
            ->assertJsonFragment(['message' => 'Agendamentos marcados como falta não podem ser alterados.']);

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'falta',
            'date' => '2030-01-01',
            'time' => '10:00:00',
        ]);
    }

    public function test_nao_permite_atualizar_agendamento_cancelado(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'cancelado');

        Sanctum::actingAs($patient);
        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'observation' => 'tentativa de alteração',
        ])->assertStatus(409)
            ->assertJsonFragment(['message' => 'Agendamentos cancelados não podem ser alterados']);
    }

    public function test_permite_atualizar_agendamento_pendente(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'pendente');

        Sanctum::actingAs($patient);
        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'date' => '2030-06-01',
            'time' => '14:00',
        ])->assertOk();

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'date' => '2030-06-01',
            'time' => '14:00:00',
        ]);
    }
    public function test_admin_confirma_agendamento_pendente_com_horario_no_passado(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'pendente', '2020-01-01');

        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->patchJson("/api/agendamentos/{$appointment->id}/confirm")
            ->assertOk();

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'confirmado',
        ]);
    }

    public function test_admin_marca_falta_em_agendamento_pendente_vencido(): void
    {
        $patient = User::factory()->create();
        $appointment = $this->createAppointment($patient, 'pendente', '2020-01-01');

        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->patchJson("/api/agendamentos/{$appointment->id}/no-show")
            ->assertOk();

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'status' => 'falta',
        ]);
    }
}
