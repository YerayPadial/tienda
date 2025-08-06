<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\ProductStockController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderProductController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\UserController;

Route::apiResource('products', ProductController::class);
Route::apiResource('sizes', SizeController::class);
Route::apiResource('colors', ColorController::class);
Route::apiResource('product-stocks', ProductStockController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-products', OrderProductController::class);
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('users', UserController::class);
