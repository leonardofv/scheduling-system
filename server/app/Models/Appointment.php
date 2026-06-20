<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\AppointmentStatus;

#[Fillable(['user_id', 'service_id', 'date', 'time', 'observation', 'status'])]
class Appointment extends Model
{
    use HasFactory;
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    protected function casts(): array
    {
        return [
            'status' => AppointmentStatus::class
        ];
    }
}
