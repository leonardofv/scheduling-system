<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMedicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'sometimes|required|string|max:255',
            'crm' => 'sometimes|required|string|max:20',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('medicos', 'email')->ignore($this->route('medico'))],
            'telefone' => 'nullable|string|max:20',
            'especialidade_id' => 'sometimes|required|exists:especialidades,id',
        ];
    }
}
