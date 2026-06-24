<?php

namespace App\Policies;

use App\Models\Agendamento;
use App\Models\User;

class AgendamentoPolicy
{
    public function update(User $user, Agendamento $agendamento): bool
    {
        return $user->role === 'admin' || $agendamento->user_id === $user->id;
    }

    public function cancel(User $user, Agendamento $agendamento): bool
    {
        return $user->role === 'admin' || $agendamento->user_id === $user->id;
    }

    public function confirm(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function markNoShow(User $user): bool
    {
        return $user->role === 'admin';
    }
}
