<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentListAllTest extends TestCase
{
    use RefreshDatabase;

    private const APPOINTMENTS_BEYOND_ONE_PAGE = 16;

    private function createAppointments(User $patient, int $count): void
    {
        $exam = Exam::create(['nome' => 'Hemograma', 'valor' => 50]);

        foreach (range(1, $count) as $hour) {
            Appointment::create([
                'user_id' => $patient->id,
                'tipo' => 'exame',
                'exame_id' => $exam->id,
                'date' => '2030-01-01',
                'time' => sprintf('%02d:00', $hour),
                'status' => 'pendente',
                'forma_pagamento' => 'particular',
            ]);
        }
    }

    public function test_lista_paginada_retorna_no_maximo_uma_pagina(): void
    {
        $patient = User::factory()->create();
        $this->createAppointments($patient, self::APPOINTMENTS_BEYOND_ONE_PAGE);

        Sanctum::actingAs($patient);
        $this->getJson('/api/agendamentos')
            ->assertStatus(200)
            ->assertJsonCount(15, 'data');
    }

    public function test_parametro_all_retorna_todos_os_agendamentos(): void
    {
        $patient = User::factory()->create();
        $this->createAppointments($patient, self::APPOINTMENTS_BEYOND_ONE_PAGE);

        Sanctum::actingAs($patient);
        // Without pagination (and with JsonResource::withoutWrapping) the
        // collection is returned as a root-level array, no "data" envelope.
        $this->getJson('/api/agendamentos?all=1')
            ->assertStatus(200)
            ->assertJsonCount(self::APPOINTMENTS_BEYOND_ONE_PAGE);
    }
}
