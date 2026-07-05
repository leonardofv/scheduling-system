<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreSpecialtyRequest;
use App\Http\Requests\UpdateSpecialtyRequest;
use App\Http\Resources\SpecialtyResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SpecialtyController extends Controller
{
    public function store(StoreSpecialtyRequest $request): JsonResponse
    {
        $this->authorize('create', Specialty::class);

        $specialty = Specialty::create($request->validated());
        return (new SpecialtyResource($specialty))->response()->setStatusCode(201);
    }

    public function list(): AnonymousResourceCollection
    {
        return SpecialtyResource::collection(Specialty::all());
    }

    public function update(UpdateSpecialtyRequest $request, Specialty $specialty): SpecialtyResource
    {
        $this->authorize('update', $specialty);

        $specialty->update($request->validated());
        return new SpecialtyResource($specialty);
    }

    public function destroy(Specialty $specialty): JsonResponse
    {
        $this->authorize('delete', $specialty);

        try {
            $specialty->delete();
            return response()->json(["message" => "Especialidade excluída com sucesso"], 200);
        } catch (QueryException $e) {
            if (str_starts_with($e->getCode(), '23')) {
                return response()->json([
                    'message' => 'Não é possível excluir: esta especialidade possui médicos vinculados'
                ], 409);
            }
            Log::error('Erro ao excluir especialidade: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir especialidade"], 500);
        } catch(Exception $e) {
            Log::error('Erro ao excluir especialidade: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir especialidade"], 500);
        }
    }
}
