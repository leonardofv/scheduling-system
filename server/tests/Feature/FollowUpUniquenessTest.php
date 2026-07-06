<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FollowUpUniquenessTest extends TestCase
{
    use RefreshDatabase;

    private function createConfirmedPastConsultation(User $patient): Appointment
    {
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $doctor = Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);

        return Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => now()->subDays(5)->toDateString(),
            'time' => '09:00',
            'status' => 'confirmado',
            'forma_pagamento' => 'particular',
        ]);
    }

    private function createFollowUp(Appointment $origin, string $time, string $status): Appointment
    {
        return Appointment::create([
            'user_id' => $origin->user_id,
            'tipo' => 'retorno',
            'medico_id' => $origin->medico_id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => $time,
            'status' => $status,
            'forma_pagamento' => 'particular',
        ]);
    }

    public function test_indice_impede_segundo_retorno_ativo_para_a_mesma_consulta(): void
    {
        $patient = User::factory()->create();
        $origin = $this->createConfirmedPastConsultation($patient);

        $this->createFollowUp($origin, '10:00', 'pendente');

        $this->expectException(UniqueConstraintViolationException::class);

        // horário diferente para não disparar os índices de slot
        $this->createFollowUp($origin, '11:00', 'pendente');
    }

    public function test_retorno_cancelado_permite_criar_novo_retorno(): void
    {
        $patient = User::factory()->create();
        $origin = $this->createConfirmedPastConsultation($patient);

        $this->createFollowUp($origin, '10:00', 'cancelado');
        $newFollowUp = $this->createFollowUp($origin, '11:00', 'pendente');

        $this->assertDatabaseHas('agendamentos', [
            'id' => $newFollowUp->id,
            'agendamento_origem_id' => $origin->id,
            'status' => 'pendente',
        ]);
    }
}
