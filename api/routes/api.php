<?php

use App\Http\Controllers\Api\MumineenController;
use App\Http\Controllers\Api\MiqaatController;
use App\Http\Controllers\Api\MiqaatEventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Mumineen Routes
Route::prefix('mumineen')->group(function () {
    Route::get('/', [MumineenController::class, 'index']);
    Route::post('/', [MumineenController::class, 'store']);
    Route::get('/search', [MumineenController::class, 'search']);
    Route::get('/{id}', [MumineenController::class, 'show']);
    Route::put('/{id}', [MumineenController::class, 'update']);
    Route::delete('/{id}', [MumineenController::class, 'destroy']);
});

// Miqaat Routes
Route::prefix('miqaats')->group(function () {
    Route::get('/', [MiqaatController::class, 'index']);
    Route::post('/', [MiqaatController::class, 'store']);
    Route::get('/upcoming', [MiqaatController::class, 'upcoming']);
    Route::get('/{id}/events', [MiqaatController::class, 'withEvents']);
    Route::get('/{id}', [MiqaatController::class, 'show']);
    Route::put('/{id}', [MiqaatController::class, 'update']);
    Route::delete('/{id}', [MiqaatController::class, 'destroy']);
    
    // Miqaat Event Routes (nested under miqaats)
    Route::prefix('/{miqaatId}/events')->group(function () {
        Route::get('/', [MiqaatEventController::class, 'index']);
        Route::post('/', [MiqaatEventController::class, 'store']);
        Route::get('/{id}', [MiqaatEventController::class, 'show']);
        Route::put('/{id}', [MiqaatEventController::class, 'update']);
        Route::delete('/{id}', [MiqaatEventController::class, 'destroy']);
    });
});
