<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEspecialidadeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; //protegido por auth:sanctum + admin, e o controller chama a Policy
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string|max:255',
        ];
    }
}
