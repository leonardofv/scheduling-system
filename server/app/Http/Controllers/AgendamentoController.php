<?php

namespace App\Http\Controllers;

use App\Models\Agendamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Enums\AgendamentoStatus;
use App\Services\AgendamentoScheduler;
use App\Http\Requests\StoreAgendamentoRequest;
use App\Http\Requests\UpdateAgendamentoRequest;

class AgendamentoController extends Controller
{
    //registrar agendamento
    public function store(StoreAgendamentoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if($error = $this->scheduler->findConflictMessage($data['date'], $data['time'])) {
            return response()->json([
                'message' => $error
            ], 422);
        }

        $agendamento = $request->user()->agendamentos()->create($data);
        return response()->json($agendamento, 201);
    }

    //confirmar agendamento
    public function confirm(Agendamento $agendamento): JsonResponse
    {
        $this->authorize('confirm', $agendamento);

        if($agendamento->status !== AgendamentoStatus::Pendente) {
            return response()->json([
                'message' => 'Apenas agendamentos pendentes podem ser confirmados'
            ], 409);
        }
        if($agendamento->scheduleAt->isPast()) {
            return response()->json([
                'message' => 'Não é possível confirmar um agendamento com data/horário no passado'
            ], 422);
        }

        $agendamento->update(['status' => AgendamentoStatus::Confirmado]);
        return response()->json($agendamento);
    }

    //cancelar agendamento
    public function cancel(Agendamento $agendamento): JsonResponse
    {
        $this->authorize('cancel', $agendamento);

        if($agendamento->status === AgendamentoStatus::Cancelado) {
            return response()->json([
                'message' => 'Este agendamento já está cancelado'
            ], 409);
        }

        $agendamento->update(['status' => AgendamentoStatus::Cancelado]);
        return response()->json($agendamento);
    }

    //listar agendamentos
    public function list(Request $request): JsonResponse
    {
        $user = $request->user();

        $agendamentos = Agendamento::query()
            ->with(['user', 'doctor', 'exam'])
            ->when($user->role !== 'admin', fn ($query) => $query->where('user_id', $user->id))
            ->get();

        return response()->json($agendamentos);
    }

    //atualizar agendamento
    public function update(UpdateAgendamentoRequest $request, Agendamento $agendamento): JsonResponse
    {
        $this->authorize('update', $agendamento);

        if($agendamento->status === AgendamentoStatus::Cancelado) {
            return response()->json([
                'message' => 'Agendamentos cancelados não podem ser alterados'
            ], 409);
        }

        $data = $request->validated();

        if(isset($data['date']) || isset($data['time'])) {
            if($agendamento->status === AgendamentoStatus::Confirmado) {
                return response()->json([
                    'message' => 'Para alterar a data/hora de um agendamento confirmado, cancele e crie um novo'
                ], 409);
            }

            $date = $data['date'] ?? $agendamento->date;
            $time = $data['time'] ?? $agendamento->time;

            if($error = $this->scheduler->findConflictMessage($date, $time, $agendamento->id)) {
                return response()->json([
                    'message' => $error
                ], 422);
            }
        }

        $agendamento->update($data);
        return response()->json($agendamento);
    }

    //excluir agendamento
    public function destroy(Agendamento $agendamento): JsonResponse
    {
        $this->authorize('delete', $agendamento);

        try {
            $agendamento->delete();
            return response()->json(["message" => "Agendamento excluído"], 200);
        }catch(Exception $e) {

            Log::error('Erro ao excluir agendamento: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir agendamento"], 500);
        }
    }

    public function markNoShow(Agendamento $agendamento): JsonResponse
    {
        $this->authorize('markNoShow', $agendamento);

        if ($agendamento->status !== AgendamentoStatus::Confirmado) {
            return response()->json([
                'message' => 'Apenas agendamentos confirmados podem ser marcado como falta.'
            ], 409);
        }
        if (!$agendamento->scheduleAt->isPast()) {
            return response()->json([
                'message' => 'Não é possível marcar falta antes do horário do agendamento'
            ], 422);
        }

        $agendamento->update(['status' => AgendamentoStatus::Falta]);
        return response()->json($agendamento);
    }

    public function __construct(private AgendamentoScheduler $scheduler)
    {

    }

}
