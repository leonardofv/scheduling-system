<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'crm' => 'required|string|max:20|unique:medicos,crm',
            'email' => 'nullable|email|max:255|unique:medicos,email',
            'telefone' => 'nullable|string|max:20',
            'especialidade_id' => 'required|exists:especialidades,id',
        ];
    }
}
