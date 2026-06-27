<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Exam;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentExamConflictTest extends TestCase
{
    use RefreshDatabase;

    public function test_pacientes_diferentes_podem_agendar_o_mesmo_exame_no_mesmo_horario(): void
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        $patientA = User::factory()->create();
        $patientB = User::factory()->create();

        $payload = [
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
        ];

        Sanctum::actingAs($patientA);
        $this->postJson('/api/agendamentos', $payload)->assertStatus(201);

        Sanctum::actingAs($patientB);
        $this->postJson('/api/agendamentos', $payload)->assertStatus(201);

        $this->assertDatabaseCount('agendamentos', 2);
    }

    public function test_mesmo_medico_no_mesmo_horario_continua_bloqueado(): void
    {
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $doctor = Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);

        $patientA = User::factory()->create();
        $patientB = User::factory()->create();

        $payload = [
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
        ];

        Sanctum::actingAs($patientA);
        $this->postJson('/api/agendamentos', $payload)->assertStatus(201);

        Sanctum::actingAs($patientB);
        $this->postJson('/api/agendamentos', $payload)
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Já existe agendamento para esse médico nessa data e horário']);
    }
}
