<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DoctorSpecialtyDeletionConflictTest extends TestCase
{
    use RefreshDatabase;

    public function test_nao_permite_excluir_especialidade_com_medico_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/especialidades/{$specialty->id}")
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'Não é possível excluir: esta especialidade possui médicos vinculados']);

        $this->assertDatabaseHas('especialidades', ['id' => $specialty->id]);
    }

    public function test_permite_excluir_especialidade_sem_medico_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $specialty = Specialty::create(['nome' => 'Dermatologia']);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/especialidades/{$specialty->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Especialidade excluída com sucesso']);

        $this->assertDatabaseMissing('especialidades', ['id' => $specialty->id]);
    }

    public function test_nao_permite_excluir_medico_com_agendamento_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $patient = User::factory()->create();
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $doctor = Doctor::create([
            'nome' => 'Dr. Teste',
            'crm' => '12345',
            'especialidade_id' => $specialty->id,
        ]);

        Sanctum::actingAs($patient);
        $this->postJson('/api/agendamentos', [
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ])->assertStatus(201);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/medicos/{$doctor->id}")
            ->assertStatus(409)
            ->assertJsonFragment(['message' => 'Não é possível excluir: este médico possui agendamentos vinculados.']);

        $this->assertDatabaseHas('medicos', ['id' => $doctor->id]);
    }

    public function test_permite_excluir_medico_sem_agendamento_vinculado(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $doctor = Doctor::create([
            'nome' => 'Dr. Sem Agendamento',
            'crm' => '54321',
            'especialidade_id' => $specialty->id,
        ]);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/medicos/{$doctor->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['message' => 'Médico excluído com sucesso']);

        $this->assertDatabaseMissing('medicos', ['id' => $doctor->id]);
    }
}
