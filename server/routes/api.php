<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// User
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'users']);

// Services
Route::get('/services', [ServiceController::class, 'list']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{service}', [ServiceController::class, 'update']);
Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

// Appointments
Route::get('/appointments', [AppointmentController::class, 'list']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);