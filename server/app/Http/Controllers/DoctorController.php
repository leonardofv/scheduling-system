<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;

class DoctorController extends Controller
{
    public function store(StoreDoctorRequest $request): JsonResponse
    {
        $this->authorize('create', Doctor::class);

        $doctor = Doctor::create($request->validated());
        return response()->json($doctor, 201);
    }

    public function list(): JsonResponse
    {
        return response()->json(Doctor::with('specialty')->get());
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): JsonResponse
    {
        $this->authorize('update', $doctor);

        $doctor->update($request->validated());
        return response()->json($doctor);
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        $this->authorize('delete', $doctor);

        try {
            $doctor->delete();
            return response()->json(["message" => "Médico excluído com sucesso"], 200);
        } catch (Exception $e) {
            Log::error('Erro ao excluir médico: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir médico"], 500);
        }
    }
}
