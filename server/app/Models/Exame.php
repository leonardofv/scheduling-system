<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exame extends Model
{
    protected $fillable = ['nome', 'valor'];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'exame_id');
    }
}
