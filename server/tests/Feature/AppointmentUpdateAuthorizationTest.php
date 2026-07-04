<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentUpdateAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function createAppointment(User $patient): Appointment
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        return Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'status' => 'pendente',
            'forma_pagamento' => 'particular',
        ]);
    }

    public function test_nao_dono_recebe_403_antes_da_validacao(): void
    {
        $owner = User::factory()->create();
        $appointment = $this->createAppointment($owner);

        Sanctum::actingAs(User::factory()->create());

        // payload inválido de propósito: 403 prova que a autorização roda antes das rules
        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'date' => 'data-invalida',
        ])->assertForbidden();
    }

    public function test_dono_consegue_atualizar_o_proprio_agendamento(): void
    {
        $owner = User::factory()->create();
        $appointment = $this->createAppointment($owner);

        Sanctum::actingAs($owner);

        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'observation' => 'Chegar 15 minutos antes',
        ])->assertOk();

        $this->assertDatabaseHas('agendamentos', [
            'id' => $appointment->id,
            'observation' => 'Chegar 15 minutos antes',
        ]);
    }

    public function test_admin_consegue_atualizar_agendamento_de_outro_usuario(): void
    {
        $owner = User::factory()->create();
        $appointment = $this->createAppointment($owner);

        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $this->putJson("/api/agendamentos/{$appointment->id}", [
            'observation' => 'Reagendado pela recepção',
        ])->assertOk();
    }
}
