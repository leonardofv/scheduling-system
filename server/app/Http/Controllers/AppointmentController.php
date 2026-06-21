<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use App\Enums\AppointmentStatus;


class AppointmentController extends Controller
{
    //registrar agendamento
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ]);

        if($error = $this->validateDateTime($data['date'], $data['time'])) {
            return $error;
        }

        $appointment = $request->user()->appointments()->create($data);
        return response()->json($appointment, 201);
    }

    //confirmar agendamento
    public function confirm(Appointment $appointment): JsonResponse
    {
        $this->authorize('confirm', $appointment);

        if($appointment->status !== AppointmentStatus::Pendente) {
            return response()->json([
                'message' => 'Apenas agendamentos pendentes podem ser confirmados'
            ], 409);
        }

        $appointment->update(['status' => AppointmentStatus::Confirmado]);
        return response()->json($appointment);
    }

    //cancelar agendamento
    public function cancel(Appointment $appointment, Request $request): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        if($appointment->status === AppointmentStatus::Cancelado) {
            return response()->json([
                'message' => 'Este agendamento já está cancelado'
            ], 409);
        }

        $appointment->update(['status' => AppointmentStatus::Cancelado]);
        return response()->json($appointment);
    }

    //listar agendamentos
    public function list(Request $request): JsonResponse
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->with(['user', 'service'])
            ->when($user->role !== 'admin', fn ($query) => $query->where('user_id', $user->id))
            ->get();

        return response()->json($appointments);
    }

    //atualizar agendamento
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('update', $appointment);
        
        if($appointment->status === AppointmentStatus::Cancelado) {
            return response()->json([
                'message' => 'Agendamentos cancelados não podem ser alterados'
            ], 409);
        }
        // serviço não pode ser alterado após criação
        $data = $request->validate([
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ]);

        if(isset($data['date']) || isset($data['time'])) {
            if($appointment->status === AppointmentStatus::Confirmado) {
                return response()->json([
                    'message' => 'Para alterar a data/hora de um agendamento confirmado, cancele e crie um novo'
                ], 409);
            }
            
            $date = $data['date'] ?? $appointment->date;
            $time = $data['time'] ?? $appointment->time;

            if($error = $this->validateDateTime($date, $time, $appointment->id)) {
                return $error;
            }
        }

        $appointment->update($data);
        return response()->json($appointment);
    }

    //excluir agendamento
    public function delete(Appointment $appointment): JsonResponse
    {
        $this->authorize('delete', $appointment);

        try {
            $appointment->delete();
            return response()->json(["message" => "Agendamento excluído"], 200);
        }catch(Exception $e) {

            Log::error('Erro ao excluir agendamento: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir agendamento"], 500);
        }
    }

    private function validateDateTime(string $date, string $time, ?int $ignoreId = null): ?JsonResponse
    {
        $time = Carbon::parse($time)->format('H:i:s'); //normalizar horário

        if(Carbon::parse("$date $time")->isPast()) {
            return response()->json([
                'message' => 'Não é possível agendar para uma data e horário no passado.'
            ], 422);
        }

        $conflict = Appointment::where('date', $date)
            ->where('time', $time) //busca por '14:00:00
            ->where('status', '!=', AppointmentStatus::Cancelado->value)
            ->when($ignoreId, fn (Builder $query) => $query->where('id', '!=', $ignoreId))
            ->exists();
        
        if ($conflict) {
            return response()->json([
                'message' => 'Já existe agendamento para essa data e horário'
            ], 422);
        }
        return null;
    }
}
