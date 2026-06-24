<?php

namespace App\Http\Controllers;

use App\Models\Medico;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreMedicoRequest;
use App\Http\Requests\UpdateMedicoRequest;

class MedicoController extends Controller
{
    public function store(StoreMedicoRequest $request): JsonResponse
    {
        $this->authorize('create', Medico::class);

        $medico = Medico::create($request->validated());
        return response()->json($medico, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Medico::with('specialty')->get());
    }

    public function update(UpdateMedicoRequest $request, Medico $medico): JsonResponse
    {
        $this->authorize('update', $medico);

        $medico->update($request->validated());
        return response()->json($medico);
    }

    public function destroy(Medico $medico): JsonResponse
    {
        $this->authorize('delete', $medico);

        try {
            $medico->delete();
            return response()->json(["message" => "Médico excluído com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir médico: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir médico"], 500);
        }
    }
}
