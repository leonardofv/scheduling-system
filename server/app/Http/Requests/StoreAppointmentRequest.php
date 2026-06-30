<?php

namespace App\Http\Requests;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Models\Appointment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
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
                'prohibited_unless:tipo,retorno',   // bloqueia o campo quando tipo for diferente de retorno
                'exists:agendamentos,id',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }

                    $origem = Appointment::where('id', $value)
                        ->where('user_id', $this->user()->id)
                        ->first();

                    if (!$origem) {
                        $fail('O agendamento de origem informado não pertence a você');
                        return;
                    }

                    if ($origem->tipo !== AppointmentType::Consultation) {
                        $fail('O agendamento de origem deve ser uma consulta');
                        return;
                    }

                    if ($origem->status !== AppointmentStatus::Confirmed) {
                        $fail('O retorno só pode ser criado a partir de uma consulta já confirmada');
                        return;
                    }

                    if (!$origem->scheduleAt->isPast()) {
                        $fail('O retorno só pode ser criado após a data e horário da consulta de origem');
                        return;
                    }

                    if ((int) $origem->medico_id !== (int) $this->input('medico_id')) {
                        $fail('O retorno deve ser com o mesmo médico da consulta de origem');
                    }
                },
            ],
            'forma_pagamento' => 'required|in:particular,plano',
            'plano_id' => [
                'required_if:forma_pagamento,plano',
                'prohibited_unless:forma_pagamento,plano',
                Rule::exists('planos_saude', 'id')->where('ativo', true), //garante escolher plano aceito pelo hospital
            ],
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'observation' => 'nullable|string|max:255',
        ];
    }
}
