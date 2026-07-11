<?php

namespace App\Policies;

use App\Models\Specialty;
use App\Models\User;

class SpecialtyPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Specialty $specialty): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Specialty $specialty): bool
    {
        return $user->role === 'admin';
    }
}
