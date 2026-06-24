<?php

namespace App\Policies;

use App\Models\Exame;
use App\Models\User;

class ExamePolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Exame $exame): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Exame $exame): bool
    {
        return $user->role === 'admin';
    }
}
