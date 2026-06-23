<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;

class ServiceController extends Controller
{
    //cadastrar serviço
    public function store(StoreServiceRequest $request): JsonResponse
    {
        $this->authorize('create', Service::class);

        $data = $request->validated();

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
    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorize('update', $service);

        $data = $request->validated();

        $service->update($data);
        return response()->json($service);
    }

    //excluir serviço
    public function destroy(Service $service): JsonResponse
    {
        $this->authorize('delete', $service);
        
        try {
            $service->delete();
            return response()->json(["message" => "Serviço excluído com sucesso"], 200);
        }catch(Exception $e) {
            Log::error('Erro ao excluir serviço: ' . $e->getMessage() . $e->getFile());
            return response()->json(["message" => "Erro ao excluir serviço"], 500);
        }
    }
}
