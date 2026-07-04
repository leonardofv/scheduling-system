<?php

namespace App\Http\Requests;

use App\Enums\AppointmentType;
use App\Services\AppointmentScheduler;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => 'sometimes|required|date_format:Y-m-d',
            'time' => 'sometimes|required|date_format:H:i',
            'observation' => 'nullable|string|max:255'
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            /** @var Appointment $appointment */
            $appointment = $this->route('appointment');

            if ($appointment->tipo !== AppointmentType::FollowUp || !$this->filled('date')) {
                return;
            }

            $origin = $appointment->origin;
            if (!$origin) {
                return; // consulta de origem excluída (FK set null): sem referência para validar
            }

            $violation = app(AppointmentScheduler::class)
                ->findFollowUpWindowViolation($origin, $this->input('date'));
            if ($violation) {
                $validator->errors()->add('date', $violation);
            }
        });
    }
}
