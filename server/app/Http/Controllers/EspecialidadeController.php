<?php

namespace App\Http\Controllers;

use App\Models\Especialidade;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreEspecialidadeRequest;
use App\Http\Requests\UpdateEspecialidadeRequest;

class EspecialidadeController extends Controller
{
    public function store(StoreEspecialidadeRequest $request): JsonResponse
    {
        $this->authorize('create', Especialidade::class);

        $especialidade = Especialidade::create($request->validated());
        return response()->json($especialidade, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Especialidade::all());
    }

    public function update(UpdateEspecialidadeRequest $request, Especialidade $especialidade): JsonResponse
    {
        $this->authorize('update', $especialidade);

        $especialidade->update($request->validated());
        return response()->json($especialidade);
    }

    public function destroy(Especialidade $especialidade): JsonResponse
    {
        $this->authorize('delete', $especialidade);

        try {
            $especialidade->delete();
            return response()->json(["message" => "Especialidade excluída com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir especialidade: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir especialidade"], 500);
        }
    }
}
