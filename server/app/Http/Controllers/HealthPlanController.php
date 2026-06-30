<?php

namespace App\Http\Controllers;

use App\Models\HealthPlan;
use Illuminate\Http\JsonResponse;

class HealthPlanController extends Controller
{
    public function list(): JsonResponse
    {

        return response()->json(
            HealthPlan::where('ativo', true)->get(['id', 'nome'])
        );
    }
}
