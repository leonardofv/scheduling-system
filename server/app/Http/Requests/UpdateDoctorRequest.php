<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'sometimes|required|string|max:255',
            'crm' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('medicos', 'crm')->ignore($this->route('doctor'))],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('medicos', 'email')->ignore($this->route('doctor'))],
            'telefone' => 'nullable|string|max:20',
            'especialidade_id' => 'sometimes|required|exists:especialidades,id',
        ];
    }
}
