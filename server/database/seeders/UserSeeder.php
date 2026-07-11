<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'password' => Hash::make('senha123'),
            'phone' => '(85) 99999-0001',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Cliente',
            'email' => 'cliente@email.com',
            'password' => Hash::make('senha123'),
            'phone' => '(85) 99999-0002',
        ]);
    }
}
