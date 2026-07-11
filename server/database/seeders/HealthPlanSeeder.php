<?php

namespace Database\Seeders;

use App\Models\HealthPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HealthPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HealthPlan::insert([
            ['nome' => 'Unimed', 'ativo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Bradesco Saúde', 'ativo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Amil', 'ativo' => true, 'created_at' => now(), 'updated_at' => now()], 
        ]);
    }
}
