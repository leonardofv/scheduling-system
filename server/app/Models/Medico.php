<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    protected $fillable = ['nome', 'crm', 'email', 'telefone', 'especialidade_id'];

    public function specialty()
    {
        return $this->belongsTo(Especialidade::class, 'especialidade_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'medico_id');
    }
}
