<?php

namespace App\Services;

use App\Enums\AgendamentoStatus;
use App\Models\Agendamento;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class AgendamentoScheduler
{
    public function findConflictMessage(string $date, string $time, ?int $medicoId, ?int $exameId, ?int $userId, ?int $ignoreId = null): ?string
    {
        $time = Carbon::parse($time)->format('H:i:s'); //normalizar horário

        if (Carbon::parse("$date $time")->isPast()) {
            return 'Não é possível agendar para uma data e horário no passado.';
        }

        $baseQuery = fn () => Agendamento::where('date', $date)
            ->where('time', $time)
            ->where('status', '!=', AgendamentoStatus::Cancelado->value)
            ->when($ignoreId, fn (Builder $query) => $query->where('id', '!=', $ignoreId));

        if ($medicoId || $exameId) {
            $resourceConflict = $baseQuery()
                ->where(function (Builder $query) use ($medicoId, $exameId) {
                    $query->when($medicoId, fn (Builder $q) => $q->orWhere('medico_id', $medicoId))
                        ->when($exameId, fn (Builder $q) => $q->orWhere('exame_id', $exameId));
                })
                ->exists();
            if ($resourceConflict) {
                return 'Já existe agendamento para esse médico/exame nessa data e horário';
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
}
