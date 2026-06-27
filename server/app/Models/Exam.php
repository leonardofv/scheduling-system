<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $table = 'exames';
    protected $fillable = ['nome', 'valor'];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'exame_id');
    }
}
