<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StatsController;
use Illuminate\Support\Facades\Route;

// Publik
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Wajib login
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/borrowings', [BorrowingController::class, 'index']);

    // Khusus customer
    Route::post('/borrowings', [BorrowingController::class, 'store'])->middleware('role:customer');

    // Khusus admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{book}', [BookController::class, 'update']);
        Route::delete('/books/{book}', [BookController::class, 'destroy']);
        Route::patch('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnBook']);
        Route::get('/stats', [StatsController::class, 'index']);
    });
});
