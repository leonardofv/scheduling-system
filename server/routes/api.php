<?php

use App\Http\Controllers\AgendamentoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EspecialidadeController;
use App\Http\Controllers\ExameController;
use App\Http\Controllers\MedicoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Qualquer usuário autenticado
Route::middleware('auth:sanctum')->group(function() {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/agendamentos', [AgendamentoController::class, 'store']);
    Route::get('/agendamentos', [AgendamentoController::class, 'list']);
    Route::put('/agendamentos/{agendamento}', [AgendamentoController::class, 'update']);
    Route::patch('/agendamentos/{agendamento}/cancel', [AgendamentoController::class, 'cancel']);
    Route::get('/especialidades', [EspecialidadeController::class, 'list']);
    Route::get('/medicos', [MedicoController::class, 'list']);
    Route::get('/exames', [ExameController::class, 'list']);
});

//Usuário Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function() {

    Route::get('/users', [AuthController::class, 'users']);

    Route::delete('/agendamentos/{agendamento}', [AgendamentoController::class, 'destroy']);
    Route::patch('/agendamentos/{agendamento}/confirm', [AgendamentoController::class, 'confirm']);
    Route::patch('/agendamentos/{agendamento}/no-show', [AgendamentoController::class, 'markNoShow']);

    Route::post('/especialidades', [EspecialidadeController::class, 'store']);
    Route::put('/especialidades/{especialidade}', [EspecialidadeController::class, 'update']);
    Route::delete('/especialidades/{especialidade}', [EspecialidadeController::class, 'destroy']);

    Route::post('/medicos', [MedicoController::class, 'store']);
    Route::put('/medicos/{medico}', [MedicoController::class, 'update']);
    Route::delete('/medicos/{medico}', [MedicoController::class, 'destroy']);

    Route::post('/exames', [ExameController::class, 'store']);
    Route::put('/exames/{exame}', [ExameController::class, 'update']);
    Route::delete('/exames/{exame}', [ExameController::class, 'destroy']);
});
