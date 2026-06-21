<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

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
            'status' => AppointmentStatus::class,
        ];
    }
    protected function time(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => Carbon::parse($value)->format('H:i:s')
        );
    }
    protected function scheduleAt(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::parse("{$this->date} {$this->time}")
        );
    }
}
