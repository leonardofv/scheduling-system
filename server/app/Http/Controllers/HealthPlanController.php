<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHealthPlanRequest;
use App\Models\HealthPlan;
use Illuminate\Http\JsonResponse;

class HealthPlanController extends Controller
{
    public function store(StoreHealthPlanRequest $request): JsonResponse
    {
        $this->authorize('create', HealthPlan::class);

        $healthPlan = HealthPlan::create($request->validated());
        return response()->json($healthPlan->refresh()
        , 201);
    }
    public function list(): JsonResponse
    {
        return response()->json(
            HealthPlan::where('ativo', true)->get(['id', 'nome'])
        );
    }
}
