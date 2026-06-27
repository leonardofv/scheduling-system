<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

#[Fillable(['user_id', 'tipo', 'medico_id', 'exame_id', 'agendamento_origem_id', 'date', 'time', 'observation', 'status'])]
class Appointment extends Model
{
    use HasFactory;
    protected $table = 'agendamentos';
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'medico_id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exame_id');
    }

    public function origin()
    {
        return $this->belongsTo(Appointment::class, 'agendamento_origem_id');
    }

    public function followUps()
    {
        return $this->hasMany(Appointment::class, 'agendamento_origem_id');
    }

    protected function casts(): array
    {
        return [
            'status' => AppointmentStatus::class,
            'tipo' => AppointmentType::class,
        ];
    }
    //Normalização da hora para H:m:s
    protected function time(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => Carbon::parse($value)->format('H:i:s')
        );
    }
    //normalização da data para Y-m-d
    protected function date(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => Carbon::parse($value)->format('Y-m-d')
        );
    }
    protected function scheduleAt(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::parse("{$this->date} {$this->time}")
        );
    }
}
