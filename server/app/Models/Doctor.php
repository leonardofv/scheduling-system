<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'medicos';
    protected $fillable = ['nome', 'crm', 'email', 'telefone', 'especialidade_id'];

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'especialidade_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'medico_id');
    }
}
