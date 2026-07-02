<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHealthPlanRequest;
use App\Http\Requests\UpdateHealthPlanRequest;
use App\Models\HealthPlan;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class HealthPlanController extends Controller
{
    public function store(StoreHealthPlanRequest $request): JsonResponse
    {
        $this->authorize('create', HealthPlan::class);

        $healthPlan = HealthPlan::create($request->validated());
        return response()->json($healthPlan->refresh(), 201);
    }

    public function update(HealthPlan $healthPlan, UpdateHealthPlanRequest $request): JsonResponse
    {
        $this->authorize('update', $healthPlan);

        $healthPlan->update($request->validated());
        return response()->json($healthPlan);
    }
    //listagem dos planos ativos para pacientes
    public function list(): JsonResponse
    {
        return response()->json(
            HealthPlan::where('ativo', true)->get(['id', 'nome'])
        );
    }
    //listagem de todos os planos para admin
    public function listAll(): JsonResponse
    {
        return response()->json(HealthPlan::get(['id', 'nome', 'ativo']));
    }

    public function destroy(HealthPlan $healthPlan): JsonResponse
    {
        $this->authorize('delete', $healthPlan);

        if ($healthPlan->appointments()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir plano de saúde com agendamentos vinculados'
            ], 409);
        }

        try {
            $healthPlan->delete();
            
            return response()->json(['message' => 'Plano de saúde excluído com sucesso.'], 200);
        } catch(Exception $e) {
            Log::error('Erro ao excluir plano de saúde: ' . $e->getMessage() . $e->getFile());
            return response()->json(['message' => 'Erro ao excluir plano de saúde'], 500);
        }
    }
}
