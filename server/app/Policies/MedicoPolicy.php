<?php

namespace App\Policies;

use App\Models\Medico;
use App\Models\User;

class MedicoPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Medico $medico): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Medico $medico): bool
    {
        return $user->role === 'admin';
    }
}
