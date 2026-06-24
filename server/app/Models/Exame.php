<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exame extends Model
{
    protected $fillable = ['nome', 'valor'];

    public function agendamentos()
    {
        return $this->hasMany(Agendamento::class, 'exame_id');
    }
}
