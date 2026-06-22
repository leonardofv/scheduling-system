<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class AppointmentScheduler
{
    public function findConflictMessage(string $date, string $time, ?int $ignoreId = null): ?string
    {
        $time = Carbon::parse($time)->format('H:i:s'); //normalizar horário

        if (Carbon::parse("$date $time")->isPast()) {
            return 'Não é possível agendar para uma data e horário no passado.';
        }

        $conflict = Appointment::where('date', $date)
            ->where('time', $time) //busca por '14:00:00
            ->where('status', '!=', AppointmentStatus::Cancelado->value)
            ->when($ignoreId, fn(Builder $query) => $query->where('id', '!=', $ignoreId))
            ->exists();

        if ($conflict) {
            return 'Já existe agendamento para essa data e horário';
        }
        return null;
    }
}
