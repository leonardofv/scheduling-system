<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FollowUpWindowTest extends TestCase
{
    use RefreshDatabase;

    private User $patient;
    private Doctor $doctor;

    protected function setUp(): void
    {
        parent::setUp();

        $this->patient = User::factory()->create();
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $this->doctor = Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);
    }

    private function createConfirmedPastConsultation(): Appointment
    {
        return Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'consulta',
            'medico_id' => $this->doctor->id,
            'date' => now()->subDays(5)->toDateString(),
            'time' => '10:00',
            'status' => 'confirmado',
            'forma_pagamento' => 'particular',
        ]);
    }

    private function followUpPayload(Appointment $origin, array $overrides = []): array
    {
        return array_merge([
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ], $overrides);
    }

    public function test_permite_criar_retorno_dentro_da_janela(): void
    {
        $origin = $this->createConfirmedPastConsultation();

        Sanctum::actingAs($this->patient);
        // origem há 5 dias + janela de 30 = limite daqui a 25 dias
        $this->postJson('/api/agendamentos', $this->followUpPayload($origin, [
            'date' => now()->addDays(20)->toDateString(),
        ]))->assertStatus(201);
    }

    public function test_bloqueia_criar_retorno_fora_da_janela(): void
    {
        $origin = $this->createConfirmedPastConsultation();

        Sanctum::actingAs($this->patient);
        $this->postJson('/api/agendamentos', $this->followUpPayload($origin, [
            'date' => now()->addDays(26)->toDateString(), // origem + 31 dias
        ]))->assertStatus(422)
            ->assertJsonFragment(['message' => 'O retorno deve ser marcado até 30 dias após a consulta de origem']);
    }

    public function test_bloqueia_segundo_retorno_para_a_mesma_consulta(): void
    {
        $origin = $this->createConfirmedPastConsultation();

        Sanctum::actingAs($this->patient);
        $this->postJson('/api/agendamentos', $this->followUpPayload($origin))
            ->assertStatus(201);

        $this->postJson('/api/agendamentos', $this->followUpPayload($origin, [
            'date' => now()->addDays(11)->toDateString(),
        ]))->assertStatus(422)
            ->assertJsonFragment(['message' => 'Essa consulta já possui um retorno agendado']);
    }

    public function test_permite_novo_retorno_apos_cancelar_o_anterior(): void
    {
        $origin = $this->createConfirmedPastConsultation();

        Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'status' => 'cancelado',
            'forma_pagamento' => 'particular',
        ]);

        Sanctum::actingAs($this->patient);
        $this->postJson('/api/agendamentos', $this->followUpPayload($origin, [
            'date' => now()->addDays(11)->toDateString(),
        ]))->assertStatus(201);
    }

    public function test_bloqueia_remarcar_retorno_para_fora_da_janela(): void
    {
        $origin = $this->createConfirmedPastConsultation();
        $followUp = Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        Sanctum::actingAs($this->patient);
        $this->putJson("/api/agendamentos/{$followUp->id}", [
            'date' => now()->addDays(26)->toDateString(), // origem + 31 dias
        ])->assertStatus(422)
            ->assertJsonValidationErrors('date');
    }

    public function test_permite_remarcar_retorno_dentro_da_janela(): void
    {
        $origin = $this->createConfirmedPastConsultation();
        $followUp = Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        Sanctum::actingAs($this->patient);
        $this->putJson("/api/agendamentos/{$followUp->id}", [
            'date' => now()->addDays(15)->toDateString(),
        ])->assertStatus(200);
    }

    public function test_permite_atualizar_retorno_orfao_sem_erro(): void
    {
        $followUp = Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => null, // consulta de origem excluída (FK set null)
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        Sanctum::actingAs($this->patient);
        $this->putJson("/api/agendamentos/{$followUp->id}", [
            'observation' => 'remarcado pela recepção',
        ])->assertStatus(200);
    }

    public function test_retorno_sem_date_retorna_422_e_nao_500(): void
    {
        $origin = $this->createConfirmedPastConsultation();
        $payload = $this->followUpPayload($origin);
        unset($payload['date']);

        Sanctum::actingAs($this->patient);
        $this->postJson('/api/agendamentos', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('date');
    }

    public function test_remarcar_retorno_com_date_invalida_retorna_422_e_nao_500(): void
    {
        $origin = $this->createConfirmedPastConsultation();
        $followUp = Appointment::create([
            'user_id' => $this->patient->id,
            'tipo' => 'retorno',
            'medico_id' => $this->doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => now()->addDays(10)->toDateString(),
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        Sanctum::actingAs($this->patient);
        $this->putJson("/api/agendamentos/{$followUp->id}", [
            'date' => 'banana',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('date');
    }
}
