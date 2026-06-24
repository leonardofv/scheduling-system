<?php

namespace App\Http\Controllers;

use App\Models\Exame;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreExameRequest;
use App\Http\Requests\UpdateExameRequest;

class ExameController extends Controller
{
    public function store(StoreExameRequest $request): JsonResponse
    {
        $this->authorize('create', Exame::class);

        $exame = Exame::create($request->validated());
        return response()->json($exame, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Exame::all());
    }

    public function update(UpdateExameRequest $request, Exame $exame): JsonResponse
    {
        $this->authorize('update', $exame);

        $exame->update($request->validated());
        return response()->json($exame);
    }

    public function destroy(Exame $exame): JsonResponse
    {
        $this->authorize('delete', $exame);

        try {
            $exame->delete();
            return response()->json(["message" => "Exame excluído com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir exame: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir exame"], 500);
        }
    }
}
