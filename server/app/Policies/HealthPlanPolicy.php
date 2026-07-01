<?php

namespace App\Policies;

use App\Models\HealthPlan;
use App\Models\User;
class HealthPlanPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, HealthPlan $healthPlan): bool
    {
        return $user->role === 'admin';
    }
}
