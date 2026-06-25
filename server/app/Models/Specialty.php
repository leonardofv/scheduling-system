<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $table = 'especialidades';
    protected $fillable = ['nome', 'descricao'];

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'especialidade_id');
    }
}
