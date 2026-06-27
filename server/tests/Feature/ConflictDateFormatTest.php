<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use App\Services\AppointmentScheduler;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConflictDateFormatTest extends TestCase
{
    use RefreshDatabase;

    public function test_conflict_is_detected_when_date_sent_as_iso_datetime(): void
    {
        $specialty = Specialty::create(['nome' => 'Cardiologia']);
        $doctor = Doctor::create(['nome' => 'Dr. Teste', 'crm' => '123', 'especialidade_id' => $specialty->id]);
        $patient = User::factory()->create();

        Appointment::create([
            'user_id' => $patient->id,
            'tipo' => 'consulta',
            'medico_id' => $doctor->id,
            'date' => '2026-07-01',
            'time' => '14:30',
            'status' => 'pendente',
        ]);

        $scheduler = new AppointmentScheduler();

        $error = $scheduler->findConflictMessage(
            '2026-07-01T00:00:00.000Z',
            '14:30',
            $doctor->id,
            999999
        );

        $this->assertNotNull($error, 'Esperado detectar conflito mesmo com date em formato ISO, mas nenhum erro foi retornado.');
    }
}
