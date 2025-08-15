<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductStock;

class ProductStockSeeder extends Seeder
{
    public function run()
    {
        $stocks = [
            // Sudadera Unisex
            ['product_id' => 20, 'size_id' => 21, 'color_id' => 20, 'stock' => 10], // S Negro
            ['product_id' => 20, 'size_id' => 21, 'color_id' => 21, 'stock' => 7],  // S Blanco
            ['product_id' => 20, 'size_id' => 22, 'color_id' => 22, 'stock' => 8],  // M Azul
            ['product_id' => 20, 'size_id' => 23, 'color_id' => 24, 'stock' => 9],  // L Verde
            // Pantalón Deportivo
            ['product_id' => 21, 'size_id' => 22, 'color_id' => 21, 'stock' => 5],  // M Blanco
            ['product_id' => 21, 'size_id' => 22, 'color_id' => 20, 'stock' => 4],  // M Negro
            // Vestido Elegante
            ['product_id' => 22, 'size_id' => 25, 'color_id' => 23, 'stock' => 5],  // Única Rojo
            ['product_id' => 22, 'size_id' => 25, 'color_id' => 22, 'stock' => 3],  // Única Azul
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
