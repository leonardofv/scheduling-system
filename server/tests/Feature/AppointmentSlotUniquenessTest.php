<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Exam;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentSlotUniquenessTest extends TestCase
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

    public function test_indice_unico_bloqueia_dois_agendamentos_do_mesmo_medico_no_mesmo_horario(): void
    {
        $doctor = $this->createDoctor();
        $patientA = User::factory()->create();
        $patientB = User::factory()->create();

        Appointment::create([
            'user_id' => $patientA->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        $this->expectException(UniqueConstraintViolationException::class);

        // insert direto no model, sem passar pelo scheduler: simula o perdedor da race
        Appointment::create([
            'user_id' => $patientB->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);
    }

    public function test_indice_unico_bloqueia_dois_agendamentos_do_mesmo_paciente_no_mesmo_horario(): void
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);
        $patient = User::factory()->create();

        Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        $this->expectException(UniqueConstraintViolationException::class);

        Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'exame',
            'exame_id' => $exam->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);
    }

    public function test_agendamento_cancelado_libera_o_horario(): void
    {
        $doctor = $this->createDoctor();
        $patientA = User::factory()->create();
        $patientB = User::factory()->create();

        Appointment::create([
            'user_id' => $patientA->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'status' => 'cancelado',
            'forma_pagamento' => 'particular',
        ]);

        Appointment::create([
            'user_id' => $patientB->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2030-01-01',
            'time' => '10:00',
            'forma_pagamento' => 'particular',
        ]);

        $this->assertDatabaseCount('agendamentos', 2);
    }

    public function test_exames_de_pacientes_diferentes_no_mesmo_horario_continuam_permitidos(): void
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);
        $patientA = User::factory()->create();
        $patientB = User::factory()->create();

        foreach ([$patientA, $patientB] as $patient) {
            Appointment::create([
                'user_id' => $patient->id,
                'tipo' => 'exame',
                'exame_id' => $exam->id,
                'date' => '2030-01-01',
                'time' => '10:00',
                'forma_pagamento' => 'particular',
            ]);
        }

        $this->assertDatabaseCount('agendamentos', 2);
    }
}
