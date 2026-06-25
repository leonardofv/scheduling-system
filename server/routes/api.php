<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpecialtyController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\DoctorController;
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
    Route::post('/agendamentos', [AppointmentController::class, 'store']);
    Route::get('/agendamentos', [AppointmentController::class, 'list']);
    Route::put('/agendamentos/{appointment}', [AppointmentController::class, 'update']);
    Route::patch('/agendamentos/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::get('/especialidades', [SpecialtyController::class, 'list']);
    Route::get('/medicos', [DoctorController::class, 'list']);
    Route::get('/exames', [ExamController::class, 'list']);
});

//Usuário Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function() {

    Route::get('/users', [AuthController::class, 'users']);

    Route::delete('/agendamentos/{appointment}', [AppointmentController::class, 'destroy']);
    Route::patch('/agendamentos/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::patch('/agendamentos/{appointment}/no-show', [AppointmentController::class, 'markNoShow']);

    Route::post('/especialidades', [SpecialtyController::class, 'store']);
    Route::put('/especialidades/{specialty}', [SpecialtyController::class, 'update']);
    Route::delete('/especialidades/{specialty}', [SpecialtyController::class, 'destroy']);

    Route::post('/medicos', [DoctorController::class, 'store']);
    Route::put('/medicos/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/medicos/{doctor}', [DoctorController::class, 'destroy']);

    Route::post('/exames', [ExamController::class, 'store']);
    Route::put('/exames/{exam}', [ExamController::class, 'update']);
    Route::delete('/exames/{exam}', [ExamController::class, 'destroy']);
});
