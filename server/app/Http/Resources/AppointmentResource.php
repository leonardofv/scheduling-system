<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'user_id' => $this->user_id,
            'tipo' => $this->tipo,
            'medico_id' => $this->medico_id,
            'exame_id' => $this->exame_id,
            'agendamento_origem_id' => $this->agendamento_origem_id,
            'plano_id' => $this->plano_id,
            'date' => $this->date,
            'time' => $this->time,
            'status' => $this->status,
            'forma_pagamento' => $this->forma_pagamento,
            'observation' => $this->observation,
            'created_at' => $this->created_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'exam' => new ExamResource($this->whenLoaded('exam')),
            'healthPlan' => new HealthPlanResource($this->whenLoaded('healthPlan')),
        ];
    }
}
