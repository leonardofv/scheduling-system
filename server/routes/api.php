<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
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
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
});

//Usuário Admin
Route::middleware(['auth:sanctum', 'admin'])->group(function() {

    Route::get('/users', [AuthController::class, 'users']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
    
    Route::get('/appointments', [AppointmentController::class, 'list']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
});



