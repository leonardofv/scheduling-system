<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Specialty::insert([
        ['nome' => 'Cardiologia', 'descricao' => 'Diagnóstico e tratamento de doenças do coração', 'created_at' => now(), 'updated_at' => now()],
        ['nome' => 'Dermatologia', 'descricao' => 'Cuidados com a pele, cabelos e unhas', 'created_at' => now(), 'updated_at' => now()],
        ['nome' => 'Pediatria', 'descricao' => 'Atendimento de crianças e adolescentes', 'created_at' => now(), 'updated_at' => now()],
    ]);
    }
}
