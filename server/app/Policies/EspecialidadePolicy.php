<?php

namespace App\Policies;

use App\Models\Especialidade;
use App\Models\User;

class EspecialidadePolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Especialidade $especialidade): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Especialidade $especialidade): bool
    {
        return $user->role === 'admin';
    }
}
