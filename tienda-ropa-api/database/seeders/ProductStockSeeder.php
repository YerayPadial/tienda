<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductStock;

class ProductStockSeeder extends Seeder
{
    public function run()
    {
        $stocks = [
            // Collar Rojo Única
            ['product_id' => 20, 'size_id' => 25, 'color_id' => 23, 'stock' => 15], // Única Rojo

            // Sudadera Básica (todas menos Única)
            ['product_id' => 21, 'size_id' => 20, 'color_id' => 20, 'stock' => 6],  // XS Negro
            ['product_id' => 21, 'size_id' => 21, 'color_id' => 21, 'stock' => 8],  // S Blanco
            ['product_id' => 21, 'size_id' => 22, 'color_id' => 22, 'stock' => 12], // M Azul
            ['product_id' => 21, 'size_id' => 23, 'color_id' => 24, 'stock' => 7],  // L Verde
            ['product_id' => 21, 'size_id' => 24, 'color_id' => 20, 'stock' => 5],  // XL Negro

            // Pantalón Deportivo (M/L, Negro/Azul)
            ['product_id' => 22, 'size_id' => 22, 'color_id' => 20, 'stock' => 9],  // M Negro
            ['product_id' => 22, 'size_id' => 22, 'color_id' => 22, 'stock' => 6],  // M Azul
            ['product_id' => 22, 'size_id' => 23, 'color_id' => 20, 'stock' => 7],  // L Negro

            // Vestido Elegante (Única, Rojo/Azul)
            ['product_id' => 23, 'size_id' => 25, 'color_id' => 23, 'stock' => 4],  // Única Rojo
            ['product_id' => 23, 'size_id' => 25, 'color_id' => 22, 'stock' => 3],  // Única Azul

            // Camiseta Blanca (XS/S/M/L/XL, Blanco/Negro)
            ['product_id' => 24, 'size_id' => 20, 'color_id' => 21, 'stock' => 10], // XS Blanco
            ['product_id' => 24, 'size_id' => 21, 'color_id' => 21, 'stock' => 12], // S Blanco
            ['product_id' => 24, 'size_id' => 22, 'color_id' => 21, 'stock' => 14], // M Blanco
            ['product_id' => 24, 'size_id' => 23, 'color_id' => 21, 'stock' => 11], // L Blanco
            ['product_id' => 24, 'size_id' => 24, 'color_id' => 21, 'stock' => 9],  // XL Blanco
            ['product_id' => 24, 'size_id' => 22, 'color_id' => 20, 'stock' => 8],  // M Negro

            // Gorra Verde Única
            ['product_id' => 25, 'size_id' => 25, 'color_id' => 24, 'stock' => 16], // Única Verde

            // Chaqueta Azul (S/M/L/XL, Azul/Negro)
            ['product_id' => 26, 'size_id' => 21, 'color_id' => 22, 'stock' => 5],  // S Azul
            ['product_id' => 26, 'size_id' => 22, 'color_id' => 22, 'stock' => 8],  // M Azul
            ['product_id' => 26, 'size_id' => 23, 'color_id' => 22, 'stock' => 6],  // L Azul
            ['product_id' => 26, 'size_id' => 24, 'color_id' => 20, 'stock' => 4],  // XL Negro

            // Falda Negra (Única y S, Negro/Blanco)
            ['product_id' => 27, 'size_id' => 25, 'color_id' => 20, 'stock' => 7],  // Única Negro
            ['product_id' => 27, 'size_id' => 21, 'color_id' => 21, 'stock' => 5],  // S Blanco

            // Bufanda Azul Única
            ['product_id' => 28, 'size_id' => 25, 'color_id' => 22, 'stock' => 13], // Única Azul

            // Polo Verde (M/L/XL, Verde)
            ['product_id' => 29, 'size_id' => 22, 'color_id' => 24, 'stock' => 7],  // M Verde
            ['product_id' => 29, 'size_id' => 23, 'color_id' => 24, 'stock' => 9],  // L Verde
            ['product_id' => 29, 'size_id' => 24, 'color_id' => 24, 'stock' => 5],  // XL Verde

            // Blusa Blanca (S/M/L, Blanco)
            ['product_id' => 30, 'size_id' => 21, 'color_id' => 21, 'stock' => 6],  // S Blanco
            ['product_id' => 30, 'size_id' => 22, 'color_id' => 21, 'stock' => 5],  // M Blanco
            ['product_id' => 30, 'size_id' => 23, 'color_id' => 21, 'stock' => 4],  // L Blanco
        ];

        foreach ($stocks as $stock) {
            ProductStock::updateOrCreate([
                'product_id' => $stock['product_id'],
                'size_id' => $stock['size_id'],
                'color_id' => $stock['color_id'],
            ], $stock);
        }
    }
}
