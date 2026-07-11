<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = [
            ['nome' => 'Dra. Ana Beatriz Rocha',  'crm' => 'CRM/CE 12345', 'especialidade' => 'Cardiologia'],
            ['nome' => 'Dr. Carlos Eduardo Lima', 'crm' => 'CRM/CE 23456', 'especialidade' => 'Cardiologia'],
            ['nome' => 'Dra. Fernanda Albuquerque', 'crm' => 'CRM/CE 34567', 'especialidade' => 'Dermatologia']
        ];

        $specialties = Specialty::pluck('id', 'nome');

        foreach ($doctors as $doctor) {
            Doctor::create([
                'nome' => $doctor['nome'],
                'crm' => $doctor['crm'],
                'email' => Str::slug($doctor['nome']) . '@clinica.example.com',
                'telefone' => '(85) 9' . fake()->numerify('####-####'),
                'especialidade_id' => $specialties[$doctor['especialidade']],
            ]);
        }
    }
}
