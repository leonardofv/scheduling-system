<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class AppointmentScheduler
{
    public function findConflictMessage(string $date, string $time, ?int $medicoId, ?int $userId, ?int $ignoreId = null): ?string
    {
        $date = Carbon::parse($date)->format('Y-m-d');
        $time = Carbon::parse($time)->format('H:i:s'); //normalizar horário

        if (Carbon::parse("$date $time")->isPast()) {
            return 'Não é possível agendar para uma data e horário no passado.';
        }

        $baseQuery = fn() => Appointment::where('date', $date)
            ->where('time', $time)
            ->where('status', '!=', AppointmentStatus::Cancelled->value)
            ->when($ignoreId, fn(Builder $query) => $query->where('id', '!=', $ignoreId));

        // Médico atende um paciente por vez. Exame não é recurso exclusivo,
        // então não gera conflito entre pacientes diferentes.
        if ($medicoId) {
            $doctorConflict = $baseQuery()
                ->where('medico_id', $medicoId)
                ->exists();
            if ($doctorConflict) {
                return 'Já existe agendamento para esse médico nessa data e horário';
            }
        }

        $patientConflict = $baseQuery()
            ->where('user_id', $userId)
            ->exists();

        if ($patientConflict) {
            return 'Você já possui um agendamento para essa data e horário';
        }
        
        return null;
    }

    public function findFollowUpWindowViolation(Appointment $origin, ?string $followUpDate): ?string
    {
        if (!$followUpDate || !strtotime($followUpDate)) {
            return null; // a rule 'date_format' do request reporta o erro
        }

        $windowDays = config('scheduling.follow_up_window_days');
        $limit = Carbon::parse($origin->date)->addDays($windowDays);

        if (Carbon::parse($followUpDate)->gt($limit)) {
            return "O retorno deve ser marcado até {$windowDays} dias após a consulta de origem";
        }
        return null;
    }
}
