<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'crm' => $this->crm,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'especialidade_id' => $this->especialidade_id,
            'specialty' => new SpecialtyResource($this->whenLoaded('specialty')),
        ];
    }
}
