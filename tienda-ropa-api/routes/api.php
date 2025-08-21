<?php

use App\Http\Controllers\ProductControllerCrud;
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
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\ImageController;

// Rutas públicas (clientes)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas públicas (empleados - panel admin)
Route::prefix('admin')->group(function () {
    Route::post('/login', [EmployeeAuthController::class, 'login']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/products/{product}', [ProductController::class, 'showDetail']);
Route::get('/sizes', [SizeController::class, 'index']);
Route::get('/colors', [ColorController::class, 'index']);
Route::get('/product-stocks', [ProductStockController::class, 'index']);

// Rutas que requieren autenticación de CLIENTES
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/name', [ProfileController::class, 'updateName']);
    Route::put('/profile/email', [ProfileController::class, 'updateEmail']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    Route::get('/user-orders', [OrderController::class, 'userOrders']);
    Route::get('/orders/{order}', [OrderController::class, 'orderDetail']);
});

// Rutas que requieren autenticación de EMPLEADOS (Panel Admin)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [EmployeeAuthController::class, 'logout']);
    Route::get('/me', [EmployeeAuthController::class, 'me']);

    // Upload de imágenes
    Route::post('/upload-image', [ImageController::class, 'upload']);
    Route::delete('/delete-image', [ImageController::class, 'delete']);

    // CRUD de empleados
    Route::apiResource('employees', EmployeeController::class);

    // CRUD de usuarios/clientes
    Route::apiResource('users', UserController::class);

    // CRUD de productos (admin puede hacer todo)
    Route::apiResource('products', ProductControllerCrud::class);

    // CRUD de pedidos (gestión completa)
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('order-products', OrderProductController::class);

    // Gestión de tallas y colores
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('colors', ColorController::class);
    Route::apiResource('product-stocks', ProductStockController::class);
});
