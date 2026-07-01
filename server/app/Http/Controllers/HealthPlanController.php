<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHealthPlanRequest;
use App\Http\Requests\UpdateHealthPlanRequest;
use App\Models\HealthPlan;
use Illuminate\Http\JsonResponse;

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
    public function list(): JsonResponse
    {
        return response()->json(
            HealthPlan::where('ativo', true)->get(['id', 'nome'])
        );
    }
}
