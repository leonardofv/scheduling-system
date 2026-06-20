<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    //cadastrar serviço
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'value' => 'required|numeric|min:0',
        ]);

        $service = Service::create($data);
        return response()->json($service, 201);
    }
    //listar serviços
    public function list():JsonResponse
    {   
        $data = Service::all();
        return response()->json($data);
    }

    //atualizar serviço
    public function update(Request $request, Service $service): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:255',
            'value' => 'sometimes|required|numeric|min:0',
        ]);

        $service->update($data);
        return response()->json($service);
    }

    //excluir serviço
    public function destroy(Service $service): JsonResponse
    {
        try {
            $service->delete();
            return response()->json(["message" => "Serviço excluído com sucesso"], 200);
        }catch(Exception $e) {
            Log::error('Erro ao excluir serviço: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir serviço"], 500);
        }
    }
}
