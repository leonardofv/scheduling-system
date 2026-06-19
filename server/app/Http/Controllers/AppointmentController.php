<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class AppointmentController extends Controller
{
    //registrar agendamento
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ]);

        $appointment = Appointment::create($data);

        return response()->json($appointment, 201);
    }

    //confirmar agendamento
    public function confirm(Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => 'confirmado']);
        return response()->json($appointment);
    }

    //cancelar agendamento
    public function cancel(Appointment $appointment, Request $request): JsonResponse
    {
        if($request->user()->role !== 'admin' && $appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Você só pode cancelar seus próprios agendamentos'
            ], 403);
        }

        $appointment->update(['status' => 'cancelado']);
        return response()->json($appointment);
    }

    //listar agendamentos
    public function list(): JsonResponse
    {
        $appointments = Appointment::all();
        return response()->json($appointments);
    }

    //atualizar agendamento
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        if($request->user()->role !== 'admin' && $appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Você só pode atualizar seus próprios agendamentos'
            ], 403);
        }

        $data = $request->validate([
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ]);

        $appointment->update($data);
        return response()->json($appointment);
    }

    //excluir agendamento
    public function destroy(Appointment $appointment): JsonResponse
    {
        try {
            $appointment->delete();
            return response()->json(["message" => "Agendamento excluído"], 200);
        }catch(Exception $e) {

            Log::error('Erro ao excluir agendamento: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir agendamento"], 500);
        }
    }
}
