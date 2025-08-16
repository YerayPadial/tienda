<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\ProductStockController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}', [ProductController::class, 'showDetail']);
Route::get('/sizes', [SizeController::class, 'index']);
Route::get('/colors', [ColorController::class, 'index']);
Route::get('/product-stocks', [ProductStockController::class, 'index']);

// Rutas que requieren autenticación
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('orders', OrderController::class);
    Route::apiResource('order-products', OrderProductController::class);
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('users', UserController::class);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/name', [ProfileController::class, 'updateName']);
    Route::put('/profile/email', [ProfileController::class, 'updateEmail']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/user-orders', [OrderController::class, 'userOrders']);
    Route::get('/orders/{order}', [OrderController::class, 'orderDetail']);
});
