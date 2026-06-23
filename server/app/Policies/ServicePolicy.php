<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Service $service): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Service $service): bool
    {
        return $user->role === 'admin';
    }
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
}
