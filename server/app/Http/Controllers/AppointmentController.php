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
use App\Http\Resources\AppointmentResource;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;


class AppointmentController extends Controller
{
    //registrar agendamento
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $appointment = null;

        try {
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
        } catch (UniqueConstraintViolationException $e) {
            $message = str_contains($e->getMessage(), 'agendamento_origem_id') || str_contains($e->getMessage(), 'agendamentos_follow_up_unique') ?
                'Essa consulta já possui um retorno agendado' :
                'Esse horário foi preenchido recentemente';

            return response()->json(['message' => $message], 409);
        }

        if ($error) {
            return response()->json([
                'message' => $error
            ], 422);
        }

        return (new AppointmentResource($appointment))->response()->setStatusCode(201);
    }

    //confirmar agendamento
    public function confirm(Appointment $appointment): JsonResponse
    {
        $this->authorize('confirm', $appointment);

        return DB::transaction(function () use ($appointment) {
            // relê com lock: o status checado é o mesmo que será gravado
            $appointment = Appointment::lockForUpdate()->findOrFail($appointment->id);

            if ($appointment->status !== AppointmentStatus::Pending) {
                return response()->json([
                    'message' => 'Apenas agendamentos pendentes podem ser confirmados'
                ], 409);
            }
            $appointment->update(['status' => AppointmentStatus::Confirmed]);
            return (new AppointmentResource($appointment))->response();
        });
    }

    //cancelar agendamento
    public function cancel(Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        return DB::transaction(function () use ($appointment) {
            $appointment = Appointment::lockForUpdate()->findOrFail($appointment->id);

            if ($appointment->status === AppointmentStatus::Cancelled) {
                return response()->json([
                    'message' => 'Este agendamento já está cancelado'
                ], 409);
            }
            if (!in_array($appointment->status, [AppointmentStatus::Pending, AppointmentStatus::Confirmed], true)) {
                return response()->json([
                    'message' => 'Apenas agendamentos pendentes ou confirmados podem ser cancelados'
                ], 409);
            }
            $appointment->update(['status' => AppointmentStatus::Cancelled]);
            return (new AppointmentResource($appointment))->response();
        });
    }

    //listar agendamentos
    public function list(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $appointments = Appointment::query()
            ->with(['user', 'doctor', 'exam'])
            ->when($user->role !== 'admin', fn($query) => $query->where('user_id', $user->id))
            ->latest('date')
            ->orderBy('time', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        return AppointmentResource::collection($appointments);
    }

    //atualizar agendamento
    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        try {
            return DB::transaction(function () use ($request, $appointment) {
                $appointment = Appointment::lockForUpdate()->findOrFail($appointment->id);

                if ($appointment->status === AppointmentStatus::Cancelled) {
                    return response()->json(['message' => 'Agendamentos cancelados não podem ser alterados'], 409);
                }
                if ($appointment->status === AppointmentStatus::NoShow) {
                    return response()->json(['message' => 'Agendamentos marcados como falta não podem ser alterados.'], 409);
                }

                $data = $request->validated();
                $changingSchedule = isset($data['date']) || isset($data['time']);

                if ($changingSchedule && $appointment->status === AppointmentStatus::Confirmed) {
                    return response()->json(['message' => 'Para alterar a data/hora de um agendamento confirmado, cancele e crie um novo'], 409);
                }

                if ($changingSchedule) {
                    $conflict = $this->scheduler->findConflictMessage(
                        $data['date'] ?? $appointment->date,
                        $data['time'] ?? $appointment->time,
                        $appointment->medico_id,
                        $appointment->user_id,
                        $appointment->id
                    );
                    if ($conflict) {
                        return response()->json(['message' => $conflict], 422);
                    }
                }

                $appointment->update($data);
                return (new AppointmentResource($appointment))->response();
            });
        } catch (UniqueConstraintViolationException) {
            return response()->json(['message' => 'Esse horário foi preenchido recentemente.'], 409);
        }
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

        return DB::transaction(function () use ($appointment) {
            $appointment = Appointment::lockForUpdate()->findOrFail($appointment->id);

            if (!in_array($appointment->status, [AppointmentStatus::Pending, AppointmentStatus::Confirmed], true)) {
                return response()->json([
                    'message' => 'Apenas agendamentos pendentes ou confirmados podem ser marcado como falta.'
                ], 409);
            }
            if (!$appointment->scheduleAt->isPast()) {
                return response()->json([
                    'message' => 'Não é possível marcar falta antes do horário do agendamento'
                ], 422);
            }

            $appointment->update(['status' => AppointmentStatus::NoShow]);
            return (new AppointmentResource($appointment))->response();
        });
    }

    public function __construct(private AppointmentScheduler $scheduler) {}
}
