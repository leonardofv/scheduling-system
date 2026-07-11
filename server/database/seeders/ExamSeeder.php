<?php

namespace Database\Seeders;

use App\Models\Exam;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Exam::insert([
            ['nome' => 'Hemograma Completo', 'valor' => 45.00, 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Eletrocardiograma', 'valor' => 120.00, 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Raio-X de Tórax', 'valor' => 90.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
