<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreSpecialtyRequest;
use App\Http\Requests\UpdateSpecialtyRequest;

class SpecialtyController extends Controller
{
    public function store(StoreSpecialtyRequest $request): JsonResponse
    {
        $this->authorize('create', Specialty::class);

        $specialty = Specialty::create($request->validated());
        return response()->json($specialty, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Specialty::all());
    }

    public function update(UpdateSpecialtyRequest $request, Specialty $specialty): JsonResponse
    {
        $this->authorize('update', $specialty);

        $specialty->update($request->validated());
        return response()->json($specialty);
    }

    public function destroy(Specialty $specialty): JsonResponse
    {
        $this->authorize('delete', $specialty);

        try {
            $specialty->delete();
            return response()->json(["message" => "Especialidade excluída com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir especialidade: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir especialidade"], 500);
        }
    }
}
