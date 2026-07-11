<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;

class DoctorPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Doctor $doctor): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Doctor $doctor): bool
    {
        return $user->role === 'admin';
    }
}
