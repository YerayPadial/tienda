<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::updateOrCreate([
            'id' => 20,
        ], [
            'name' => 'Sudadera Unisex',
            'description' => 'Sudadera cómoda para invierno.',
            'category' => 'Sudaderas',
            'gender' => 'Unisex',
            'price' => 29.99,
            'images' => ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
        ]);
        Product::updateOrCreate([
            'id' => 21,
        ], [
            'name' => 'Pantalón Deportivo',
            'description' => 'Pantalón ideal para hacer ejercicio.',
            'category' => 'Pantalones',
            'gender' => 'Hombre',
            'price' => 24.99,
            'images' => ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
        ]);
        Product::updateOrCreate([
            'id' => 22,
        ], [
            'name' => 'Vestido Elegante',
            'description' => 'Vestido para ocasiones especiales.',
            'category' => 'Vestidos',
            'gender' => 'Mujer',
            'price' => 49.99,
            'images' => ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
        ]);
    }
}
