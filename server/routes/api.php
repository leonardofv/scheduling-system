<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EspecialidadeController;
use App\Http\Controllers\ExameController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\ServiceController;
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
    Route::get('/services', [ServiceController::class, 'list']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'list']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::get('/especialidades', [EspecialidadeController::class, 'list']);
    Route::get('/medicos', [MedicoController::class, 'list']);
    Route::get('/exames', [ExameController::class, 'list']);
});

//Usuário Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function() {

    Route::get('/users', [AuthController::class, 'users']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::patch('/appointments/{appointment}/no-show', [AppointmentController::class, 'markNoShow']);

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



