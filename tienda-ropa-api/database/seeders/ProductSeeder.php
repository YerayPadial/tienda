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
            'images' => json_encode(['sudadera1.jpg']),
        ]);
        Product::updateOrCreate([
            'id' => 21,
        ], [
            'name' => 'Pantalón Deportivo',
            'description' => 'Pantalón ideal para hacer ejercicio.',
            'category' => 'Pantalones',
            'gender' => 'Hombre',
            'price' => 24.99,
            'images' => json_encode(['pantalon1.jpg']),
        ]);
        Product::updateOrCreate([
            'id' => 22,
        ], [
            'name' => 'Vestido Elegante',
            'description' => 'Vestido para ocasiones especiales.',
            'category' => 'Vestidos',
            'gender' => 'Mujer',
            'price' => 49.99,
            'images' => json_encode(['vestido1.jpg']),
        ]);
    }
}
