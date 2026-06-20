<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;


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
        $appointment->update(['status' => 'confirmado']);
        return response()->json($appointment);
    }

    //cancelar agendamento
    public function cancel(Appointment $appointment, Request $request): JsonResponse
    {
        if($request->user()->role !== 'admin' && $appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Você só pode cancelar seus próprios agendamentos'
            ], 403);
        }

        $appointment->update(['status' => 'cancelado']);
        return response()->json($appointment);
    }

    //listar agendamentos
    public function list(): JsonResponse
    {
        $appointments = Appointment::all();
        return response()->json($appointments);
    }

    //atualizar agendamento
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        if($request->user()->role !== 'admin' && $appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Você só pode atualizar seus próprios agendamentos'
            ], 403);
        }

        $data = $request->validate([
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ]);

        if(isset($data['date']) || isset($data['time'])) {
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
    public function destroy(Appointment $appointment): JsonResponse
    {
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
        if(Carbon::parse("$date $time")->isPast()) {
            return response()->json([
                'message' => 'Não é possível agendar para uma data e horário no passado.'
            ], 422);
        }

        $conflict = Appointment::where('date', $date)
            ->where('time', $time)
            ->where('status', '!=', 'cancelado')
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
