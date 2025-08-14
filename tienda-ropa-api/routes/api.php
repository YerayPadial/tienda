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

//Products
Route::apiResource('products', ProductController::class);
Route::apiResource('sizes', SizeController::class);
Route::apiResource('colors', ColorController::class);
Route::apiResource('product-stocks', ProductStockController::class);
Route::get('/products/{product}', [ProductController::class, 'showDetail']);

Route::apiResource('orders', OrderController::class);
Route::apiResource('order-products', OrderProductController::class);
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('users', UserController::class);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile', [ProfileController::class, 'update']); // Editar nombre y email juntos
Route::put('/profile/name', [ProfileController::class, 'updateName']); // Editar solo nombre
Route::put('/profile/email', [ProfileController::class, 'updateEmail']); // Editar solo email
Route::put('/profile/password', [ProfileController::class, 'changePassword']); // Cambiar contraseña

// Orders
Route::get('/user-orders', [OrderController::class, 'userOrders']);
Route::get('/orders/{order}', [OrderController::class, 'orderDetail']);

