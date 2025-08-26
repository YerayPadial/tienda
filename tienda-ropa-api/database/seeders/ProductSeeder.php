<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            // 1 Collar Rojo Única
            [
                'id' => 20,
                'name' => 'Collar',
                'description' => 'Collar elegante para cualquier estilo.',
                'category' => 'Accesorios',
                'gender' => 'Unisex',
                'price' => 12.99,
                'images' => [],
            ],
            // 2 Sudadera Unisex (todas menos Única)
            [
                'id' => 21,
                'name' => 'Sudadera Básica',
                'description' => 'Sudadera cómoda para invierno y entretiempo.',
                'category' => 'Sudaderas',
                'gender' => 'Unisex',
                'price' => 29.99,
                'images' => [],
            ],
            // 3 Pantalón Deportivo
            [
                'id' => 22,
                'name' => 'Pantalón Deportivo',
                'description' => 'Pantalón ideal para hacer ejercicio y actividades al aire libre.',
                'category' => 'Pantalones',
                'gender' => 'Hombre',
                'price' => 24.99,
                'images' => [],
            ],
            // 4 Vestido Elegante
            [
                'id' => 23,
                'name' => 'Vestido Elegante',
                'description' => 'Vestido para ocasiones especiales y eventos formales.',
                'category' => 'Vestidos',
                'gender' => 'Mujer',
                'price' => 49.99,
                'images' => [],
            ],
            // 5 Camiseta Blanca
            [
                'id' => 24,
                'name' => 'Camiseta',
                'description' => 'Camiseta básica, ideal para cualquier ocasión.',
                'category' => 'Camisetas',
                'gender' => 'Unisex',
                'price' => 14.99,
                'images' => [],
            ],
            // 6 Gorra Verde Única
            [
                'id' => 25,
                'name' => 'Gorra',
                'description' => 'Gorra ajustable, perfecta para protegerse del sol.',
                'category' => 'Accesorios',
                'gender' => 'Unisex',
                'price' => 9.99,
                'images' => [],
            ],
            // 7 Chaqueta Azul
            [
                'id' => 26,
                'name' => 'Chaqueta',
                'description' => 'Chaqueta moderna, ideal para entretiempo.',
                'category' => 'Chaquetas',
                'gender' => 'Hombre',
                'price' => 39.99,
                'images' => [],
            ],
            // 8 Falda Negra
            [
                'id' => 27,
                'name' => 'Falda',
                'description' => 'Falda básica para looks casuales o formales.',
                'category' => 'Faldas',
                'gender' => 'Mujer',
                'price' => 34.99,
                'images' => [],
            ],
            // 9 Bufanda Azul Única
            [
                'id' => 28,
                'name' => 'Bufanda',
                'description' => 'Bufanda suave y cálida para los días fríos.',
                'category' => 'Accesorios',
                'gender' => 'Unisex',
                'price' => 11.99,
                'images' => [],
            ],
            // 10 Polo Verde
            [
                'id' => 29,
                'name' => 'Polo',
                'description' => 'Polo cómodo para hombre, perfecto para el día a día.',
                'category' => 'Polos',
                'gender' => 'Hombre',
                'price' => 19.99,
                'images' => [],
            ],
            // 11 Blusa Blanca
            [
                'id' => 30,
                'name' => 'Blusa',
                'description' => 'Blusa elegante y fresca para mujer.',
                'category' => 'Blusas',
                'gender' => 'Mujer',
                'price' => 27.99,
                'images' => [],
            ],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], $prod);
        }
    }
}
