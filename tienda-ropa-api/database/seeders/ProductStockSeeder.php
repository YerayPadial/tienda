<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Size;
use App\Models\Color;
use App\Models\ProductStock;

class ProductStockSeeder extends Seeder
{
    public function run()
    {
        $products = Product::all();
        $sizes = Size::all();
        $colors = Color::all();

        foreach ($products as $product) {
            foreach ($sizes as $size) {
                foreach ($colors as $color) {
                    // Crear algunas combinaciones sin stock para probar la funcionalidad reactiva
                    $stock = rand(0, 25);
                    
                    // Hacer que algunas combinaciones específicas tengan 0 stock para pruebas
                    if (($size->id == 1 && $color->id == 1) || 
                        ($size->id == 2 && $color->id == 3) || 
                        (rand(1, 10) <= 2)) { // 20% de probabilidad de tener stock 0
                        $stock = 0;
                    }

                    ProductStock::create([
                        'product_id' => $product->id,
                        'size_id' => $size->id,
                        'color_id' => $color->id,
                        'stock' => $stock,
                    ]);
                }
            }
        }
    }
}
