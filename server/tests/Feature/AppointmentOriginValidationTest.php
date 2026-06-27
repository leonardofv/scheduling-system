<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentOriginValidationTest extends TestCase
{
    use RefreshDatabase;

    private function createDoctor(): Doctor
    {
        $specialty = Specialty::create(['nome' => 'Cardiologia']);

        return Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);
    }

    public function test_consulta_com_agendamento_origem_id_e_rejeitada(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $doctor = $this->createDoctor();

        $origin = Appointment::create([
            'user_id' => $user->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '09:00',
            'status' => 'confirmado',
        ]);

        $response = $this->postJson('/api/agendamentos', [
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'agendamento_origem_id' => $origin->id,
            'date' => '2030-01-01',
            'time' => '10:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['agendamento_origem_id']);
    }

    public function test_consulta_sem_agendamento_origem_id_e_criada(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $doctor = $this->createDoctor();

        $response = $this->postJson('/api/agendamentos', [
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('agendamentos', [
            'user_id' => $user->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'agendamento_origem_id' => null,
        ]);
    }

    public function test_retorno_sem_agendamento_origem_id_e_rejeitado(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $doctor = $this->createDoctor();

        $response = $this->postJson('/api/agendamentos', [
            'tipo' => 'retorno',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['agendamento_origem_id']);
    }
}
