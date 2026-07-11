<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\User;

class ExamPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }
    public function update(User $user, Exam $exam): bool
    {
        return $user->role === 'admin';
    }
    public function delete(User $user, Exam $exam): bool
    {
        return $user->role === 'admin';
    }
}
