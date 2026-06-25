<?php

namespace App\Http\Requests;

use App\Enums\AgendamentoTipo;
use App\Models\Agendamento;
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
            'medico_id' => 'required_if:tipo,consulta,retorno|prohibited_if:tipo,exame|exists:medicos,id',
            'exame_id' => 'required_if:tipo,exame|prohibited_if:tipo,consulta,retorno|exists:exames,id',
            'agendamento_origem_id' => [
                'required_if:tipo,retorno',
                'exists:agendamentos,id',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }
                    
                    $origem = Agendamento::where('id', $value)
                        ->where('user_id', $this->user()->id)
                        ->first();

                    if (!$origem) {
                        $fail('O agendamento de origem informado não pertence a você');
                        return;
                    }

                    if ($origem->tipo !== AgendamentoTipo::Consulta) {
                        $fail('O agendamento de origem deve ser uma consulta');
                        return;
                    }

                    if ((int) $origem->medico_id !== (int) $this->input('medico_id')) {
                        $fail('O retorno deve ser com o mesmo médico da consulta de origem');
                    }
                }
            ],
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'observation' => 'nullable|string|max:255',
        ];
    }
}
