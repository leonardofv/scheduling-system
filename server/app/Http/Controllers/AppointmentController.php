<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Enums\AppointmentStatus;
use App\Services\AppointmentScheduler;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use Illuminate\Support\Facades\DB;


class AppointmentController extends Controller
{
    //registrar agendamento
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $appointment = null;

        $error = DB::transaction(function () use ($data, $request, &$appointment) {
            $conflict = $this->scheduler->findConflictMessage(
                $data['date'],
                $data['time'],
                $data['medico_id'] ?? null,
                $request->user()->id
            );
            if ($conflict) {
                return $conflict;
            }
            $appointment = $request->user()->appointments()->create($data);
            return null;
        });

        if ($error) {
            return response()->json([
                'message' => $error
            ], 422);
        }

        return response()->json($appointment, 201);
    }

    //confirmar agendamento
    public function confirm(Appointment $appointment): JsonResponse
    {
        $this->authorize('confirm', $appointment);

        if ($appointment->status !== AppointmentStatus::Pending) {
            return response()->json([
                'message' => 'Apenas agendamentos pendentes podem ser confirmados'
            ], 409);
        }
        if ($appointment->scheduleAt->isPast()) {
            return response()->json([
                'message' => 'Não é possível confirmar um agendamento com data/horário no passado'
            ], 422);
        }

        $appointment->update(['status' => AppointmentStatus::Confirmed]);
        return response()->json($appointment);
    }

    //cancelar agendamento
    public function cancel(Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        if ($appointment->status === AppointmentStatus::Cancelled) {
            return response()->json([
                'message' => 'Este agendamento já está cancelado'
            ], 409);
        }

        $appointment->update(['status' => AppointmentStatus::Cancelled]);
        return response()->json($appointment);
    }

    //listar agendamentos
    public function list(Request $request): JsonResponse
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->with(['user', 'doctor', 'exam'])
            ->when($user->role !== 'admin', fn($query) => $query->where('user_id', $user->id))
            ->latest('date')
            ->paginate(15);

        return response()->json($appointments);
    }

    //atualizar agendamento
    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('update', $appointment);

        if ($appointment->status === AppointmentStatus::Cancelled) {
            return response()->json([
                'message' => 'Agendamentos cancelados não podem ser alterados'
            ], 409);
        }

        $data = $request->validated();
        $changingSchedule = isset($data['date']) || isset($data['time']);

        if ($changingSchedule && $appointment->status === AppointmentStatus::Confirmed) {
            return response()->json([
                'message' => 'Para alterar a data/hora de um agendamento confirmado, cancele e crie um novo'
            ], 409);
        }

        $error = DB::transaction(function () use ($data, $appointment, $changingSchedule) {
            if ($changingSchedule) {

                $date = $data['date'] ?? $appointment->date;
                $time = $data['time'] ?? $appointment->time;

                $conflict = $this->scheduler->findConflictMessage(
                    $date,
                    $time,
                    $appointment->medico_id,
                    $appointment->user_id,
                    $appointment->id
                );

                if ($conflict) {
                    return $conflict;
                }
            }

            $appointment->update($data);
            return null;
        });

        if ($error) {
            return response()->json([
                'message' => $error
            ], 422);
        }

        return response()->json($appointment);
    }

    //excluir agendamento
    public function destroy(Appointment $appointment): JsonResponse
    {
        $this->authorize('delete', $appointment);

        try {
            $appointment->delete();
            return response()->json(["message" => "Agendamento excluído"], 200);
        } catch (Exception $e) {

            Log::error('Erro ao excluir agendamento: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir agendamento"], 500);
        }
    }

    public function markNoShow(Appointment $appointment): JsonResponse
    {
        $this->authorize('markNoShow', $appointment);

        if ($appointment->status !== AppointmentStatus::Confirmed) {
            return response()->json([
                'message' => 'Apenas agendamentos confirmados podem ser marcado como falta.'
            ], 409);
        }
        if (!$appointment->scheduleAt->isPast()) {
            return response()->json([
                'message' => 'Não é possível marcar falta antes do horário do agendamento'
            ], 422);
        }

        $appointment->update(['status' => AppointmentStatus::NoShow]);
        return response()->json($appointment);
    }

    public function __construct(private AppointmentScheduler $scheduler) {}
}
