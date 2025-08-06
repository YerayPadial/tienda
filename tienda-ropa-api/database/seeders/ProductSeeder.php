<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'name' => 'Camiseta Deportiva',
            'description' => 'Camiseta transpirable para deporte.',
            'category' => 'Ropa deportiva',
            'gender' => 'Unisex',
            'price' => 19.99,
            'images' => json_encode(['camiseta1.jpg', 'camiseta2.jpg']),
        ]);
        Product::create([
            'name' => 'Pantalón Corto',
            'description' => 'Pantalón corto cómodo para verano.',
            'category' => 'Ropa casual',
            'gender' => 'Hombre',
            'price' => 24.99,
            'images' => json_encode(['pantalon1.jpg']),
        ]);
    }
}
