<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class HealthPlan extends Model
{
    protected $table = 'planos_saude';
    protected $fillable = ['nome', 'ativo'];

    #[Override]
    protected function casts(): array
    {
        return ['ativo' => 'boolean'];
    }
}
