<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAgendamentoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //rota store já protegida pelo auth:sanctum
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tipo' => 'required|in:consulta,retorno,exame',
            'medico_id' => 'required_if:tipo,consulta,retorno|exists:medicos,id',
            'exame_id' => 'required_if:tipo,exame|exists:exames,id',
            'agendamento_origem_id' => 'required_if:tipo,retorno|exists:agendamentos,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'observation' => 'nullable|string|max:255',
        ];
    }
}
