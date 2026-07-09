<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\PaymentMethod;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Exam;
use App\Models\HealthPlan;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = User::where('email', 'cliente@email.com')->firstOrFail();
        $doctors = Doctor::all();
        $exam = Exam::where('nome', 'Eletrocardiograma')->firstOrFail();
        $plan = HealthPlan::where('ativo', true)->firstOrFail();

        // Consulta passada confirmada (elegível como origem de retorno)
        Appointment::create([
            'user_id' => $client->id,
            'tipo' => AppointmentType::Consultation,
            'medico_id' => $doctors[0]->id,
            'date' => now()->subDays(10)->toDateString(),
            'time' => '09:00',
            'status' => AppointmentStatus::Confirmed,
            'forma_pagamento' => PaymentMethod::HealthPlan,
            'plano_id' => $plan->id,
        ]);

        // Consulta futura pendente
        Appointment::create([
            'user_id' => $client->id,
            'tipo' => AppointmentType::Consultation,
            'medico_id' => $doctors[1]->id,
            'date' => now()->addDays(5)->toDateString(),
            'time' => '10:30',
            'status' => AppointmentStatus::Pending,
            'forma_pagamento' => PaymentMethod::Private,
        ]);

        // Exame futuro confirmado
        Appointment::create([
            'user_id' => $client->id,
            'tipo' => AppointmentType::Exam,
            'exame_id' => $exam->id,
            'date' => now()->addDays(7)->toDateString(),
            'time' => '14:00',
            'status' => AppointmentStatus::Confirmed,
            'forma_pagamento' => PaymentMethod::Private,
        ]);
    }
}
