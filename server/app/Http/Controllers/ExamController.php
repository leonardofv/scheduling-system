<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;

class ExamController extends Controller
{
    public function store(StoreExamRequest $request): JsonResponse
    {
        $this->authorize('create', Exam::class);

        $exam = Exam::create($request->validated());
        return response()->json($exam, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Exam::all());
    }

    public function update(UpdateExamRequest $request, Exam $exam): JsonResponse
    {
        $this->authorize('update', $exam);

        $exam->update($request->validated());
        return response()->json($exam);
    }

    public function destroy(Exam $exam): JsonResponse
    {
        $this->authorize('delete', $exam);

        try {
            $exam->delete();
            return response()->json(["message" => "Exame excluído com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir exame: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir exame"], 500);
        }
    }
}
